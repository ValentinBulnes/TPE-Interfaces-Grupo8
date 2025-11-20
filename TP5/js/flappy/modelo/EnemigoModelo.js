export class EnemigoModelo {
    constructor() {
        this.x = 640; // Start at the right edge (container width is 640px)
        this.velocidad = 5; // Speed moving left
        this.ancho = 75; // Width final (sin scale)
        this.alto = 75; // Height final (sin scale)
        this.marcadoParaEliminar = false;
        this.reduccionHitbox = 0.6;

        // Calcular posición Y dentro del contenedor (560px de alto)
        // SIMPLE: sin scales, bottom indica directamente la posición del borde inferior
        const alturaContenedor = 560;
        const margen = 20;
        const yMinimo = margen; // Margen desde el fondo
        const yMaximo = alturaContenedor - this.alto - margen; // Margen desde el tope
        this.y = Math.random() * (yMaximo - yMinimo) + yMinimo;
    }

    actualizar() {
        this.x -= this.velocidad;

        // Mark for deletion if it goes off-screen left
        if (this.x < -this.ancho) {
            this.marcadoParaEliminar = true;
        }
    }

    obtenerPosicion() {
        return { x: this.x, y: this.y };
    }

    getHitbox() {
        const anchoReducido = this.ancho * this.reduccionHitbox;
        const altoReducido = this.alto * this.reduccionHitbox;
        const centerPos = this.getCenterPos();

        const top = centerPos.y - anchoReducido / 2;
        const bottom = centerPos.y + anchoReducido / 2;
        const left = centerPos.x - anchoReducido / 2;
        const right = centerPos.x + anchoReducido / 2;

        return {
            top: top,
            bottom: bottom,
            left: left,
            right: right,
            ancho: anchoReducido,
            alto: altoReducido,
        };
    }

    getCenterPos() {
        const centerX = this.x + this.ancho / 2;
        const centerY = this.y + this.alto / 2;
        return { x: centerX, y: centerY };
    }
}
