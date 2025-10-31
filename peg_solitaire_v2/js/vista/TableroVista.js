import { FichaVista } from "./FichaVista.js";

export class TableroVista {
    constructor(canvas, tableroModelo) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
        this.tablero = tableroModelo.fichas; // rompi encapsulamiento asiq accedo directamente al estado interno
        this.cellSize = canvas.width / tableroModelo.size;
        this.fichas = [];
    }

    convertirXYaFilaColumna(x, y) {
        const fila = Math.floor(y / this.cellSize);
        const col = Math.floor(x / this.cellSize);
        return { fila, col };
    }

    dibujar() {
        const { ctx, tablero } = this;
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        for (const fila of tablero) {
            for (const ficha of fila) {
                if (ficha === null) continue;

                const vistaFicha = new FichaVista(
                    ctx,
                    ficha.fila,
                    ficha.columna,
                    ficha.tipo,
                    this.cellSize,
                    ficha.seleccionada
                );
                this.fichas.push(vistaFicha);
                vistaFicha.dibujar();
            }
        }
    }

    refresh() {
        const { ctx, fichas } = this;
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        for (const ficha of fichas) {
            ficha.dibujar();
        }
    }
}
