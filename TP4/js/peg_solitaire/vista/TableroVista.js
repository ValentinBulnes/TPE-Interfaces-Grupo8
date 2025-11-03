import { FichaVista } from "./FichaVista.js";

export class TableroVista {
    cellSize = 90;
    constructor(canvas, tableroModelo) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
        this.fichasTableroModelo = tableroModelo.fichas; // rompi encapsulamiento al acceder directamente al estado interno. NOTA: va en contra de MVC y POO, pero funciona
        // this.cellSize = canvas.width / tableroModelo.size;
        this.fichas = [];
        this.backgroundImg = new Image();
        this.backgroundImg.src = "./img/peg_solitaire/tablero2.png";
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

        for (const fila of this.fichasTableroModelo) {
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

    refresh(fichaArrastrada = null) {
        this.clearCanvas();
        // Dibujar todas las fichas excepto la arrastrada
        for (const ficha of this.fichas) {
            if (ficha !== fichaArrastrada) {
                ficha.dibujar();
            }
        }
        // Dibujar la ficha arrastrada al final para que esté encima
        if (fichaArrastrada) {
            fichaArrastrada.dibujar();
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
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(backgroundImg, 0, 0, canvas.width, canvas.height);
    }
}
