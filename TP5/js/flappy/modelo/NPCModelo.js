export class NPCModelo {
    static DEBUG_HITBOX = false;
    constructor({
        x = 640,
        velocidad = 5,
        ancho = 75,
        alto = 75,
        reduccionHitbox = 1,
        alturaContenedor = 560,
        margen = 20,
        y = null,
        colorHitbox = "red",
    } = {}) {
        if (new.target === NPCModelo) {
            throw new Error("Cannot instantiate abstract class NPCModelo");
        }

        this.posX = x;
        this.velocidad = velocidad;
        this.ancho = ancho;
        this.alto = alto;
        this.reduccionHitbox = reduccionHitbox;
        this.marcadoParaEliminar = false;
        this.limiteEliminacion = -this.ancho;

        // Calcular posición Y dentro del contenedor si no se pasa explícitamente
        if (y !== null) {
            this.posY = y;
        } else {
            const yMinimo = margen;
            const yMaximo = alturaContenedor - this.alto - margen;
            this.posY = Math.random() * (yMaximo - yMinimo) + yMinimo;
        }
        this.colorHitbox = colorHitbox;
        this.initDebugHitbox();
    }

    actualizar() {
        this.posX -= this.velocidad;

        if (this.posX < this.limiteEliminacion) {
            this.marcadoParaEliminar = true;
        }
        this.debugHitbox();
    }

    obtenerPosicion() {
        return { x: this.posX, y: this.posY };
    }

    getCenterPos() {
        const centerX = this.posX + this.ancho / 2;
        const centerY = this.posY + this.alto / 2;
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
        this.eliminarDebugHitbox()
    }

    isMarcadoParaEliminar() {
        return this.marcadoParaEliminar;
    }

    initDebugHitbox() {
        if (!NPCModelo.DEBUG_HITBOX) return;
        const container = document.querySelector(".parallax-container");
        this.hitbox = document.createElement("div");
        container.appendChild(this.hitbox);
    }

    debugHitbox() {
        if (!NPCModelo.DEBUG_HITBOX) return;
        const { top, left, ancho, alto } = this.getHitbox();
        Object.assign(this.hitbox.style, {
            position: "absolute",
            left: `${left}px`,
            top: `${top}px`,
            width: `${ancho}px`,
            height: `${alto}px`,
            backgroundColor: this.colorHitbox,
            opacity: "0.5",
        });
    }

    eliminarDebugHitbox(){
        if (!NPCModelo.DEBUG_HITBOX) return;
        this.hitbox?.parentNode?.removeChild(this.hitbox);
    }
}
