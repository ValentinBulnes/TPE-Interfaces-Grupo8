export class FichaVista {
    idleColor = "#1e287a";
    activeColor = "#3d5afe";
    resaltadoColor = "#00e676";

    constructor(ctx, fila, col, tipo, cellSize, seleccionada = false) {
        this.ctx = ctx;
        this.cellSize = cellSize;
        this.posY = this.getPosFromRowCol(fila);
        this.posX = this.getPosFromRowCol(col);
        this.tipo = tipo;
        this.seleccionada = seleccionada;
    }

    dibujar() {
        const { ctx, posX, posY, tipo, cellSize, seleccionada } = this;
        if (tipo === null) return;

        // Dibuja ficha si corresponde
        if (tipo === 1) {
            ctx.fillStyle = seleccionada ? this.activeColor : this.idleColor;
            ctx.beginPath();
            ctx.arc(posX, posY, this.getInnerRadius(), 0, Math.PI * 2);
            ctx.fill();
        }
    }

    getPosFromRowCol(row_col) {
        return row_col * this.cellSize + this.cellSize / 2 + 17;
    }

    getInnerRadius() {
        return this.cellSize * 0.3;
    }

    getOuterRadius() {
        return this.cellSize * 0.4;
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
