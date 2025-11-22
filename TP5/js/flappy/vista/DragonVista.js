// Vista del dragón - Maneja la representación visual del dragón
export class DragonVista {
    constructor() {
        // Referencias a elementos del DOM
        this.elementoDragon = document.getElementById("dragon");
        this.contenedorJuego = document.getElementById("juego-flappy");
        this.contenedorParallax = document.querySelector(".parallax-container");
        this.seccionJuego = document.querySelector(
            "#game-execution.game-page-section"
        );
        this.imagenFondo = this.seccionJuego
            ? this.seccionJuego.querySelector("img")
            : null;
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

    // Muestra el juego y reemplaza el contenido de game-execution
    mostrarJuego() {
        // Mostrar el contenedor del juego
        if (this.contenedorJuego) {
            this.contenedorJuego.classList.remove("oculto");
        }
    }

    // Obtiene el elemento del contenedor del juego (para eventos)
    obtenerContenedorJuego() {
        return this.contenedorJuego;
    }

    coleccionar(){
        this.elementoDragon.classList.add("power-up")
        setTimeout(()=>{this.elementoDragon.classList.remove("power-up")}, 2000)
    }

    // Muestra el mensaje de game over
    mostrarGameOver() {
        // DETENER TODAS LAS ANIMACIONES
        if (this.contenedorParallax) {
            this.contenedorParallax.classList.add("game-over");
        }

        // Detener animación del dragón
        if (this.elementoDragon) {
            this.elementoDragon.classList.add("crash");
        }

        // Mostrar mensaje
        const mensajeGameOver = document.getElementById(
            "mensaje-gameover-flappy"
        );
        if (mensajeGameOver) {
            mensajeGameOver.classList.remove("oculto");
            // Pequeño delay para que la animación se vea
            setTimeout(() => {
                mensajeGameOver.classList.add("aparecer");
            }, 100);
        }
    }

    // Oculta el mensaje de game over
    ocultarGameOver() {
        const mensajeGameOver = document.getElementById(
            "mensaje-gameover-flappy"
        );
        if (mensajeGameOver) {
            mensajeGameOver.classList.remove("aparecer");
            setTimeout(() => {
                mensajeGameOver.classList.add("oculto");
            }, 600);
        }

        // Limpiar clases del dragón
        if (this.elementoDragon) {
            this.elementoDragon.classList.remove("cayendo");
            this.elementoDragon.classList.remove("crash");
        }

        // Reactivar animaciones del parallax
        if (this.contenedorParallax) {
            this.contenedorParallax.classList.remove("game-over");
        }
    }
}
