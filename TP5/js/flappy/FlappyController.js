// Controlador del juego - Coordina el modelo y la vista, maneja eventos y el game loop
import { EnemigoModelo } from "./modelo/EnemigoModelo.js";
import { EnemigoVista } from "./vista/EnemigoVista.js";
import { ColeccionableModelo } from "./modelo/ColeccionableModelo.js";
import { ColeccionableVista } from "./vista/ColeccionableVista.js";
import { ObstaculoModelo } from "./modelo/ObstaculoModelo.js";
import { ObstaculoVista } from "./vista/ObstaculoVista.js";

export class FlappyController {
    constructor(modelo, vista) {
        this.modelo = modelo;
        this.vista = vista;
        this.juegoIniciado = false;
        this.enemigos = []; // Array to store active enemies { modelo, vista }
        this.coleccionables = []; // Array to store active collectibles (coins and hearts)
        this.obstaculos = []; // Array to store active obstacles (pipes)
        this.tiempoUltimoEnemigo = 0;
        this.tiempoUltimoColeccionable = 0;
        this.tiempoUltimoObstaculo = 0;
        this.intervaloEnemigos = 2000; // Spawn enemy every 2 seconds
        this.intervaloColeccionables = 3000; // Spawn collectible every 3 seconds
        this.intervaloObstaculos = 2500; // Spawn obstacle every 2.5 seconds
        this.intervaloObstaculosMin = 1000;

        // Configurar eventos
        this.configurarEventos();
    }

