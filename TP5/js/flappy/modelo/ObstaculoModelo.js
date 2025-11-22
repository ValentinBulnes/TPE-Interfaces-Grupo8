import { NPCModelo } from "./NPCModelo.js";

export class ObstaculoModelo extends NPCModelo {
    constructor() {
        // Dimensiones del contenedor
        const alturaContenedor = 560;
        const anchoTubo = 52; // Ancho del tubo del sprite
        const alturaMinimaTubo = 100;
        const espacio = 150; // Espacio entre tubos superior e inferior

        // Calcular altura aleatoria para el tubo superior
        const alturaMaximaTubo = alturaContenedor - espacio - alturaMinimaTubo;
        const alturaTuboSuperior = Math.random() * (alturaMaximaTubo - alturaMinimaTubo) + alturaMinimaTubo;
        
        // El tubo inferior empieza después del espacio
        const alturaTuboInferior = alturaContenedor - alturaTuboSuperior - espacio;

        // Inicializar con las dimensiones del tubo superior (para la posición base)
        super({
            x: 640,
            velocidad: 5,
            ancho: anchoTubo,
            alto: alturaTuboSuperior,
            reduccionHitbox: 1, // Sin reducción para obstáculos
            y: 0, // El tubo superior empieza en la parte superior (y=0)
            colorHitbox: "green",
        });

        // Guardar información de ambos tubos
        this.alturaTuboSuperior = alturaTuboSuperior;
        this.alturaTuboInferior = alturaTuboInferior;
        this.anchoTubo = anchoTubo;
        this.espacio = espacio;
        this.alturaContenedor = alturaContenedor;

        // Posición Y del tubo inferior
        this.posYInferior = alturaTuboSuperior + espacio;

        // Flag para tracking si el jugador ya pasó este obstáculo (para puntaje)
        this.pasado = false;
    }

    // Override del método getHitbox para devolver ambas hitboxes
    getHitboxes() {
        // Hitbox del tubo superior
        const hitboxSuperior = {
            top: 0,
            bottom: this.alturaTuboSuperior,
            left: this.posX,
            right: this.posX + this.anchoTubo,
            ancho: this.anchoTubo,
            alto: this.alturaTuboSuperior,
        };

        // Hitbox del tubo inferior
        const hitboxInferior = {
            top: this.posYInferior,
            bottom: this.alturaContenedor,
            left: this.posX,
            right: this.posX + this.anchoTubo,
            ancho: this.anchoTubo,
            alto: this.alturaTuboInferior,
        };

        return {
            superior: hitboxSuperior,
            inferior: hitboxInferior,
        };
    }

    // Override para obtener la posición de ambos tubos
    obtenerPosiciones() {
        return {
            superior: { x: this.posX, y: 0, alto: this.alturaTuboSuperior },
            inferior: { x: this.posX, y: this.posYInferior, alto: this.alturaTuboInferior },
        };
    }

    // Marcar como pasado cuando el dragón lo supera
    marcarComoPasado() {
        this.pasado = true;
    }

    fuePasado() {
        return this.pasado;
    }

    // Override del debugHitbox para mostrar ambas hitboxes
    initDebugHitbox() {
        if (!NPCModelo.DEBUG_HITBOX) return;
        const container = document.querySelector(".parallax-container");
        this.hitboxSuperior = document.createElement("div");
        this.hitboxInferior = document.createElement("div");
        container.appendChild(this.hitboxSuperior);
        container.appendChild(this.hitboxInferior);
    }

    debugHitbox() {
        if (!NPCModelo.DEBUG_HITBOX) return;
        const hitboxes = this.getHitboxes();
        
        // Debug hitbox superior
        Object.assign(this.hitboxSuperior.style, {
            position: "absolute",
            left: `${hitboxes.superior.left}px`,
            top: `${hitboxes.superior.top}px`,
            width: `${hitboxes.superior.ancho}px`,
            height: `${hitboxes.superior.alto}px`,
            backgroundColor: this.colorHitbox,
            opacity: "0.3",
        });

        // Debug hitbox inferior
        Object.assign(this.hitboxInferior.style, {
            position: "absolute",
            left: `${hitboxes.inferior.left}px`,
            top: `${hitboxes.inferior.top}px`,
            width: `${hitboxes.inferior.ancho}px`,
            height: `${hitboxes.inferior.alto}px`,
            backgroundColor: this.colorHitbox,
            opacity: "0.3",
        });
    }

    eliminarDebugHitbox(){
        if (!NPCModelo.DEBUG_HITBOX) return;
        this.hitboxInferior?.parentNode?.removeChild(this.hitboxInferior);
        this.hitboxSuperior?.parentNode?.removeChild(this.hitboxSuperior);
    }
}

