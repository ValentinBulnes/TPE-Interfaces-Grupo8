export class FichaVista {
    constructor(ctx, fila, col, tipo, cellSize, seleccionada = false) {
        this.ctx = ctx;
        this.fila = fila;
        this.col = col;
        this.tipo = tipo;
        this.cellSize = cellSize;
        this.seleccionada = seleccionada;
    }

    dibujar() {
        const { ctx, fila, col, tipo, cellSize, seleccionada } = this;
        if (tipo === null) return;

        const x = col * cellSize + cellSize / 2;
        const y = fila * cellSize + cellSize / 2;

        // Base de la celda
        ctx.fillStyle = "#ddd";
        ctx.beginPath();
        ctx.arc(x, y, cellSize * 0.4, 0, Math.PI * 2);
        ctx.fill();

        // Dibuja ficha si corresponde
        if (tipo === 1) {
            ctx.fillStyle = seleccionada ? "#2196f3" : "#333";
            ctx.beginPath();
            ctx.arc(x, y, cellSize * 0.3, 0, Math.PI * 2);
            ctx.fill();
        }
    }
}
