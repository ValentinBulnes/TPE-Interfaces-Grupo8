import { FichaVista } from "./FichaVista.js";

export class TableroVista {
    cellSize = 90;
    /**
     * Constructor de la vista del tablero.
     * Inicializa el canvas, el contexto, y carga la imagen de fondo.
     * Cuando la imagen se carga, dibuja el tablero inicial.
     */
    constructor(canvas, tableroModelo) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
        this.fichasTableroModelo = tableroModelo.fichas; // rompi encapsulamiento al acceder directamente al estado interno. NOTA: va en contra de MVC y POO, pero funciona
        this.fichas = [];
        this.backgroundImg = new Image();
        this.backgroundImg.src = "./img/peg/tablero2.png";
        this.backgroundImg.onload = () => {
            this.dibujar();
        };
    }

    /**
     * Convierte coordenadas de píxeles (x, y) a fila y columna del tablero.
     * Divide las coordenadas por el tamaño de la celda para obtener la posición en el tablero.
     */
    convertirXYaFilaColumna(x, y) {
        const fila = Math.floor(y / this.cellSize);
        const col = Math.floor(x / this.cellSize);
        return { fila, col };
    }

    /**
     * Convierte una columna y fila del tablero a coordenadas de píxeles (x, y).
     * Usa el método getPosFromRowCol de una ficha para calcular las posiciones.
     */
    convertirColFilaaXY(col, fila) {
        const ficha = this.fichas[0];
        const x = ficha.getPosFromRowCol(col);
        const y = ficha.getPosFromRowCol(fila);
        return { x: x, y: y };
    }

    /**
     * Dibuja todo el tablero desde cero.
     * Limpia el canvas, recorre todas las fichas del modelo y crea las vistas
     * correspondientes para dibujarlas.
     */
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

    /**
     * Refresca el canvas sin recrear las fichas.
     * Limpia el canvas y vuelve a dibujar todas las fichas, excepto la arrastrada
     * que se dibuja al final para que quede encima. Si stepAnim es true, avanza la animación.
     */
    refresh(fichaArrastrada = null, stepAnim = false) {
        this.clearCanvas();
        
        // Incrementar contador de animación UNA sola vez si corresponde
        if (stepAnim) {
            FichaVista.contadorAnimacion += 0.1;
        }
        
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

    /**
     * Obtiene la ficha que está en la posición del mouse.
     * Recorre todas las fichas y verifica si el punto está dentro de alguna.
     * Retorna la primera ficha encontrada o null si no hay ninguna.
     */
    obtenerFicha(mouseX, mouseY) {
        for (const ficha of this.fichas) {
            if (ficha.isPointInside(mouseX, mouseY)) return ficha;
        }
        return null;
    }

    /**
     * Activa la animación de pulso para las fichas en las posiciones especificadas.
     * Recibe un array de posiciones {x, y} y marca las fichas correspondientes para animar.
     */
    animarFichas(posFichas) {
        for (const pos of posFichas){
            const fichaPosible = this.obtenerFicha(pos.x, pos.y)
            console.log(fichaPosible, pos.x, pos.y)
            if (fichaPosible)
                fichaPosible.animar = true
            // resetea solo en vista.dibujar
        }
    }

    /**
     * Limpia el canvas y dibuja la imagen de fondo.
     * Primero limpia todo el canvas y luego dibuja la imagen de fondo del tablero.
     */
    clearCanvas() {
        const { ctx, backgroundImg, canvas } = this;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(backgroundImg, 0, 0, canvas.width, canvas.height);
    }
}
