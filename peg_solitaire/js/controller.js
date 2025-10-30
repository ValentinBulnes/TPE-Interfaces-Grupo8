import { PegSolitaireModel } from "./model.js";
import { PegSolitaireView } from "./view.js";

export class PegSolitaireController {
  constructor(canvas) {
    this.model = new PegSolitaireModel();
    this.view = new PegSolitaireView(canvas, this.model);
    this.view.draw();

    this.selected = null;

    canvas.addEventListener("click", (e) => this.handleClick(e));
  }

  handleClick(event) {
    const rect = event.target.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const cell = this.view.getCellFromCoords(x, y);

    const { x: cx, y: cy } = cell;
    const cellValue = this.model.board[cy]?.[cx];

    if (cellValue === 1) {
      // Select peg
      this.selected = cell;
      this.view.selected = cell;
    } else if (cellValue === 0 && this.selected) {
      // Attempt move
      const move = this.model.getValidMoves().find(
        (m) => m.from[0] === this.selected.x && m.from[1] === this.selected.y &&
               m.to[0] === cx && m.to[1] === cy
      );
      if (move) this.model.makeMove(move);
      this.selected = null;
      this.view.selected = null;
    }

    this.view.draw();

    if (this.model.isGameOver()) {
      setTimeout(() => alert("Game over!"), 100);
    }
  }
}
