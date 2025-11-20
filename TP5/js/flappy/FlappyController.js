// Controlador del juego - Coordina el modelo y la vista, maneja eventos y el game loop
import { EnemigoModelo } from './modelo/EnemigoModelo.js';
import { EnemigoVista } from './vista/EnemigoVista.js';
import { ColeccionableModelo } from './modelo/ColeccionableModelo.js';
import { ColeccionableVista } from './vista/ColeccionableVista.js';

export class FlappyController {
    constructor(modelo, vista) {
        this.modelo = modelo;
        this.vista = vista;
        this.juegoIniciado = false;
        this.enemigos = []; // Array to store active enemies { modelo, vista }
        this.coleccionables = []; // Array to store active collectibles (coins and hearts)
        this.tiempoUltimoEnemigo = 0;
        this.tiempoUltimoColeccionable = 0;
        this.intervaloEnemigos = 2000; // Spawn enemy every 2 seconds
        this.intervaloColeccionables = 3000; // Spawn collectible every 3 seconds
        
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
        
        // Ocultar mensaje de game over si estaba visible
        this.vista.ocultarGameOver();
        
        // Calcular límites del dragón basándose en el contenedor
        this.modelo.calcularLimites();
        
        // Reiniciar el modelo
        this.modelo.reiniciar();
        
        // Limpiar enemigos existentes
        this.limpiarEnemigos();

        // Marcar el juego como iniciado
        this.juegoIniciado = true;
        this.tiempoUltimoEnemigo = performance.now();
        this.tiempoUltimoColeccionable = performance.now();
        
        // Iniciar el game loop
        this.gameLoop(performance.now());
    }

    limpiarEnemigos() {
        this.enemigos.forEach(enemigo => enemigo.vista.eliminar());
        this.enemigos = [];
        this.coleccionables.forEach(coleccionable => coleccionable.vista.eliminar());
        this.coleccionables = [];
    }

    // Maneja el evento de salto
    manejarSalto() {
        if (this.juegoIniciado) {
            this.modelo.saltar();
        }
    }

    // Game loop - actualiza la lógica y la vista constantemente
    gameLoop(tiempoActual) {
        if (!this.juegoIniciado) return;

        // Actualizar el modelo (física del dragón)
        this.modelo.actualizar();

        // Actualizar la vista con la nueva posición y velocidad (para la rotación)
        const posicion = this.modelo.obtenerPosicion();
        const velocidad = this.modelo.obtenerVelocidad();
        const esColision = this.modelo.esColision();
        const limiteInferior = this.modelo.limiteInferior;
        // Verificar colisiones con enemigos
        const hayColisionEnemiga = this.verificarColisionEnemigos();
        const hayColision = esColision || hayColisionEnemiga
        this.vista.actualizarPosicion(posicion, velocidad, hayColision, limiteInferior);

        // Verificar si hay game over DESPUÉS de actualizar la vista
        if (this.modelo.esGameOver()) {
            this.terminarJuego();
            return;
        }


        
        if (hayColision) {
            this.modelo.gameOver = true;
            this.terminarJuego();
            return;
        }

        // Gestionar enemigos y coleccionables
        this.gestionarEnemigos(tiempoActual);
        this.gestionarColeccionables(tiempoActual);

        // Continuar el loop
        requestAnimationFrame((t) => this.gameLoop(t));
    }

    // Termina el juego y muestra el mensaje de game over
    terminarJuego() {
        this.juegoIniciado = false;
        this.vista.mostrarGameOver();
        
        // Configurar botón de reintentar
        const botonReintentar = document.getElementById('btn-reintentar-flappy');
        if (botonReintentar) {
            botonReintentar.onclick = () => this.iniciarJuego();
        }
    }

    gestionarEnemigos(tiempoActual) {
        // Generar nuevos enemigos
        if (tiempoActual - this.tiempoUltimoEnemigo > this.intervaloEnemigos) {
            this.crearEnemigo();
            this.tiempoUltimoEnemigo = tiempoActual;
        }

        // Actualizar y eliminar enemigos
        for (let i = this.enemigos.length - 1; i >= 0; i--) {
            const enemigo = this.enemigos[i];
            enemigo.modelo.actualizar();
            
            if (enemigo.modelo.marcadoParaEliminar) {
                enemigo.vista.eliminar();
                this.enemigos.splice(i, 1);
            } else {
                const pos = enemigo.modelo.obtenerPosicion();
                enemigo.vista.actualizarPosicion(pos.x, pos.y);
            }
        }
    }

    crearEnemigo() {
        const modelo = new EnemigoModelo();
        const vista = new EnemigoVista();
        this.enemigos.push({ modelo, vista });
        
        // Initial position update
        const pos = modelo.obtenerPosicion();
        vista.actualizarPosicion(pos.x, pos.y);
    }

