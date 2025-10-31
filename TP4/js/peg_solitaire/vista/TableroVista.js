import { FichaVista } from "./FichaVista.js";

export class TableroVista {
    cellSize = 90
    constructor(canvas, tableroModelo) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
        this.tablero = tableroModelo.fichas; // rompi encapsulamiento asiq accedo directamente al estado interno
        // this.cellSize = canvas.width / tableroModelo.size;
        this.fichas = [];
        this.backgroundImg = new Image();
        this.backgroundImg.src = "./img/peg_solitaire/tablero.png";
        this.backgroundImg.onload = () => {
            this.dibujar();
        };
    }

    convertirXYaFilaColumna(x, y) {
        const fila = Math.floor(y / this.cellSize);
        const col = Math.floor(x / this.cellSize);
        return { fila, col };
    }

    dibujar() {
        this.fichas = [];
        this.clearCanvas();

        for (const fila of this.tablero) {
            for (const ficha of fila) {
                if (ficha === null) continue;

                const vistaFicha = new FichaVista(
                    this.ctx,
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
        this.clearCanvas();
        for (const ficha of this.fichas) {
            ficha.dibujar();
        }
    }

    obtenerFicha(mouseX, mouseY) {
        for (const ficha of this.fichas) {
            if (ficha.isPointInside(mouseX, mouseY)) return ficha;
        }
        return null;
    }

    clearCanvas() {
        const { ctx, backgroundImg, canvas } = this;
        // Limpiar el canvas completamente
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Dibujar la imagen de fondo si está cargada
        if (backgroundImg.complete) {
            ctx.drawImage(backgroundImg, 0, 0, canvas.width, canvas.height);
        } else {
            // Si la imagen no está cargada aún, usar color de fondo temporal
            ctx.fillStyle = "darkgray";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
    }
}
