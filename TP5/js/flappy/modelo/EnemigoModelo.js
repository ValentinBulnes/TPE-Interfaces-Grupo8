export class EnemigoModelo {
    constructor() {
        this.x = 640; // Start at the right edge (container width is 640px)
        this.velocidad = 5; // Speed moving left
        this.ancho = 75; // Width final (sin scale)
        this.alto = 75; // Height final (sin scale)
        this.marcadoParaEliminar = false;
        
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
}