    gestionarColeccionables(tiempoActual) {
        // Generar nuevos coleccionables
        if (tiempoActual - this.tiempoUltimoColeccionable > this.intervaloColeccionables) {
            // Alternar entre moneda y corazon aleatoriamente
            const tipo = Math.random() < 0.7 ? 'moneda' : 'corazon'; // 70% monedas, 30% corazones
            this.crearColeccionable(tipo);
            this.tiempoUltimoColeccionable = tiempoActual;
        }

        // Actualizar y eliminar coleccionables
        for (let i = this.coleccionables.length - 1; i >= 0; i--) {
            const coleccionable = this.coleccionables[i];
            coleccionable.modelo.actualizar();
            
            if (coleccionable.modelo.marcadoParaEliminar) {
                coleccionable.vista.eliminar();
                this.coleccionables.splice(i, 1);
            } else {
                const pos = coleccionable.modelo.obtenerPosicion();
                coleccionable.vista.actualizarPosicion(pos.x, pos.y);
            }
        }
    }

    crearColeccionable(tipo) {
        const modelo = new ColeccionableModelo(tipo);
        const vista = new ColeccionableVista(tipo);
        this.coleccionables.push({ modelo, vista });
        
        // Initial position update
        const pos = modelo.obtenerPosicion();
        vista.actualizarPosicion(pos.x, pos.y);
    }

    // Verifica si hay colisión entre el dragón y los enemigos
    verificarColisionEnemigos() {
        if (this.enemigos.length === 0) {
            return false; // No hay enemigos
        }

        // Obtener posición y dimensiones del dragón
        const dragonY = this.modelo.obtenerPosicion(); // translateY value
        const dragonAncho = 81.7; // width del dragón
        const dragonAlto = 67.8; // height del dragón
        
        // El dragón tiene left: 7% y top 50%
        // Entonces su posición X efectiva es: (640 * 0.20) - (dragonAncho / 2)
        const dragonX = (640 * 0.07) - (dragonAncho / 2);
        
        // El dragón tiene top: 50% en CSS, más el translateY
        // translateY negativo = mover HACIA ARRIBA, translateY positivo = mover HACIA ABAJO
        // Posición real del borde inferior = 50% - translateY (porque el eje Y invertido en CSS)
        // Wait, translateY(value) mueve hacia abajo si positivo y hacia arriba si negativo
        // Con bottom, la referencia es desde abajo
        // Si top: 50% y translateY: -200, visualmente sube 200px
        // Entonces bottom real = 47 + 200 = 247
        const dragonBottom = 230 - dragonY; // bottom CSS - translateY (porque translateY negativo sube)
        const dragonTop = dragonBottom + dragonAlto;
        const dragonLeft = dragonX;
        const dragonRight = dragonX + dragonAncho;

        // Verificar colisión con cada enemigo
        for (let enemigo of this.enemigos) {
            const enemigoPos = enemigo.modelo.obtenerPosicion();
            const enemigoAncho = enemigo.modelo.ancho; // 75px
            const enemigoAlto = enemigo.modelo.alto; // 75px
            
            // Reducir el hitbox del enemigo para hacer el juego más fácil
            // En lugar de usar el tamaño completo (75px), usamos un porcentaje menor
            const reduccionHitbox = 0.6; // 60% del tamaño original
            const enemigoAnchoReducido = enemigoAncho * reduccionHitbox;
            const enemigoAltoReducido = enemigoAlto * reduccionHitbox;
            
            // SIMPLE: sin scales, bottom y left indican directamente los bordes
            // Calcular el centro para aplicar la reducción del hitbox
            const enemigoCentroX = enemigoPos.x + (enemigoAncho / 2);
            const enemigoCentroY = enemigoPos.y + (enemigoAlto / 2);
            
            // Calcular límites del enemigo basándose en el centro y tamaño reducido
            const enemigoLeft = enemigoCentroX - (enemigoAnchoReducido / 2);
            const enemigoRight = enemigoCentroX + (enemigoAnchoReducido / 2);
            const enemigoBottom = enemigoCentroY - (enemigoAltoReducido / 2);
            const enemigoTop = enemigoCentroY + (enemigoAltoReducido / 2);
            
            // Margen adicional de colisión (para hacer el juego aún más justo)
            const margen = 3;
            
            // Detección de colisión AABB (Axis-Aligned Bounding Box) con margen
            const colisionXLeft = dragonLeft + margen < enemigoRight - margen
            const colisionXRight = dragonRight - margen > enemigoLeft + margen
            const colisionYTop = dragonTop - margen > enemigoBottom + margen
            const colisionYBot = dragonBottom + margen < enemigoTop - margen
            const colisionX = colisionXLeft && colisionXRight;
            const colisionY = colisionYTop && colisionYBot;
            
            if (colisionX && colisionY) {
                console.log(enemigoPos)
                return true; // Hay colisión
            }
        }
        
        return false; // No hay colisión
    }
}

