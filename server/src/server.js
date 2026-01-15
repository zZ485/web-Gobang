import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { checkWin, initBoard, isValidMove } from './gameLogic.js';

const app = express();
app.use(cors());

const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true
  },
  transports: ['websocket', 'polling']
});

const PORT = process.env.PORT || 3001;

// 游戏房间状态
const gameState = {
  players: [], // {id, name, color, socketId}
  board: initBoard(),
  currentPlayer: 1, // 1: 黑棋, 2: 白棋
  scores: { black: 0, white: 0 },
  isPlaying: false,
  gameOver: false,
  lastMove: null,
  history: [] // 用于悔棋
};

// Socket连接处理
io.on('connection', (socket) => {
  console.log('✓ 新用户连接:', socket.id);
  console.log('  传输方式:', socket.conn.transport.name);
  console.log('  当前连接数:', io.engine.clientsCount);

  // 记录所有连接的socket
  console.log('  所有连接ID:', Array.from(io.sockets.sockets).map(s => s[0]));

  // 玩家加入游戏
  socket.on('join_game', (playerName) => {
    if (gameState.players.length >= 2) {
      socket.emit('error', '房间已满');
      return;
    }

    // 分配颜色
    const color = gameState.players.length === 0 ? 1 : 2;
    const player = {
      id: socket.id,
      name: playerName,
      color: color,
      socketId: socket.id
    };

    gameState.players.push(player);

    // 如果两个玩家都加入了，开始游戏
    if (gameState.players.length === 2) {
      gameState.isPlaying = true;
      gameState.gameOver = false;
      io.emit('game_start', {
        players: gameState.players.map(p => ({
          id: p.id,
          name: p.name,
          color: p.color
        })),
        currentPlayer: gameState.currentPlayer,
        scores: gameState.scores
      });
    }

    // 向当前玩家发送加入成功消息
    socket.emit('join_success', {
      player,
      totalPlayers: gameState.players.length
    });

    // 通知所有玩家当前状态
    io.emit('game_state', {
      players: gameState.players.map(p => ({
        id: p.id,
        name: p.name,
        color: p.color
      })),
      currentPlayer: gameState.currentPlayer,
      scores: gameState.scores,
      isPlaying: gameState.isPlaying,
      gameOver: gameState.gameOver
    });

    console.log(`玩家 ${playerName} 加入, 颜色: ${color === 1 ? '黑棋' : '白棋'}`);
  });

  // 玩家落子
  socket.on('make_move', ({ row, col, color }) => {
    // 验证是否轮到该玩家
    if (!gameState.isPlaying || gameState.gameOver) {
      return;
    }

    const player = gameState.players.find(p => p.id === socket.id);
    if (!player || player.color !== gameState.currentPlayer) {
      socket.emit('error', '不是你的回合');
      return;
    }

    // 验证移动是否合法
    if (!isValidMove(gameState.board, row, col)) {
      socket.emit('error', '无效的移动');
      return;
    }

    // 记录历史用于悔棋
    gameState.history.push({
      board: JSON.parse(JSON.stringify(gameState.board)),
      currentPlayer: gameState.currentPlayer
    });

    // 更新棋盘
    gameState.board[row][col] = color;
    gameState.lastMove = { row, col };

    // 检查是否获胜
    if (checkWin(gameState.board, row, col, color)) {
      gameState.gameOver = true;
      const winner = color === 1 ? 'black' : 'white';
      gameState.scores[winner]++;

      io.emit('game_over', {
        winner: color,
        winnerName: player.name,
        board: gameState.board,
        lastMove: gameState.lastMove,
        scores: gameState.scores
      });
    } else {
      // 切换玩家
      gameState.currentPlayer = gameState.currentPlayer === 1 ? 2 : 1;

      io.emit('move_made', {
        row,
        col,
        color,
        board: gameState.board,
        currentPlayer: gameState.currentPlayer,
        lastMove: gameState.lastMove
      });
    }
  });

  // 悔棋请求
  socket.on('request_undo', () => {
    if (gameState.history.length === 0) {
      socket.emit('error', '无法悔棋');
      return;
    }

    const player = gameState.players.find(p => p.id === socket.id);
    if (!player || player.color !== gameState.currentPlayer) {
      socket.emit('error', '不是你的回合');
      return;
    }

    // 恢复上一步状态
    const lastState = gameState.history.pop();
    gameState.board = lastState.board;
    gameState.currentPlayer = lastState.currentPlayer;
    gameState.lastMove = null;

    io.emit('undo_success', {
      board: gameState.board,
      currentPlayer: gameState.currentPlayer,
      lastMove: gameState.lastMove
    });
  });

  // 认输
  socket.on('resign', () => {
    const player = gameState.players.find(p => p.id === socket.id);
    if (!player) return;

    const winnerColor = player.color === 1 ? 2 : 1;
    const winner = gameState.players.find(p => p.color === winnerColor);

    gameState.gameOver = true;
    const winnerKey = winnerColor === 1 ? 'black' : 'white';
    gameState.scores[winnerKey]++;

    io.emit('player_resign', {
      winner: winnerColor,
      winnerName: winner ? winner.name : '未知',
      loserName: player.name,
      scores: gameState.scores
    });
  });

  // 重新开始游戏
  socket.on('restart_game', () => {
    gameState.board = initBoard();
    gameState.currentPlayer = 1;
    gameState.isPlaying = true;
    gameState.gameOver = false;
    gameState.lastMove = null;
    gameState.history = [];

    io.emit('game_restarted', {
      board: gameState.board,
      currentPlayer: gameState.currentPlayer,
      isPlaying: gameState.isPlaying,
      gameOver: gameState.gameOver
    });
  });

  // 玩家断开连接
  socket.on('disconnect', () => {
    console.log('用户断开连接:', socket.id);

    // 移除玩家
    gameState.players = gameState.players.filter(p => p.id !== socket.id);

    // 重置游戏状态
    if (gameState.players.length < 2) {
      gameState.board = initBoard();
      gameState.currentPlayer = 1;
      gameState.isPlaying = false;
      gameState.gameOver = false;
      gameState.lastMove = null;
      gameState.history = [];
      gameState.scores = { black: 0, white: 0 };

      io.emit('game_reset', {
        message: '有玩家离开，游戏已重置'
      });
    }

    // 通知所有玩家
    io.emit('game_state', {
      players: gameState.players.map(p => ({
        id: p.id,
        name: p.name,
        color: p.color
      })),
      currentPlayer: gameState.currentPlayer,
      scores: gameState.scores,
      isPlaying: gameState.isPlaying,
      gameOver: gameState.gameOver
    });
  });
});

httpServer.listen(PORT, () => {
  console.log(`五子棋服务器运行在端口 ${PORT}`);
});
