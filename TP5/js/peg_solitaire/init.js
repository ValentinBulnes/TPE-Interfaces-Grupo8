import { JuegoController } from "./JuegoController.js";
import { FichaVista } from "./vista/FichaVista.js";

let juegoController = null;

/**
 * Inicializa el juego creando una nueva instancia del controlador.
 * Si ya existe un juego anterior, lo detiene antes de crear uno nuevo.
 */
function inicializarJuego() {
    const canvas = document.getElementById("canvas");
    if (canvas) {

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

/**
 * Muestra el mensaje de victoria en la interfaz.
 * Remueve la clase oculto y agrega la clase aparecer para hacer visible el mensaje.
 */
function mostrarVictoria() {
    const mensajeVictoria = document.getElementById("mensaje-victoria");
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
    const mensajeGameOver = document.getElementById("mensaje-gameover");
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

/**
 * Muestra el menú principal del juego peg solitaire.
 * Configura el fondo del juego, oculta la imagen de fondo y el botón de comenzar,
 * y muestra el menú principal.
 */
function mostrarMenuPrincipalPeg() {
    const menuPrincipal = document.getElementById("menu-principal-peg");
    const btnComenzarPeg = document.querySelector(".play-btn.game-btn");
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
    if (btnComenzarPeg) {
        btnComenzarPeg.style.display = "none";
    }
    if (menuPrincipal) {
        menuPrincipal.classList.remove("oculto");
    }
}

/**
 * Muestra el menú de selección de fichas y oculta el menú principal.
 * Cambia la visibilidad de los elementos del menú para navegar entre pantallas.
 */
function mostrarMenuSeleccionFicha() {
    const menuPrincipal = document.getElementById("menu-principal-peg");
    const menuSeleccionFicha = document.getElementById("menu-seleccion-ficha-peg");

    // Ocultar menú principal
    if (menuPrincipal) {
        menuPrincipal.classList.add("oculto");
    }

    // Mostrar menú de selección de fichas
    if (menuSeleccionFicha) {
        menuSeleccionFicha.classList.remove("oculto");
    }
}

/**
 * Inicia el juego ocultando el menú de selección de fichas y mostrando el canvas del juego.
 * Hace visible la sección donde se renderiza el tablero del juego.
 */
function iniciarJuegoPeg() {
    const menuSeleccionFicha = document.getElementById("menu-seleccion-ficha-peg");

    // Ocultar menú de selección
    if (menuSeleccionFicha) {
        menuSeleccionFicha.classList.add("oculto");
    }

    // Mostrar juego
    const juegoPeg = document.getElementById("juego-peg");
    if (juegoPeg) {
        juegoPeg.classList.remove("oculto");
    }
}

/**
 * Vuelve al menú principal del juego.
 * Detiene el juego actual, oculta los mensajes y cambia la visibilidad de los elementos
 * para mostrar el menú principal y ocultar el juego.
 */
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

// Botón "Comenzar" del menú principal (muestra selección de fichas)
const btnIniciarJuego = document.getElementById("btn-iniciar-juego");
if (btnIniciarJuego) {
    btnIniciarJuego.addEventListener("click", mostrarMenuSeleccionFicha);
}

// Botones de selección de fichas
const fichasOpciones = document.querySelectorAll(".ficha-opcion");
fichasOpciones.forEach((fichaBtn, indice) => {
    fichaBtn.addEventListener("click", () => {
        console.log("Ficha seleccionada:", indice);
        
        // Configurar la ficha seleccionada en FichaVista
        FichaVista.seleccionarSkinFicha(indice);
        
        // Iniciar el juego con la ficha seleccionada
        iniciarJuegoPeg();
        inicializarJuego();
    });
});

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

// Botón reiniciar juego - reinicia el juego actual
const btnReiniciarJuego = document.getElementById("btn-reiniciar-juego");
if (btnReiniciarJuego) {
    btnReiniciarJuego.addEventListener("click", () => {
        ocultarMensajes();
        inicializarJuego();
    });
}