    // Configura todos los event listeners
    configurarEventos() {
        const contenedorJuego = this.vista.obtenerContenedorJuego();
        if (contenedorJuego) {
            // Evento de click en el juego para saltar
            contenedorJuego.addEventListener("click", () =>
                this.manejarSalto()
            );
            // Evento de presionar tecla W en el juego para saltar
            document.body.addEventListener("keydown", (e) => {
                if (e.key == "w") this.manejarSalto();
            });
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

        // Reiniciar contadores
        this.actualizarContadorPuntos();
        this.actualizarContadorVidas();

        // Marcar el juego como iniciado
        this.juegoIniciado = true;
        this.tiempoUltimoEnemigo = performance.now();
        this.tiempoUltimoColeccionable = performance.now();
        this.tiempoUltimoObstaculo = performance.now();

        // Iniciar el game loop
        this.gameLoop(performance.now());
    }

    limpiarEnemigos() {
        this.enemigos.forEach((enemigo) => enemigo.vista.eliminar());
        this.enemigos = [];
        this.coleccionables.forEach((coleccionable) =>
            coleccionable.vista.eliminar()
        );
        this.coleccionables = [];
        this.obstaculos.forEach((obstaculo) => obstaculo.vista.eliminar());
        this.obstaculos = [];
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
        const esInvulnerable = this.modelo.estaInvulnerable();
        const limiteInferior = this.modelo.limiteInferior;
        this.vista.actualizarPosicion(
            posicion,
            velocidad,
            limiteInferior,
            esInvulnerable
        );
        // Verificar colisiones con enemigos
        const hayColisionEnemiga =
            this.obtenerColisionados(this.enemigos).length > 0;

        // Verificar colisiones con obstáculos
        const hayColisionObstaculo = this.verificarColisionObstaculos();

        // Verificar si el dragón pasó por algún tubo
        this.verificarTubosPasados();

        this.coleccionarColeccionables();

        // Verificar si hay game over DESPUÉS de actualizar la vista
        const gameOver = this.modelo.esGameOver(
            hayColisionEnemiga || hayColisionObstaculo
        );

        // Actualizar contador de vidas si hubo colisión
        if (hayColisionEnemiga || hayColisionObstaculo) {
            this.actualizarContadorVidas();
        }

        if (gameOver) {
            this.terminarJuego();
            return;
        }

        // Gestionar enemigos, coleccionables y obstáculos
        this.gestionarEnemigos(tiempoActual);
        this.gestionarColeccionables(tiempoActual);
        this.gestionarObstaculos(tiempoActual);

        // Continuar el loop
        requestAnimationFrame((t) => this.gameLoop(t));
    }

    coleccionarColeccionables() {
        const coleccionablesColisionados = this.obtenerColisionados(
            this.coleccionables
        );

        if (coleccionablesColisionados.length > 0) {
            // Informar al modelo para actualizar contadores
            this.modelo.coleccionar(coleccionablesColisionados);

            // Actualizar contadores en la interfaz
            this.actualizarContadorVidas();
            this.actualizarContadorPuntos();

            // Eliminar visualmente y marcar para eliminación en el modelo
            for (let col of coleccionablesColisionados) {
                if (col.vista) col.vista.eliminar();
                if (
                    col.modelo &&
                    typeof col.modelo.marcarParaEliminar === "function"
                ) {
                    col.modelo.marcarParaEliminar();
                }
                const idx = this.coleccionables.indexOf(col);
                if (idx !== -1) this.coleccionables.splice(idx, 1);
            }
        }
    }

    // Termina el juego y muestra el mensaje de game over
    terminarJuego() {
        this.juegoIniciado = false;
        this.vista.mostrarGameOver();

        // Configurar botón de reintentar
        const botonReintentar = document.getElementById(
            "btn-reintentar-flappy"
        );
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
        if (
            tiempoActual - this.tiempoUltimoColeccionable >
            this.intervaloColeccionables
        ) {
            // Alternar entre moneda y corazon aleatoriamente
            const tipo = Math.random() < 0.7 ? "moneda" : "corazon"; // 70% monedas, 30% corazones
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
    obtenerColisionados(conjuntoNPC) {
        const res = [];
        if (conjuntoNPC.length === 0) {
            return res; // No hay enemigos
        }

        // Obtener posición y dimensiones del dragón
        const dragonHitbox = this.modelo.getHitbox();

        // Verificar colisión con cada enemigo
        for (let npc of conjuntoNPC) {
            const npcHitbox = npc.modelo.getHitbox();

            // Strict AABB collision detection (no margins)
            const colisionX =
                dragonHitbox.left < npcHitbox.right &&
                dragonHitbox.right > npcHitbox.left;
            const colisionY =
                dragonHitbox.top < npcHitbox.bottom &&
                dragonHitbox.bottom > npcHitbox.top;

            if (colisionX && colisionY) {
                res.push(npc);
            }
        }

        return res;
    }

    // Gestiona los obstáculos (tubos)
    gestionarObstaculos(tiempoActual) {
        // Generar nuevos obstáculos
        if (
            tiempoActual - this.tiempoUltimoObstaculo >
            this.intervaloObstaculos
        ) {
            this.crearObstaculo();
            this.tiempoUltimoObstaculo = tiempoActual;
            if (this.intervaloObstaculos > this.intervaloObstaculosMin)
                this.intervaloObstaculos -= 50;
        }

        // Actualizar y eliminar obstáculos
        for (let i = this.obstaculos.length - 1; i >= 0; i--) {
            const obstaculo = this.obstaculos[i];
            obstaculo.modelo.actualizar();

            if (obstaculo.modelo.marcadoParaEliminar) {
                obstaculo.vista.eliminar();
                this.obstaculos.splice(i, 1);
            } else {
                const posiciones = obstaculo.modelo.obtenerPosiciones();
                obstaculo.vista.actualizarPosicion(posiciones);
            }
        }
    }

    // Crea un nuevo obstáculo
    crearObstaculo() {
        const modelo = new ObstaculoModelo();
        const vista = new ObstaculoVista();
        this.obstaculos.push({ modelo, vista });

        // Initial position update
        const posiciones = modelo.obtenerPosiciones();
        vista.actualizarPosicion(posiciones);
    }

    // Verifica colisiones con obstáculos (ambos tubos)
    verificarColisionObstaculos() {
        if (this.obstaculos.length === 0) {
            return false;
        }

        const dragonHitbox = this.modelo.getHitbox();

        for (let obstaculo of this.obstaculos) {
            const hitboxes = obstaculo.modelo.getHitboxes();

            // Verificar colisión con tubo superior
            const colisionSuperiorX =
                dragonHitbox.left < hitboxes.superior.right &&
                dragonHitbox.right > hitboxes.superior.left;
            const colisionSuperiorY =
                dragonHitbox.top < hitboxes.superior.bottom &&
                dragonHitbox.bottom > hitboxes.superior.top;

            if (colisionSuperiorX && colisionSuperiorY) {
                return true;
            }

            // Verificar colisión con tubo inferior
            const colisionInferiorX =
                dragonHitbox.left < hitboxes.inferior.right &&
                dragonHitbox.right > hitboxes.inferior.left;
            const colisionInferiorY =
                dragonHitbox.top < hitboxes.inferior.bottom &&
                dragonHitbox.bottom > hitboxes.inferior.top;

            if (colisionInferiorX && colisionInferiorY) {
                return true;
            }
        }

        return false;
    }

    // Verifica si el dragón pasó completamente por algún tubo
    verificarTubosPasados() {
        const dragonHitbox = this.modelo.getHitbox();

        for (let obstaculo of this.obstaculos) {
            // Si ya fue pasado, no volver a contar
            if (obstaculo.modelo.fuePasado()) {
                continue;
            }

            const hitboxes = obstaculo.modelo.getHitboxes();

            // El dragón pasa el tubo cuando su lado izquierdo supera el lado derecho del tubo
            if (dragonHitbox.left > hitboxes.superior.right) {
                obstaculo.modelo.marcarComoPasado();
                this.modelo.incrementarPuntos();
                this.actualizarContadorPuntos();
            }
        }
    }

    // Actualiza el contador de puntos en la interfaz
    actualizarContadorPuntos() {
        const contadorPuntos = document.getElementById("contador-puntos");
        if (contadorPuntos) {
            contadorPuntos.textContent = this.modelo.obtenerPuntos();
        }
    }

    // Actualiza el contador de vidas en la interfaz
    actualizarContadorVidas() {
        const contadorVidas = document.getElementById("contador-vidas");
        if (contadorVidas) {
            const vidas = this.modelo.coleccionables.corazon || 0;
            contadorVidas.textContent = vidas;
        }
    }
}
