export class PegSolitaireView {
  constructor(canvas, model) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.model = model;
    this.cellSize = canvas.width / model.size;
    this.selected = null;
  }

  draw() {
    const { ctx, cellSize } = this;
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    for (let y = 0; y < this.model.size; y++) {
      for (let x = 0; x < this.model.size; x++) {
        const value = this.model.board[y][x];
        if (value === null) continue;

        const cx = x * cellSize + cellSize / 2;
        const cy = y * cellSize + cellSize / 2;

        // Background circle
        ctx.fillStyle = "#ddd";
        ctx.beginPath();
        ctx.arc(cx, cy, cellSize * 0.4, 0, Math.PI * 2);
        ctx.fill();

        // Pegs
        if (value === 1) {
          ctx.fillStyle = this.selected?.x === x && this.selected?.y === y ? "#2196f3" : "#333";
          ctx.beginPath();
          ctx.arc(cx, cy, cellSize * 0.3, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }
  }

  getCellFromCoords(x, y) {
    const cellX = Math.floor(x / this.cellSize);
    const cellY = Math.floor(y / this.cellSize);
    return { x: cellX, y: cellY };
  }
}
