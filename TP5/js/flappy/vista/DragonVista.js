// Vista del dragón - Maneja SOLO la representación visual del dragón
export class DragonVista {
    constructor() {
        // Referencia solo al elemento del dragón
        this.elementoDragon = document.getElementById("dragon");
    }

    // Actualiza la posición visual del dragón con rotación
    actualizarPosicion(posicionY, velocidadY, limiteInferior, esInvulnerable) {
        if (this.elementoDragon) {
            // Calcular la rotación basándose en la velocidad
            // Velocidad negativa (sube) = rotación negativa (apunta arriba)
            // Velocidad positiva (cae) = rotación positiva (apunta abajo)
            const rotacion = velocidadY * 3; // Multiplicamos por 3 para que sea más notorio

            // Limitar la rotación para que no sea exagerada
            const rotacionLimitada = Math.max(-30, Math.min(30, rotacion));

            this.elementoDragon.style = `--position-y: ${posicionY}px;--rotation: ${rotacionLimitada}deg;`;

            // Si el dragón está cayendo (velocidad positiva mayor a 2) O está en el piso, pausar animación y mostrar último frame
            if (velocidadY > 7 || posicionY >= limiteInferior) {
                this.elementoDragon.classList.add("cayendo");
            } else {
                this.elementoDragon.classList.remove("cayendo");
            }
            
            if(esInvulnerable){
                this.elementoDragon.classList.toggle("invulnerable", true)
            }else{
                this.elementoDragon.classList.remove("invulnerable");
            }
        }
    }

    // Aplica efecto visual de crash al dragón
    aplicarEfectoCrash() {
        if (this.elementoDragon) {
            this.elementoDragon.classList.add("crash");
        }
    }

    // Aplica efecto visual de power-up al dragón
    aplicarEfectoPowerUp() {
        if (this.elementoDragon) {
            this.elementoDragon.classList.add("power-up");
            setTimeout(() => {
                this.elementoDragon.classList.remove("power-up");
            }, 2000);
        }
    }

    // Limpia todos los efectos visuales del dragón
    limpiarEfectos() {
        if (this.elementoDragon) {
            this.elementoDragon.classList.remove("cayendo");
            this.elementoDragon.classList.remove("crash");
            this.elementoDragon.classList.remove("invulnerable");
            this.elementoDragon.classList.remove("power-up");
        }
    }
}
