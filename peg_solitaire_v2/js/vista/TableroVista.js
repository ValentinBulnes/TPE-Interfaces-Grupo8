import { FichaVista } from "./FichaVista.js";

export class TableroVista {
    constructor(canvas, tableroModelo) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
        this.tablero = tableroModelo;
        this.cellSize = canvas.width / tableroModelo.size;
    }

    convertirXYaFilaColumna(x, y) {
        const fila = Math.floor(y / this.cellSize);
        const col = Math.floor(x / this.cellSize);
        return { fila, col };
    }

    dibujar() {
        const { ctx, tablero } = this;
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        for (let fila = 0; fila < tablero.size; fila++) {
            for (let col = 0; col < tablero.size; col++) {
                const ficha = tablero.obtenerFicha(fila, col);
                console.log(ficha);
                const vistaFicha = new FichaVista(ctx, ficha, this.cellSize);
                console.log(vistaFicha);
                vistaFicha.dibujar();
            }
        }
    }
}
