export class FichaVista {
    static srcSkinFichas = [
        'img/peg_solitaire/ficha1.png',
        'img/peg_solitaire/ficha2.png',
        'img/peg_solitaire/ficha3.png'
    ];
    static indexSkinSeleccionado = 0;
    static imagenActual = null;
    static contadorAnimacion = 0;
    activeColor = "#ffffff";

    /**
     * Constructor de la vista de una ficha.
     * Inicializa el contexto, posición, tipo y estado de selección.
     * Carga la imagen de la ficha si aún no está cargada.
     */
    constructor(ctx, fila, col, tipo, cellSize, seleccionada = false) {
        this.ctx = ctx;
        this.cellSize = cellSize;
        this.posY = this.getPosFromRowCol(fila);
        this.posX = this.getPosFromRowCol(col);
        this.tipo = tipo;
        this.seleccionada = seleccionada;
        this.animar = false
        
        // Cargar la imagen si aún no está cargada
        if (!FichaVista.imagenActual) {
            FichaVista.imagenActual = new Image();
            FichaVista.imagenActual.src = FichaVista.srcSkinFichas[FichaVista.indexSkinSeleccionado];
        }
    }

    /**
     * Método estático para cambiar la ficha seleccionada.
     * Cambia el índice del skin seleccionado y carga la nueva imagen.
     */
    static seleccionarSkinFicha(skinIndex) {
        if (skinIndex >= 0 && skinIndex < FichaVista.srcSkinFichas.length) {
            FichaVista.indexSkinSeleccionado = skinIndex;
            FichaVista.imagenActual = new Image();
            FichaVista.imagenActual.src = FichaVista.srcSkinFichas[skinIndex];
        }
    }

    /**
     * Dibuja la ficha en el canvas.
     * Si la ficha existe (tipo = 1), dibuja la imagen dentro de un círculo.
     * Si está seleccionada, dibuja un borde y si tiene animación, dibuja el pulso.
     */
    dibujar() {
        const { ctx, posX, posY, tipo, seleccionada } = this;
        // Dibuja ficha si corresponde
        if (tipo === 1) {
            const radius = this.getInnerRadius();
            const diameter = radius * 2;
            
            // Dibujar la imagen de la ficha
            if (FichaVista.imagenActual && FichaVista.imagenActual.complete) {
                ctx.save();
                
                // Crear un clip circular para que la imagen se muestre dentro de un círculo
                ctx.beginPath();
                ctx.arc(posX, posY, radius, 0, Math.PI * 2);
                ctx.clip();
                
                // Dibujar la imagen centrada en el círculo
                ctx.drawImage(
                    FichaVista.imagenActual,
                    posX - radius,
                    posY - radius,
                    diameter,
                    diameter
                );
                
                ctx.restore();
                
                if (seleccionada) {
                    this.dibujarBorde();
                }
            }
        }

        if (this.animar){
            this.dibujarAnimacionPulso()
        }
    }

    /**
     * Dibuja un borde alrededor de la ficha cuando está seleccionada.
     */
    dibujarBorde() {
        const { ctx, posX, posY } = this;
        const radius = this.getInnerRadius();
        ctx.strokeStyle = this.activeColor;
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(posX, posY, radius, 0, Math.PI * 2);
        ctx.stroke();
    }

    /**
     * Dibuja una animación de pulso alrededor de la ficha.
     * Usa una función seno para crear un efecto de pulso que cambia el tamaño del círculo.
     */
    dibujarAnimacionPulso() {
        const { ctx, posX, posY } = this;
        const radius = this.getInnerRadius();
        
        const pulso = Math.sin(FichaVista.contadorAnimacion);
        const escala = 1 + (pulso * 0.2);
        
        ctx.strokeStyle = "#64C8FF";
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(posX, posY, radius * escala, 0, Math.PI * 2);
        ctx.stroke();
    }

    /**
     * Convierte una fila o columna a una posición en píxeles.
     * Calcula la posición central de la celda más un offset de 17 píxeles.
     */
    getPosFromRowCol(row_col) {
        return row_col * this.cellSize + this.cellSize / 2 + 17;
    }

    /**
     * Obtiene el radio interno de la ficha.
     * El radio es el 30% del tamaño de la celda.
     */
    getInnerRadius() {
        return this.cellSize * 0.3;
    }

    /**
     * Verifica si un punto (x, y) está dentro de la ficha.
     * Calcula la distancia desde el punto al centro de la ficha y compara con el radio.
     */
    isPointInside(x, y) {
        let _x = this.posX - x;
        let _y = this.posY - y;
        return Math.sqrt(_x * _x + _y * _y) <= this.getInnerRadius();
    }

    /**
     * Actualiza la posición de la ficha.
     * Se usa durante el arrastre para mover la ficha visualmente.
     */
    setPosition(newPosX, newPosY) {
        this.posX = newPosX;
        this.posY = newPosY;
    }
}
