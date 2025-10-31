import { FichaVista } from "./FichaVista.js";

export class TableroVista {
    constructor(canvas, tableroModelo) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
        this.tablero = tableroModelo; // tableroModelo -> [][]
        this.cellSize = canvas.width / tableroModelo.size;
    }

    convertirXYaFilaColumna(x, y) {
        const fila = Math.floor(y / this.cellSize);
        const col = Math.floor(x / this.cellSize);
        return { fila, col };
    }

    // dibujar(_tablero = null) {
    //     if (_tablero != null) this.tablero = _tablero
    //     const { ctx, tablero } = this;
    //     ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    //     for (const fila of tablero) {
    //         for (const ficha of fila) {
    //             // const ficha = tablero.fichas[fila][col];
    //             if (ficha === null) continue;

    //             const vistaFicha = new FichaVista(
    //                 ctx,
    //                 ficha.fila,
    //                 ficha.columna,
    //                 ficha.tipo,
    dibujar() {
        const { ctx, tablero } = this;
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        for (let fila = 0; fila < tablero.size; fila++) {
            for (let col = 0; col < tablero.size; col++) {
                const ficha = tablero.fichas[fila][col];
                if (ficha === null) continue;

                const vistaFicha = new FichaVista(
                    ctx,
                    fila,
                    col,
                    this.cellSize,
                    ficha.seleccionada
                );
                vistaFicha.dibujar();
            }
        }
    }
}
