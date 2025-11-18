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
    
    // El controlador ya se encarga de configurar todos los eventos
});


