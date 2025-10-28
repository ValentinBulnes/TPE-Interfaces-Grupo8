class Figure {
    constructor(posX, posY, fill, context) {
        this.posX = posX;
        this.posY = posY;
        this.fill = fill;
        this.resaltado = false;
        this.resaltadoEstilo = 'red';
        this.ctx = context;
    }

    setFill(fill) {
        this.fill = fill;
    }

    setPosition(posX, posY) {
        this.posX = posX;
        this.posY = posY;
    }

    getPosition() {
        return { x: this.posX, y: this.posY };
    }

    getPosX() {
        return this.posX;
    }

    getPosY() {
        return this.posY;
    }

    getFill() {
        return this.fill;
    } 

    draw() {
        this.ctx.fillStyle = this.fill;
    }

    setResaltado(resaltado) {
        this.resaltado = resaltado;
    }

    isPointInside(x, y) { };

}