export class PegSolitaireModel {
  constructor(size = 7) {
    this.size = size;
    this.board = this.createBoard();
  }

  createBoard() {
    // Cross-shaped layout
    const board = Array.from({ length: this.size }, (_, y) =>
      Array.from({ length: this.size }, (_, x) => {
        if ((x < 2 || x > 4) && (y < 2 || y > 4)) return null;
        return 1;
      })
    );
    board[3][3] = 0; // center empty
    return board;
  }

  getValidMoves() {
    const moves = [];
    const dirs = [
      [0, -1], [0, 1], [-1, 0], [1, 0]
    ];

    for (let y = 0; y < this.size; y++) {
      for (let x = 0; x < this.size; x++) {
        if (this.board[y][x] !== 1) continue;
        for (const [dx, dy] of dirs) {
          const midX = x + dx;
          const midY = y + dy;
          const endX = x + 2 * dx;
          const endY = y + 2 * dy;
          if (
            this.board[midY]?.[midX] === 1 &&
            this.board[endY]?.[endX] === 0
          ) {
            moves.push({ from: [x, y], over: [midX, midY], to: [endX, endY] });
          }
        }
      }
    }
    return moves;
  }

  makeMove(move) {
    const { from, over, to } = move;
    this.board[from[1]][from[0]] = 0;
    this.board[over[1]][over[0]] = 0;
    this.board[to[1]][to[0]] = 1;
  }

  isGameOver() {
    return this.getValidMoves().length === 0;
  }
}
