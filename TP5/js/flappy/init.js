// Importar controlador del juego cuando esté disponible
// import { FlappyController } from "./FlappyController.js";

let juegoController = null;

/**
 * Inicializa el juego creando una nueva instancia del controlador.
 * Si ya existe un juego anterior, lo detiene antes de crear uno nuevo.
 */
function inicializarJuego() {
    // Cuando el controlador esté disponible, descomentar:
    // const juegoFlappy = document.getElementById("juego-flappy");
    // if (juegoFlappy) {
    //     if (juegoController) {
    //         juegoController.detenerJuego();
    //     }
    //     juegoController = new FlappyController(
    //         juegoFlappy,
    //         mostrarVictoria,  // callback victoria
    //         mostrarGameOver   // callback game over
    //     );
    // }
}

/**
 * Muestra el mensaje de victoria en la interfaz.
 * Remueve la clase oculto y agrega la clase aparecer para hacer visible el mensaje.
 */
function mostrarVictoria() {
    const mensajeVictoria = document.getElementById("mensaje-victoria-flappy");
    if (mensajeVictoria) {
        mensajeVictoria.classList.remove("oculto");
        mensajeVictoria.classList.add("aparecer");
    }
}

/**
 * Muestra el mensaje de game over en la interfaz.
 * Remueve la clase oculto y agrega la clase aparecer para hacer visible el mensaje.
 */
function mostrarGameOver() {
    const mensajeGameOver = document.getElementById("mensaje-gameover-flappy");
    if (mensajeGameOver) {
        mensajeGameOver.classList.remove("oculto");
        mensajeGameOver.classList.add("aparecer");
    }
}

/**
 * Oculta todos los mensajes de victoria y game over.
 * Agrega la clase oculto y remueve la clase aparecer para ocultar los mensajes.
 */
function ocultarMensajes() {
    const mensajeVictoria = document.getElementById("mensaje-victoria-flappy");
    const mensajeGameOver = document.getElementById("mensaje-gameover-flappy");

    if (mensajeVictoria) {
        mensajeVictoria.classList.add("oculto");
        mensajeVictoria.classList.remove("aparecer");
    }

    if (mensajeGameOver) {
        mensajeGameOver.classList.add("oculto");
        mensajeGameOver.classList.remove("aparecer");
    }
}

// ============================================
// NAVEGACIÓN DEL JUEGO
// ============================================

/**
 * Muestra el menú principal del juego Flappy Dragon.
 * Configura el fondo del juego, oculta la imagen de fondo y el botón de comenzar,
 * y muestra el menú principal.
 */
function mostrarMenuPrincipalFlappy() {
    const btnComenzarFlappy = document.querySelector(".play-btn.game-btn");
    const gamePageSection = document.querySelector("#game-execution.game-page-section");
    const imagenFondo = gamePageSection ? gamePageSection.querySelector("img") : null;

    // Agregar clase para mostrar el background del juego
    if (gamePageSection) {
        gamePageSection.classList.add("jugando");
    }

    // Ocultar la imagen de fondo
    if (imagenFondo) {
        imagenFondo.style.display = "none";
    }

    // Ocultar preview y botón, mostrar menú
    if (btnComenzarFlappy) {
        btnComenzarFlappy.style.display = "none";
    }

    // Iniciar el juego directamente
    iniciarJuegoFlappy();
}

/**
 * Inicia el juego ocultando cualquier menú y mostrando el contenedor del juego.
 * Hace visible la sección donde se renderiza el juego Flappy Dragon.
 */
function iniciarJuegoFlappy() {
    // Mostrar juego
    const juegoFlappy = document.getElementById("juego-flappy");
    if (juegoFlappy) {
        juegoFlappy.classList.remove("oculto");
    }

    // Inicializar el juego
    inicializarJuego();
}

/**
 * Vuelve al menú principal del juego.
 * Detiene el juego actual, oculta los mensajes y cambia la visibilidad de los elementos
 * para mostrar el menú principal y ocultar el juego.
 */
function volverAlMenuFlappy() {
    const juegoFlappy = document.getElementById("juego-flappy");
    const btnComenzarFlappy = document.querySelector(".play-btn.game-btn");
    const gamePageSection = document.querySelector("#game-execution.game-page-section");
    const imagenFondo = gamePageSection ? gamePageSection.querySelector("img") : null;

    // Detener el juego si está corriendo
    if (juegoController) {
        juegoController.detenerJuego();
    }

    // Ocultar mensajes
    ocultarMensajes();

    // Ocultar juego
    if (juegoFlappy) {
        juegoFlappy.classList.add("oculto");
    }

    // Mostrar imagen de fondo y botón de play
    if (imagenFondo) {
        imagenFondo.style.display = "block";
    }

    if (btnComenzarFlappy) {
        btnComenzarFlappy.style.display = "block";
    }

    // Remover clase de jugando
    if (gamePageSection) {
        gamePageSection.classList.remove("jugando");
    }
}

// ============================================
// EVENT LISTENERS
// ============================================

// Botón de play (muestra menú principal e inicia juego)
const btnComenzarFlappy = document.querySelector(".play-btn.game-btn");
if (btnComenzarFlappy) {
    btnComenzarFlappy.addEventListener("click", mostrarMenuPrincipalFlappy);
}

// Botón reintentar (después de game over)
const btnReintentar = document.getElementById("btn-reintentar-flappy");
if (btnReintentar) {
    btnReintentar.addEventListener("click", () => {
        ocultarMensajes();
        inicializarJuego();
    });
}

// Botón volver a jugar (después de ganar)
const btnJugarNuevo = document.getElementById("btn-jugar-nuevo-flappy");
if (btnJugarNuevo) {
    btnJugarNuevo.addEventListener("click", () => {
        ocultarMensajes();
        inicializarJuego();
    });
}

// Botón menú principal - volver al menú
const btnMenuPrincipal = document.getElementById("btn-menu-principal-flappy");
if (btnMenuPrincipal) {
    btnMenuPrincipal.addEventListener("click", () => {
        volverAlMenuFlappy();
    });
}

// Botón reiniciar juego - reinicia el juego actual
const btnReiniciarJuego = document.getElementById("btn-reiniciar-juego-flappy");
if (btnReiniciarJuego) {
    btnReiniciarJuego.addEventListener("click", () => {
        ocultarMensajes();
        inicializarJuego();
    });
}
