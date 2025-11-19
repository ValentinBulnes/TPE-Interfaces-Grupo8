export class ColeccionableModelo {
    constructor(tipo) {
        this.tipo = tipo; // 'moneda' o 'corazon'
        this.x = 640; // Start at the right edge
        this.velocidad = 5; // Same speed as enemies
        this.marcadoParaEliminar = false;
        
        // Configuración específica por tipo (sin scales, tamaños finales)
        if (tipo === 'moneda') {
            this.ancho = 64; // Width final (sin scale)
            this.alto = 64; // Height final (sin scale)
            this.limiteEliminacion = -this.ancho;
        } else if (tipo === 'corazon') {
            this.ancho = 35; // Width final (sin scale)
            this.alto = 35; // Height final (sin scale)
            this.limiteEliminacion = -this.ancho;
        }
        
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
        if (this.x < this.limiteEliminacion) {
            this.marcadoParaEliminar = true;
        }
    }

    obtenerPosicion() {
        return { x: this.x, y: this.y };
    }
}

