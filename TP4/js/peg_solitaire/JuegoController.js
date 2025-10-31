import { TableroModelo } from "./modelo/TableroModelo.js";
import { TableroVista } from "./vista/TableroVista.js";

export class JuegoController {
    constructor(canvas, onVictoria = null, onGameOver = null) {
        this.tablero = new TableroModelo();
        this.vista = new TableroVista(canvas, this.tablero);

        // Callbacks
        this.onVictoria = onVictoria;
        this.onGameOver = onGameOver;

        // Estado del drag and drop
        this.fichaSeleccionada = null;
        this.fichaArrastrada = null;
        this.offsetX = 0;
        this.offsetY = 0;
        this.isMouseDown = false;

        // Temporizador
        this.tiempoRestante = 300; // 5 minutos en segundos
        this.temporizador = null;

        this.vista.dibujar();

        canvas.addEventListener("mousedown", (e) => this.mouseDown(e));
        canvas.addEventListener("mouseup", (e) => this.mouseUp(e));
        canvas.addEventListener("mousemove", (e) => this.mouseMove(e));

        this.iniciarTemporizador();
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
        // TODO: buscar movimientos posibles y resaltarlos
    }

    mouseUp(e) {
        this.isMouseDown = false;
        if (!this.fichaSeleccionada) return;

        const { fila, col } = this.vista.convertirXYaFilaColumna(
            e.offsetX,
            e.offsetY
        );

        const movimientoExitoso = this.tablero.aplicarMovimiento(this.fichaSeleccionada, fila, col);
        this.fichaSeleccionada.seleccionada = false;
        this.fichaSeleccionada = null;

        // 🔁 Redibujar desde cero basado en el modelo actualizado
        this.vista.dibujar();

        // Verificar condiciones de juego después de un movimiento válido
        if (movimientoExitoso) {
            if (this.tablero.verificarVictoria()) {
                this.detenerJuego();
                if (this.onVictoria) this.onVictoria();
            } else if (!this.tablero.hayMovimientosDisponibles()) {
                // Sin movimientos disponibles = Game Over
                this.detenerJuego();
                if (this.onGameOver) this.onGameOver();
            }
        }
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

    // ============================================
    // MANEJO DEL TEMPORIZADOR
    // ============================================

    iniciarTemporizador() {
        if (this.temporizador) clearInterval(this.temporizador);

        this.temporizador = setInterval(() => {
            this.tiempoRestante--;
            this.actualizarDisplayTiempo();

            if (this.tiempoRestante <= 0) {
                this.detenerJuego();
                if (this.onGameOver) this.onGameOver();
            }
        }, 1000);
    }

    actualizarDisplayTiempo() {
        const minutos = Math.floor(this.tiempoRestante / 60);
        const segundos = this.tiempoRestante % 60;
        const displayElement = document.querySelector("#game-info h2:last-child");

        if (displayElement) {
            displayElement.textContent = `${minutos}:${segundos.toString().padStart(2, "0")}`;
        }
    }

    detenerJuego() {
        if (this.temporizador) {
            clearInterval(this.temporizador);
            this.temporizador = null;
        }
    }

    reiniciar() {
        this.detenerJuego();
        this.tiempoRestante = 300;
        this.tablero.inicializar();
        this.fichaSeleccionada = null;
        this.fichaArrastrada = null;
        this.vista.dibujar();
        this.iniciarTemporizador();
    }
}
