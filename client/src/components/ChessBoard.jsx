import { useEffect, useRef, useState } from 'react';

function ChessBoard({ board, lastMove, onMove, disabled }) {
  const canvasRef = useRef(null);
  const [cellSize, setCellSize] = useState(40);
  const [padding, setPadding] = useState(30);

  // 响应式调整棋盘大小
  useEffect(() => {
    const updateBoardSize = () => {
      const screenWidth = window.innerWidth;
      const screenHeight = window.innerHeight;

      // 计算可用空间（保留一些边距）
      const availableWidth = screenWidth - 32; // 左右各 16px padding
      const availableHeight = screenHeight - 250; // 顶部标题、消息等约 150px + 底部约 100px

      // 计算合适的格子大小
      const newCellSize = Math.min(
        Math.floor(availableWidth / 14),  // 14 个格子
        Math.floor(availableHeight / 14)
      );

      // 确保最小格子大小为 20px，最大为 40px
      const finalCellSize = Math.max(20, Math.min(40, newCellSize));
      const finalPadding = Math.max(15, Math.floor(finalCellSize * 0.75));

      setCellSize(finalCellSize);
      setPadding(finalPadding);
    };

    updateBoardSize();
    window.addEventListener('resize', updateBoardSize);

    return () => window.removeEventListener('resize', updateBoardSize);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 绘制棋盘背景
    ctx.fillStyle = '#EDF2F7';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 绘制棋盘线
    ctx.strokeStyle = '#CBD5E0';
    ctx.lineWidth = 1;

    for (let i = 0; i < 15; i++) {
      // 横线
      ctx.beginPath();
      ctx.moveTo(padding, padding + i * cellSize);
      ctx.lineTo(padding + 14 * cellSize, padding + i * cellSize);
      ctx.stroke();

      // 竖线
      ctx.beginPath();
      ctx.moveTo(padding + i * cellSize, padding);
      ctx.lineTo(padding + i * cellSize, padding + 14 * cellSize);
      ctx.stroke();
    }

    // 绘制天元和星位
    const stars = [
      [3, 3], [3, 11], [7, 7], [11, 3], [11, 11]
    ];

    ctx.fillStyle = '#4A5568';
    stars.forEach(([row, col]) => {
      ctx.beginPath();
      ctx.arc(padding + col * cellSize, padding + row * cellSize, 3, 0, Math.PI * 2);
      ctx.fill();
    });

    // 绘制棋子
    for (let row = 0; row < 15; row++) {
      for (let col = 0; col < 15; col++) {
        if (board[row][col] !== 0) {
          const x = padding + col * cellSize;
          const y = padding + row * cellSize;
          const radius = cellSize / 2 - 2;

          ctx.beginPath();
          ctx.arc(x, y, radius, 0, Math.PI * 2);

          if (board[row][col] === 1) {
            // 黑棋
            const gradient = ctx.createRadialGradient(x - 3, y - 3, 0, x, y, radius);
            gradient.addColorStop(0, '#4A5568');
            gradient.addColorStop(1, '#2D3748');
            ctx.fillStyle = gradient;
          } else {
            // 白棋
            const gradient = ctx.createRadialGradient(x - 3, y - 3, 0, x, y, radius);
            gradient.addColorStop(0, '#FFFFFF');
            gradient.addColorStop(1, '#E2E8F0');
            ctx.fillStyle = gradient;
          }

          ctx.fill();

          // 添加阴影
          ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
          ctx.shadowBlur = 3;
          ctx.shadowOffsetX = 1;
          ctx.shadowOffsetY = 1;
          ctx.fill();
          ctx.shadowColor = 'transparent';
        }
      }
    }

    // 标记最后一步
    if (lastMove) {
      const x = padding + lastMove.col * cellSize;
      const y = padding + lastMove.row * cellSize;

      ctx.strokeStyle = '#4299E1';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(x - 5, y);
      ctx.lineTo(x + 5, y);
      ctx.moveTo(x, y - 5);
      ctx.lineTo(x, y + 5);
      ctx.stroke();
    }
  }, [board, lastMove, cellSize, padding]);

  const handleClick = (e) => {
    if (disabled) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    const col = Math.round((x - padding) / cellSize);
    const row = Math.round((y - padding) / cellSize);

    if (row >= 0 && row < 15 && col >= 0 && col < 15) {
      const centerX = padding + col * cellSize;
      const centerY = padding + row * cellSize;
      const distance = Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2);

      if (distance < cellSize / 2 && board[row][col] === 0) {
        onMove(row, col);
      }
    }
  };

  return (
    <div className="relative max-w-full">
      <canvas
        ref={canvasRef}
        width={padding * 2 + 14 * cellSize}
        height={padding * 2 + 14 * cellSize}
        onClick={handleClick}
        className={`board-shadow rounded-lg cursor-pointer max-w-full h-auto ${disabled ? 'cursor-not-allowed opacity-70' : ''}`}
        style={{ touchAction: 'none' }}
      />
    </div>
  );
}

export default ChessBoard;
