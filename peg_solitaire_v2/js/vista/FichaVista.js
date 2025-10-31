export class FichaVista {
    constructor(ctx, ficha, cellSize) {
        this.ctx = ctx;
        this.ficha = ficha;
        this.cellSize = cellSize;
    }

    dibujar() {
        const { ctx, ficha, cellSize } = this;
        console.log(this);
        //if (ficha === null) return;
        if (ficha.tipo === null) return;

        const x = ficha.columna * cellSize + cellSize / 2;
        const y = ficha.fila * cellSize + cellSize / 2;

        // Base
        ctx.fillStyle = "#ddd";
        ctx.beginPath();
        ctx.arc(x, y, cellSize * 0.4, 0, Math.PI * 2);
        ctx.fill();

        // Ficha
        if (ficha.tipo === 1) {
            ctx.fillStyle = ficha.seleccionada ? "#2196f3" : "#333";
            ctx.beginPath();
            ctx.arc(x, y, cellSize * 0.3, 0, Math.PI * 2);
            ctx.fill();
        }
    }
}
