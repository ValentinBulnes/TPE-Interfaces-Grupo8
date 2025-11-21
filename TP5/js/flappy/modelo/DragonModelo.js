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
            colorHitbox: "blue",
        });
        this.coleccionables = { corazon: 2 };

        // Estado del dragón
        this.velocidadY = 0; // Velocidad vertical del dragón
        this.gameOver = false; // Flag de game over

        // Constantes físicas
        this.gravedad = 0.23; // Aceleración de la gravedad
        this.fuerzaSalto = -5; // Fuerza del salto (negativo = hacia arriba)

        // Límites iniciales (se recalcularán al iniciar el juego)
        this.limiteSuperior = -445;
        this.limiteInferior = 47;

        // Sistema de inmunidad transitoria
        this.invulnerable = false;
        this.tiempoInvulnerabilidad = 0;
        this.duracionInvulnerabilidad = 2000; // 2 segundos en milisegundos
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

        if (this.esColisionSuelo()) {
            // El dragón tocó el suelo - GAME OVER
            this.posY = this.limiteInferior;
            this.velocidadY = 0;
            this.gameOver = true;
        }

        this.actualizarInvulnerabilidad();

        this.debugHitbox();
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
        // Valor negativo = hacia arriba desde la posición base
        this.posY = 0;
        this.velocidadY = 0;
        this.gameOver = false;
        this.coleccionables = { corazon: 2 };
        this.invulnerable = false;
        this.tiempoInvulnerabilidad = 0;
    }

    // Verifica si hay colisión con el suelo (game over)
    esColisionSuelo() {
        return this.posY >= this.limiteInferior;
    }

    // Verifica si el juego terminó
    esGameOver(hayColision = false) {
        if (hayColision && !this.invulnerable) {
            // Solo procesar la colisión si no está invulnerable
            console.log(
                `Hubo colisión, pierdo una vida: ${
                    this.coleccionables.corazon
                } -> ${this.coleccionables.corazon - 1}`
            );
            this.coleccionables.corazon--;

            // Activar invulnerabilidad si sigue vivo
            if (this.coleccionables.corazon > 0) {
                this.activarInvulnerabilidad();
            }
        }
        return this.gameOver || this.coleccionables.corazon <= 0;
    }

    // Activa el estado de invulnerabilidad transitoria
    activarInvulnerabilidad() {
        this.invulnerable = true;
        this.tiempoInvulnerabilidad = this.duracionInvulnerabilidad;
        console.log("🛡️ Dragón invulnerable por 2 segundos");
    }

    // Actualizar estado de invulnerabilidad
    actualizarInvulnerabilidad() {
        if (this.invulnerable) {
            this.tiempoInvulnerabilidad -= 16; // Aproximadamente 60 FPS
            if (this.tiempoInvulnerabilidad <= 0) {
                this.invulnerable = false;
                this.tiempoInvulnerabilidad = 0;
            }
        }
    }

    // Devuelve si el dragón está actualmente invulnerable
    estaInvulnerable() {
        return this.invulnerable;
    }

    // Devuelve el porcentaje de invulnerabilidad restante (0-1)
    // obtenerPorcentajeInvulnerabilidad() {
    //     if (!this.invulnerable) return 0;
    //     return this.tiempoInvulnerabilidad / this.duracionInvulnerabilidad;
    // }

    coleccionar(conjuntoColeccionables) {
        for (let coleccionable of conjuntoColeccionables) {
            // El controlador pasa objetos { modelo, vista }
            // Aceptar también si se le pasa directamente el modelo
            const tipo =
                coleccionable.tipo ||
                (coleccionable.modelo && coleccionable.modelo.tipo);
            if (!tipo) continue;
            if (!this.coleccionables[tipo]) this.coleccionables[tipo] = 0;
            this.coleccionables[tipo] += 1;
        }

        console.log("coleccionables (modelo):", this.coleccionables);
    }

    // getCenterPos() y getHitbox() se heredan de NPCModelo
}
