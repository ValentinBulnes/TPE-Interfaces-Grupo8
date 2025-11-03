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

    // Método estático para cambiar la ficha seleccionada
    static seleccionarSkinFicha(skinIndex) {
        if (skinIndex >= 0 && skinIndex < FichaVista.srcSkinFichas.length) {
            FichaVista.indexSkinSeleccionado = skinIndex;
            FichaVista.imagenActual = new Image();
            FichaVista.imagenActual.src = FichaVista.srcSkinFichas[skinIndex];
        }
    }

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
                
                // Si está seleccionada, dibujar un borde brillante
                if (seleccionada) {
                    this.dibujarBorde();
                }
            }
        }

        if (this.animar){
            this.dibujarAnimacionPulso()
        }
    }

    dibujarBorde() {
        const { ctx, posX, posY } = this;
        const radius = this.getInnerRadius();
        ctx.strokeStyle = this.activeColor;
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(posX, posY, radius, 0, Math.PI * 2);
        ctx.stroke();
    }

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

    getPosFromRowCol(row_col) {
        return row_col * this.cellSize + this.cellSize / 2 + 17;
    }

    getInnerRadius() {
        return this.cellSize * 0.3;
    }

    isPointInside(x, y) {
        let _x = this.posX - x;
        let _y = this.posY - y;
        return Math.sqrt(_x * _x + _y * _y) <= this.getInnerRadius();
    }

    setPosition(newPosX, newPosY) {
        this.posX = newPosX;
        this.posY = newPosY;
    }
}
