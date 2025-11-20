// Modelo del dragón - Maneja toda la lógica y el estado del dragón
import { NPCModelo } from "./NPCModelo.js";

export class DragonModelo extends NPCModelo {
    constructor() {
        // Inicializar la clase padre con parámetros específicos del dragón
        super({
            x: 640 * 0.07, // posX: 7% del ancho del contenedor
            velocidad: 0, // El dragón no se mueve horizontalmente
            ancho: 81.7,
            alto: 67.8,
            reduccionHitbox: 0.6,
            y: 200, // Posición Y inicial
        });

        // Estado del dragón
        this.velocidadY = 0; // Velocidad vertical del dragón
        this.gameOver = false; // Flag de game over

        // Constantes físicas
        this.gravedad = 0.23; // Aceleración de la gravedad
        this.fuerzaSalto = -5; // Fuerza del salto (negativo = hacia arriba)

        // Límites iniciales (se recalcularán al iniciar el juego)
        this.limiteSuperior = -445;
        this.limiteInferior = 47;
    }

    // Calcula los límites del dragón basándose en las dimensiones del contenedor
    calcularLimites() {
        // Obtener dimensiones del contenedor parallax
        const contenedor = document.querySelector(".parallax-container");
        const elementoDragon = document.getElementById("dragon");

        if (!contenedor || !elementoDragon) {
            this.limiteSuperior = -445;
            this.limiteInferior = 47;
            return;
        }

        // Obtener dimensiones del contenedor y del dragón
        const alturaContenedor = contenedor.offsetHeight;
        const estilosDragon = window.getComputedStyle(elementoDragon);
        const bottomDragon = parseFloat(estilosDragon.bottom);
        const alturaDragon = parseFloat(estilosDragon.height);

        // CÁLCULO SIMPLE (sin escalas complicadas):
        // Posición inicial del borde inferior: bottomDragon
        // Posición inicial del borde superior: bottomDragon + alturaDragon

        const bordeInferiorInicial = bottomDragon;
        const bordeSuperiorInicial = bottomDragon + alturaDragon;

        // LÍMITE INFERIOR: para que el borde inferior toque y=0 (el suelo)
        this.limiteInferior = bordeInferiorInicial;

        // LÍMITE SUPERIOR: para que el borde superior toque y=alturaContenedor (el techo)
        const distanciaHastaTecho = alturaContenedor - bordeSuperiorInicial;
        this.limiteSuperior = -distanciaHastaTecho;
    }

    // Aplica la gravedad y actualiza la posición del dragón
    actualizar() {
        // Aplicar gravedad
        this.velocidadY += this.gravedad;

        // Actualizar posición Y
        this.posY += this.velocidadY;

        // REGLA FUNDAMENTAL: El dragón NUNCA puede salir de la pantalla
        // Verificar límite superior (no salir por arriba)
        if (this.posY <= this.limiteSuperior) {
            // El dragón tocó el techo - Solo detenerlo, sin game over
            this.posY = this.limiteSuperior;
            this.velocidadY = 0;
        }

        // Verificar límite inferior (no salir por abajo)
        if (this.posY >= this.limiteInferior) {
            // El dragón tocó el suelo - GAME OVER
            this.posY = this.limiteInferior;
            this.velocidadY = 0;
            this.gameOver = true;
        }
    }

    // Hace saltar al dragón
    saltar() {
        this.velocidadY = this.fuerzaSalto;
    }

    // Obtiene la posición actual del dragón
    obtenerPosicion() {
        return this.posY;
    }

    // Obtiene la velocidad actual del dragón
    obtenerVelocidad() {
        return this.velocidadY;
    }

    // Reinicia el estado del dragón
    reiniciar() {
        // Posición inicial: un poco más arriba de la mitad del contenedor
        // Valor negativo = hacia arriba desde la posición base (bottom: 47px)
        this.posY = 0;
        this.velocidadY = 0;
        this.gameOver = false;
    }

    // Verifica si hay colisión con el suelo (game over)
    esColision() {
        return this.posY >= this.limiteInferior;
    }

    // Verifica si el juego terminó
    esGameOver() {
        return this.gameOver;
    }

    // getCenterPos() y getHitbox() se heredan de NPCModelo
}
