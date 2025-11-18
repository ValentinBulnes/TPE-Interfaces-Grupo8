// Controlador del juego - Coordina el modelo y la vista, maneja eventos y el game loop
export class FlappyController {
    constructor(modelo, vista) {
        this.modelo = modelo;
        this.vista = vista;
        this.juegoIniciado = false;
        
        // Configurar eventos
        this.configurarEventos();
    }

    // Configura todos los event listeners
    configurarEventos() {
        // Evento del botón play
        const botonPlay = this.vista.obtenerBotonPlay();
        if (botonPlay) {
            botonPlay.addEventListener("click", () => this.iniciarJuego());
        }

        // Evento de click en el juego para saltar
        const contenedorJuego = this.vista.obtenerContenedorJuego();
        if (contenedorJuego) {
            contenedorJuego.addEventListener("click", () => this.manejarSalto());
        }
    }

    // Inicia el juego
    iniciarJuego() {
        // Mostrar el juego
        this.vista.mostrarJuego();
        
        // Reiniciar el modelo
        this.modelo.reiniciar();
        
        // Marcar el juego como iniciado
        this.juegoIniciado = true;
        
        // Iniciar el game loop
        this.gameLoop();
    }

    // Maneja el evento de salto
    manejarSalto() {
        if (this.juegoIniciado) {
            this.modelo.saltar();
        }
    }

    // Game loop - actualiza la lógica y la vista constantemente
    gameLoop() {
        if (!this.juegoIniciado) return;

        // Actualizar el modelo (física del dragón)
        this.modelo.actualizar();

        // Actualizar la vista con la nueva posición y velocidad (para la rotación)
        const posicion = this.modelo.obtenerPosicion();
        const velocidad = this.modelo.obtenerVelocidad();
        this.vista.actualizarPosicion(posicion, velocidad);

        // Continuar el loop
        requestAnimationFrame(() => this.gameLoop());
    }
}

