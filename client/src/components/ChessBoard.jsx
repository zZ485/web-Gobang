import { useEffect, useRef } from 'react';

function ChessBoard({ board, lastMove, onMove, disabled }) {
  const canvasRef = useRef(null);
  const cellSize = 40;
  const padding = 30;

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
  }, [board, lastMove]);

  const handleClick = (e) => {
    if (disabled) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

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
    <div className="relative">
      <canvas
        ref={canvasRef}
        width={padding * 2 + 14 * cellSize}
        height={padding * 2 + 14 * cellSize}
        onClick={handleClick}
        className={`board-shadow rounded-lg cursor-pointer ${disabled ? 'cursor-not-allowed opacity-70' : ''}`}
      />
    </div>
  );
}

export default ChessBoard;
