// Vista del dragón - Maneja la representación visual del dragón
export class DragonVista {
    constructor() {
        // Referencias a elementos del DOM
        this.elementoDragon = document.getElementById("dragon");
        this.contenedorJuego = document.getElementById("juego-flappy");
        this.seccionJuego = document.querySelector("#game-execution.game-page-section");
        this.imagenFondo = this.seccionJuego ? this.seccionJuego.querySelector("img") : null;
        this.botonPlay = document.querySelector(".play-btn.game-btn");
    }

    // Actualiza la posición visual del dragón con rotación
    actualizarPosicion(posicionY, velocidadY, esColision) {
        if (esColision) {
            this.elementoDragon.classList.add("crash")
        }
        if (this.elementoDragon) {
            // Calcular la rotación basándose en la velocidad
            // Velocidad negativa (sube) = rotación negativa (apunta arriba)
            // Velocidad positiva (cae) = rotación positiva (apunta abajo)
            const rotacion = velocidadY * 3; // Multiplicamos por 3 para que sea más notorio
            
            // Limitar la rotación para que no sea exagerada
            const rotacionLimitada = Math.max(-30, Math.min(30, rotacion));
            
            this.elementoDragon.style = `--position-y: ${posicionY}%;--rotation: ${rotacionLimitada}deg;`;
            
            // Límite inferior del modelo (debe coincidir con DragonModelo.js)
            const limiteInferior = 370;
            
            // Si el dragón está cayendo (velocidad positiva mayor a 2) O está en el piso, pausar animación y mostrar último frame
            if (velocidadY > 7 || posicionY >= limiteInferior) {
                this.elementoDragon.classList.add("cayendo");
            } else {
                this.elementoDragon.classList.remove("cayendo");
            }
        }
    }

    // Muestra el juego y oculta la imagen de fondo y el botón
    mostrarJuego() {
        // Mostrar el contenedor del juego
        if (this.contenedorJuego) {
            this.contenedorJuego.classList.remove("oculto");
        }

        // Ocultar la imagen de fondo
        if (this.imagenFondo) {
            this.imagenFondo.style.display = "none";
        }

        // Ocultar el botón play
        if (this.botonPlay) {
            this.botonPlay.style.display = "none";
        }
    }

    // Obtiene el elemento del contenedor del juego (para eventos)
    obtenerContenedorJuego() {
        return this.contenedorJuego;
    }

    // Obtiene el botón de play (para eventos)
    obtenerBotonPlay() {
        return this.botonPlay;
    }
}

