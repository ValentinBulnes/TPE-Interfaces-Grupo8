export class NPCModelo {
    constructor({
        x = 640,
        velocidad = 5,
        ancho = 75,
        alto = 75,
        reduccionHitbox = 1,
        alturaContenedor = 560,
        margen = 20,
        y = null,
    } = {}) {
        if (new.target === NPCModelo) {
            throw new Error("Cannot instantiate abstract class NPCModelo");
        }

        this.x = x;
        this.velocidad = velocidad;
        this.ancho = ancho;
        this.alto = alto;
        this.reduccionHitbox = reduccionHitbox;
        this.marcadoParaEliminar = false;
        this.limiteEliminacion = -this.ancho;

        // Calcular posición Y dentro del contenedor si no se pasa explícitamente
        if (y !== null) {
            this.y = y;
        } else {
            const yMinimo = margen;
            const yMaximo = alturaContenedor - this.alto - margen;
            this.y = Math.random() * (yMaximo - yMinimo) + yMinimo;
        }
    }

    actualizar() {
        this.x -= this.velocidad;

        if (this.x < this.limiteEliminacion) {
            this.marcadoParaEliminar = true;
        }
    }

    obtenerPosicion() {
        return { x: this.x, y: this.y };
    }

    getCenterPos() {
        const centerX = this.x + this.ancho / 2;
        const centerY = this.y + this.alto / 2;
        return { x: centerX, y: centerY };
    }

    getHitbox() {
        const anchoReducido = this.ancho * this.reduccionHitbox;
        const altoReducido = this.alto * this.reduccionHitbox;
        const centerPos = this.getCenterPos();

        const top = centerPos.y - altoReducido / 2;
        const bottom = centerPos.y + altoReducido / 2;
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

    marcarParaEliminar() {
        this.marcadoParaEliminar = true;
    }

    isMarcadoParaEliminar() {
        return this.marcadoParaEliminar;
    }
}
