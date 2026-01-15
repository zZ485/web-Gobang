// 五子棋游戏逻辑

// 检查是否有五子连珠
export function checkWin(board, row, col, player) {
  const directions = [
    [[0, 1], [0, -1]],   // 水平
    [[1, 0], [-1, 0]],   // 垂直
    [[1, 1], [-1, -1]], // 对角线
    [[1, -1], [-1, 1]]  // 反对角线
  ];

  for (const [dir1, dir2] of directions) {
    let count = 1;

    // 向一个方向检查
    let r = row + dir1[0];
    let c = col + dir1[1];
    while (r >= 0 && r < 15 && c >= 0 && c < 15 && board[r][c] === player) {
      count++;
      r += dir1[0];
      c += dir1[1];
    }

    // 向相反方向检查
    r = row + dir2[0];
    c = col + dir2[1];
    while (r >= 0 && r < 15 && c >= 0 && c < 15 && board[r][c] === player) {
      count++;
      r += dir2[0];
      c += dir2[1];
    }

    if (count >= 5) return true;
  }

  return false;
}

// 初始化棋盘
export function initBoard() {
  return Array(15).fill(null).map(() => Array(15).fill(0));
}

// 验证移动是否合法
export function isValidMove(board, row, col) {
  return row >= 0 && row < 15 && col >= 0 && col < 15 && board[row][col] === 0;
}
