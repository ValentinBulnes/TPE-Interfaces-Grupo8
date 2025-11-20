// Vista del dragón - Maneja la representación visual del dragón
export class DragonVista {
    constructor() {
        // Referencias a elementos del DOM
        this.elementoDragon = document.getElementById("dragon");
        this.contenedorJuego = document.getElementById("juego-flappy");
        this.contenedorParallax = document.querySelector(".parallax-container");
        this.seccionJuego = document.querySelector("#game-execution.game-page-section");
        this.imagenFondo = this.seccionJuego ? this.seccionJuego.querySelector("img") : null;
        this.botonPlay = document.querySelector(".play-btn.game-btn");
    }

    // Actualiza la posición visual del dragón con rotación
    actualizarPosicion(posicionY, velocidadY, esColision, limiteInferior) {
        if (this.elementoDragon) {
            // Si hay colisión, detener TODAS las animaciones
            if (esColision) {
                this.elementoDragon.classList.add("cayendo");
                // Detener animaciones del parallax
                if (this.contenedorParallax) {
                    this.contenedorParallax.classList.add("game-over");
                }
            } else {
                // Calcular la rotación basándose en la velocidad
                // Velocidad negativa (sube) = rotación negativa (apunta arriba)
                // Velocidad positiva (cae) = rotación positiva (apunta abajo)
                const rotacion = velocidadY * 3; // Multiplicamos por 3 para que sea más notorio
                
                // Limitar la rotación para que no sea exagerada
                const rotacionLimitada = Math.max(-30, Math.min(30, rotacion));
                
                this.elementoDragon.style = `--position-y: ${posicionY}%;--rotation: ${rotacionLimitada}deg;`;
                
                // Si el dragón está cayendo (velocidad positiva mayor a 2) O está en el piso, pausar animación y mostrar último frame
                if (velocidadY > 7 || posicionY >= limiteInferior) {
                    this.elementoDragon.classList.add("cayendo");
                } else {
                    this.elementoDragon.classList.remove("cayendo");
                }
            }
        }
    }

    // Muestra el juego y reemplaza el contenido de game-execution
    mostrarJuego() {
        // Limpiar el contenido de game-execution (imagen y botón)
        if (this.seccionJuego) {
            // Remover todos los hijos excepto juego-flappy
            const hijos = Array.from(this.seccionJuego.children);
            hijos.forEach(hijo => {
                if (hijo.id !== 'juego-flappy') {
                    hijo.remove();
                }
            });
        }

        // Mostrar el contenedor del juego
        if (this.contenedorJuego) {
            this.contenedorJuego.classList.remove("oculto");
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

    // Muestra el mensaje de game over
    mostrarGameOver() {
        // DETENER TODAS LAS ANIMACIONES
        if (this.contenedorParallax) {
            this.contenedorParallax.classList.add('game-over');
        }
        
        // Detener animación del dragón
        if (this.elementoDragon) {
            this.elementoDragon.classList.add('cayendo');
        }
        
        // Mostrar mensaje
        const mensajeGameOver = document.getElementById('mensaje-gameover-flappy');
        if (mensajeGameOver) {
            mensajeGameOver.classList.remove('oculto');
            // Pequeño delay para que la animación se vea
            setTimeout(() => {
                mensajeGameOver.classList.add('aparecer');
            }, 100);
        }
    }

    // Oculta el mensaje de game over
    ocultarGameOver() {
        const mensajeGameOver = document.getElementById('mensaje-gameover-flappy');
        if (mensajeGameOver) {
            mensajeGameOver.classList.remove('aparecer');
            setTimeout(() => {
                mensajeGameOver.classList.add('oculto');
            }, 600);
        }
        
        // Limpiar clases del dragón
        if (this.elementoDragon) {
            this.elementoDragon.classList.remove('cayendo');
        }
        
        // Reactivar animaciones del parallax
        if (this.contenedorParallax) {
            this.contenedorParallax.classList.remove('game-over');
        }
    }
}

