import { JuegoController } from "./JuegoController.js";

let juegoController = null;

// ============================================
// INICIALIZACIÓN DEL JUEGO
// ============================================

function inicializarJuego() {
    const canvas = document.getElementById("canvas");
    if (canvas) {
        // Si ya existe un controlador, detener el juego anterior
        if (juegoController) {
            juegoController.detenerJuego();
        }

        // Crear nueva instancia del juego con callbacks
        juegoController = new JuegoController(
            canvas,
            mostrarVictoria,  // callback victoria
            mostrarGameOver   // callback game over
        );
    }
}

// ============================================
// MENSAJES DE UI
// ============================================

function mostrarVictoria() {
    const mensajeVictoria = document.getElementById("mensaje-victoria");
    if (mensajeVictoria) {
        mensajeVictoria.classList.remove("oculto");
        mensajeVictoria.classList.add("aparecer");
    }
}

function mostrarGameOver() {
    const mensajeGameOver = document.getElementById("mensaje-gameover");
    if (mensajeGameOver) {
        mensajeGameOver.classList.remove("oculto");
        mensajeGameOver.classList.add("aparecer");
    }
}

function ocultarMensajes() {
    const mensajeVictoria = document.getElementById("mensaje-victoria");
    const mensajeGameOver = document.getElementById("mensaje-gameover");

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

function mostrarMenuPrincipalPeg() {
    const menuPrincipal = document.getElementById("menu-principal-peg");
    const btnComenzarPeg = document.querySelector(".play-btn.game-btn");
    const gamePageSection = document.querySelector("#game-execution.game-page-section");
    const imagenFondo = gamePageSection ? gamePageSection.querySelector("img") : null;

    // Agrandar el div game-page-section a 800px de altura y cambiar fondo
    if (gamePageSection) {
        gamePageSection.style.height = "800px";
        gamePageSection.style.backgroundColor = "#2e2e2e";
    }

    // Ocultar la imagen de fondo
    if (imagenFondo) {
        imagenFondo.style.display = "none";
    }

    // Ocultar preview y botón, mostrar menú
    if (btnComenzarPeg) {
        btnComenzarPeg.style.display = "none";
    }
    if (menuPrincipal) {
        menuPrincipal.classList.remove("oculto");
    }
}

function iniciarJuegoPeg() {
    const menuPrincipal = document.getElementById("menu-principal-peg");

    // Ocultar menú
    if (menuPrincipal) {
        menuPrincipal.classList.add("oculto");
    }

    // Mostrar juego
    const juegoPeg = document.getElementById("juego-peg");
    if (juegoPeg) {
        juegoPeg.classList.remove("oculto");
    }
}

function volverAlMenuPeg() {
    const juegoPeg = document.getElementById("juego-peg");
    const menuPrincipal = document.getElementById("menu-principal-peg");

    // Detener el juego si está corriendo
    if (juegoController) {
        juegoController.detenerJuego();
    }

    // Ocultar mensajes
    ocultarMensajes();

    // Ocultar juego y mostrar menú principal
    if (juegoPeg && menuPrincipal) {
        juegoPeg.classList.add("oculto");
        menuPrincipal.classList.remove("oculto");
    }
}

// ============================================
// EVENT LISTENERS
// ============================================

// Botón de play (muestra menú principal)
const btnComenzarPeg = document.querySelector(".play-btn.game-btn");
if (btnComenzarPeg) {
    btnComenzarPeg.addEventListener("click", mostrarMenuPrincipalPeg);
}

// Botón "Comenzar" del menú principal
const btnIniciarJuego = document.getElementById("btn-iniciar-juego");
if (btnIniciarJuego) {
    btnIniciarJuego.addEventListener("click", () => {
        iniciarJuegoPeg();
        inicializarJuego();
    });
}

// Botón reintentar (después de game over)
const btnReintentar = document.getElementById("btn-reintentar");
if (btnReintentar) {
    btnReintentar.addEventListener("click", () => {
        ocultarMensajes();
        inicializarJuego();
    });
}

// Botón volver a jugar (después de ganar)
const btnJugarNuevo = document.getElementById("btn-jugar-nuevo");
if (btnJugarNuevo) {
    btnJugarNuevo.addEventListener("click", () => {
        ocultarMensajes();
        inicializarJuego();
    });
}

// Botón menú principal - detener temporizador
const btnMenuPrincipal = document.getElementById("btn-menu-principal");
if (btnMenuPrincipal) {
    btnMenuPrincipal.addEventListener("click", () => {
        volverAlMenuPeg();
    });
}
