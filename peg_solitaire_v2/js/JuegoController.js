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
        this.isMouseDown = false

        this.vista.dibujar();

        canvas.addEventListener("mousedown", (e) => this.mouseDown(e));
        canvas.addEventListener("mouseup", (e) => this.mouseUp(e));
        canvas.addEventListener("mousemove", (e) => this.mouseMove(e));
    }

    mouseDown(e) {
        this.isMouseDown = true;
        const mousePos = this.getMousePosition(e);
        this.offsetX = 0;
        this.offsetY = 0;

        const { fila, col } = this.vista.convertirXYaFilaColumna(
            mousePos.x,
            mousePos.y
        );

        this.fichaSeleccionada = this.tablero.obtenerFicha(fila, col);
        if (this.fichaSeleccionada && this.fichaSeleccionada.tipo === 1) {
            this.fichaSeleccionada.seleccionada = true;
            this.vista.dibujar();
            this.fichaArrastrada = this.vista.obtenerFicha(mousePos.x, mousePos.y);
            if (this.fichaArrastrada != null) {
                this.offsetX = mousePos.x - this.fichaArrastrada.posX;
                this.offsetY = mousePos.y - this.fichaArrastrada.posY;
            }
        }
    }

    mouseUp(e) {
        this.isMouseDown = false;
        if (!this.fichaSeleccionada) return;

        const { fila, col } = this.vista.convertirXYaFilaColumna(
            e.offsetX,
            e.offsetY
        );

        this.tablero.aplicarMovimiento(this.fichaSeleccionada, fila, col);
        this.fichaSeleccionada.seleccionada = false;
        this.fichaSeleccionada = null;

        // 🔁 Redibujar desde cero basado en el modelo actualizado
        this.vista.dibujar();
    }

    mouseMove(e) {
        if (this.isMouseDown && this.fichaArrastrada != null) {
            const mousePos = this.getMousePosition(e);
            const newPosX = mousePos.x - this.offsetX;
            const newPosY = mousePos.y - this.offsetY;
            this.fichaArrastrada.setPosition(newPosX, newPosY);
            this.vista.refresh()
        }
    }

    getMousePosition(mouseEvent) {
        return {
            x: mouseEvent.offsetX,
            y: mouseEvent.offsetY,
        };
    }
}
