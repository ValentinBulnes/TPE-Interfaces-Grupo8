import { TableroModelo } from "./modelo/TableroModelo.js";
import { TableroVista } from "./vista/TableroVista.js";

export class JuegoController {
    constructor(canvas) {
        this.tablero = new TableroModelo();
        this.vista = new TableroVista(canvas, this.tablero);

        this.fichaSeleccionada = null;
        this.fichaArrastrada = null;
        this.offsetX = 0;
        this.offsetY = 0;

        this.vista.dibujar();

        canvas.addEventListener("mousedown", (e) => this.mouseDown(e));
        canvas.addEventListener("mouseup", (e) => this.mouseUp(e));
    }

    mouseDown(e) {
        const { fila, col } = this.vista.convertirXYaFilaColumna(
            e.offsetX,
            e.offsetY
        );

        const ficha = this.tablero.obtenerFicha(fila, col);
        if (ficha && ficha.tipo === 1) {
            ficha.seleccionada = true;
            this.fichaSeleccionada = ficha;
            this.vista.dibujar();
        }
    }

    mouseUp(e) {
        if (!this.fichaSeleccionada) return;

        const { fila, col } = this.vista.convertirXYaFilaColumna(
            e.offsetX,
            e.offsetY
        );

        const movimientoValido = this.tablero.aplicarMovimiento(
            this.fichaSeleccionada,
            fila,
            col
        );

        this.fichaSeleccionada.seleccionada = false;
        this.fichaSeleccionada = null;
        this.vista.dibujar();

        if (movimientoValido) {
            // TODO: agregar detección de fin de juego o contador
        }
    }
}
