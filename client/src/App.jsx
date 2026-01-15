import { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import NameInput from './components/NameInput';
import ChessBoard from './components/ChessBoard';
import PlayerInfo from './components/PlayerInfo';
import ScoreBoard from './components/ScoreBoard';
import ControlPanel from './components/ControlPanel';

function App() {
  const [playerName, setPlayerName] = useState('');
  const [player, setPlayer] = useState(null);
  const [gameState, setGameState] = useState({
    board: Array(15).fill(null).map(() => Array(15).fill(0)),
    players: [],
    currentPlayer: 1,
    scores: { black: 0, white: 0 },
    isPlaying: false,
    gameOver: false,
    lastMove: null
  });
  const [waiting, setWaiting] = useState(false);
  const [gameMessage, setGameMessage] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const socketRef = useRef(null);

  useEffect(() => {
    console.log('=== 初始化 Socket ===');
    
    // 创建Socket实例
    const socket = io('/', {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
      timeout: 10000
    });
    
    // 存储到ref中
    socketRef.current = socket;
    
    console.log('Socket实例已创建，ID:', socket.id);
    
    socketRef.current.on('connect', () => {
      console.log('✓ 成功连接到服务器');
      console.log('Socket ID:', socket.id);
      setIsConnected(true);
      setErrorMessage('');
    });

    socketRef.current.on('disconnect', (reason) => {
      console.log('✗ 与服务器断开连接:', reason);
      setIsConnected(false);
      setErrorMessage('与服务器断开连接，请刷新页面重试');
    });

    socketRef.current.on('connect_error', (error) => {
      console.error('✗ 连接错误:', error);
      console.error('错误详情:', error.message);
      setIsConnected(false);
      setErrorMessage(`无法连接到服务器: ${error.message}`);
    });

    socketRef.current.on('join_success', ({ player: joinedPlayer, totalPlayers }) => {
      console.log('✓ 加入成功:', joinedPlayer);
      setPlayer(joinedPlayer);
      setWaiting(totalPlayers < 2);
      setErrorMessage('');
    });

    socketRef.current.on('error', (message) => {
      console.error('✗ 服务器错误:', message);
      setErrorMessage(message);
    });

    socketRef.current.on('game_state', (state) => {
      setGameState(prev => ({
        ...prev,
        players: state.players,
        currentPlayer: state.currentPlayer,
        scores: state.scores,
        isPlaying: state.isPlaying,
        gameOver: state.gameOver
      }));
      if (state.players.length < 2) {
        setWaiting(true);
        setGameMessage('等待另一个玩家加入...');
      }
    });

    socketRef.current.on('game_start', (data) => {
      setWaiting(false);
      setGameState(prev => ({
        ...prev,
        players: data.players,
        currentPlayer: data.currentPlayer,
        scores: data.scores,
        isPlaying: true,
        gameOver: false,
        board: Array(15).fill(null).map(() => Array(15).fill(0))
      }));
      setGameMessage('游戏开始！');
    });

    socketRef.current.on('move_made', (data) => {
      setGameState(prev => ({
        ...prev,
        board: data.board,
        currentPlayer: data.currentPlayer,
        lastMove: data.lastMove
      }));
    });

    socketRef.current.on('game_over', (data) => {
      setGameState(prev => ({
        ...prev,
        board: data.board,
        scores: data.scores,
        gameOver: true,
        lastMove: data.lastMove
      }));
      setGameMessage(`游戏结束！${data.winnerName} 获胜！`);
    });

    socketRef.current.on('undo_success', (data) => {
      setGameState(prev => ({
        ...prev,
        board: data.board,
        currentPlayer: data.currentPlayer,
        lastMove: data.lastMove
      }));
    });

    socketRef.current.on('player_resign', (data) => {
      setGameState(prev => ({
        ...prev,
        scores: data.scores,
        gameOver: true
      }));
      setGameMessage(`${data.loserName} 认输，${data.winnerName} 获胜！`);
    });

    socketRef.current.on('game_restarted', (data) => {
      setGameState(prev => ({
        ...prev,
        board: data.board,
        currentPlayer: data.currentPlayer,
        isPlaying: data.isPlaying,
        gameOver: data.gameOver,
        lastMove: null
      }));
      setGameMessage('游戏已重新开始');
    });

    socketRef.current.on('game_reset', (data) => {
      setGameState(prev => ({
        ...prev,
        board: Array(15).fill(null).map(() => Array(15).fill(0)),
        players: [],
        currentPlayer: 1,
        scores: { black: 0, white: 0 },
        isPlaying: false,
        gameOver: false,
        lastMove: null
      }));
      setPlayer(null);
      setWaiting(false);
      setGameMessage(data.message);
    });

    socketRef.current.on('error', (message) => {
      setGameMessage(message);
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  const handleJoinGame = (name) => {
    console.log('=== 开始加入游戏 ===');
    console.log('输入的昵称:', name);

    if (!name.trim()) {
      console.log('错误: 昵称为空');
      setErrorMessage('请输入昵称');
      return;
    }

    console.log('Socket连接状态:', socketRef.current?.connected);
    console.log('isConnected状态:', isConnected);

    // 直接检查socket.connected，而不是isConnected
    if (!socketRef.current || !socketRef.current.connected) {
      console.log('错误: Socket未连接');
      setErrorMessage('无法连接到服务器，请刷新页面重试');
      return;
    }

    setPlayerName(name);
    setErrorMessage('');
    console.log('发送加入游戏请求:', name);
    socketRef.current.emit('join_game', name);
    console.log('请求已发送');
  };

  const handleMakeMove = (row, col) => {
    if (!player || gameState.gameOver || !gameState.isPlaying) return;
    if (gameState.currentPlayer !== player.color) return;

    socketRef.current.emit('make_move', { row, col, color: player.color });
  };

  const handleUndo = () => {
    if (!player || gameState.gameOver) return;
    if (gameState.currentPlayer !== player.color) return;

    socketRef.current.emit('request_undo');
  };

  const handleResign = () => {
    if (!player || gameState.gameOver) return;
    socketRef.current.emit('resign');
  };

  const handleRestart = () => {
    socketRef.current.emit('restart_game');
  };

  const isMyTurn = player && gameState.currentPlayer === player.color && !gameState.gameOver;

  if (!player) {
    return (
      <div>
        <NameInput onJoin={handleJoinGame} />
        {errorMessage && (
          <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded shadow-lg">
            {errorMessage}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="h-screen w-full bg-primary-bg flex flex-col items-center justify-center p-4">
      {/* 标题 */}
      <h1 className="text-4xl font-bold text-text-primary mb-4">五子棋</h1>

      {/* 游戏消息 */}
      {gameMessage && (
        <div className="mb-4 px-6 py-2 bg-white rounded-lg shadow-md text-text-primary font-medium">
          {gameMessage}
        </div>
      )}

      {/* 等待提示 */}
      {waiting && (
        <div className="mb-4 px-6 py-3 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-700">
          等待另一个玩家加入...
        </div>
      )}

      {/* 主游戏区域 */}
      <div className="flex flex-col lg:flex-row gap-6 items-center">
        {/* 左侧玩家信息 */}
        {gameState.players.length > 0 && (
          <div className="flex flex-col gap-4">
            {gameState.players.map(p => (
              <PlayerInfo
                key={p.id}
                name={p.name}
                color={p.color}
                isCurrentPlayer={gameState.currentPlayer === p.color}
                isMe={player && p.id === player.id}
              />
            ))}
          </div>
        )}

        {/* 棋盘 */}
        <ChessBoard
          board={gameState.board}
          lastMove={gameState.lastMove}
          onMove={handleMakeMove}
          disabled={waiting || gameState.gameOver || !isMyTurn}
        />

        {/* 右侧控制面板 */}
        <div className="flex flex-col gap-4">
          <ScoreBoard scores={gameState.scores} />
          <ControlPanel
            onUndo={handleUndo}
            onResign={handleResign}
            onRestart={handleRestart}
            canUndo={isMyTurn}
            canResign={!gameState.gameOver}
            canRestart={gameState.gameOver}
          />
        </div>
      </div>

      {/* 底部状态 */}
      <div className="mt-6 text-text-secondary text-sm">
        {gameState.isPlaying && !gameState.gameOver && (
          <span>
            {isMyTurn ? '轮到你落子' : '等待对方落子'}
          </span>
        )}
      </div>
    </div>
  );
}

export default App;
