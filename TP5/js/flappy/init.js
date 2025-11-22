// Importar las clases del patrón MVC
import { DragonModelo } from './modelo/DragonModelo.js';
import { DragonVista } from './vista/DragonVista.js';
import { FlappyController } from './FlappyController.js';

// Inicializar el juego cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    // Crear instancias del Modelo, Vista y Controlador
    const modelo = new DragonModelo();
    const vista = new DragonVista();
    const controlador = new FlappyController(modelo, vista);

    // Manejar eventos de navegacion de menu
    const gameExecutionBox = document.querySelector("#game-execution")
    const botonPlay = gameExecutionBox.querySelector(".play-btn.game-btn");
    const menuPrincipal = gameExecutionBox.querySelector(".menu-principal")
    const botonVolverMenuPrincipal = gameExecutionBox.querySelector("#btn-menu-principal")
    const juegoFlappyBox = gameExecutionBox.querySelector("#juego-flappy")

    botonPlay.addEventListener("click", () => {
        gameExecutionBox.querySelector("img").classList.add("oculto")
        botonPlay.classList.add("oculto")
        menuPrincipal.classList.toggle("oculto")
    });

    menuPrincipal.querySelector("#btn-iniciar-juego").addEventListener("click", () => {
        menuPrincipal.classList.toggle("oculto")
        controlador.iniciarJuego()
    })

    botonVolverMenuPrincipal.addEventListener("click", ()=>{
        menuPrincipal.classList.toggle("oculto")
        juegoFlappyBox.classList.add("oculto")
        controlador.terminarJuego()
    })
});
