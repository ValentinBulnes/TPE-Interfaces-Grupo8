// Controlador del juego - Coordina el modelo y la vista, maneja eventos y el game loop
import { EnemigoModelo } from "./modelo/EnemigoModelo.js";
import { EnemigoVista } from "./vista/EnemigoVista.js";
import { ColeccionableModelo } from "./modelo/ColeccionableModelo.js";
import { ColeccionableVista } from "./vista/ColeccionableVista.js";

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
            contenedorJuego.addEventListener("click", () =>
                this.manejarSalto()
            );
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
        this.enemigos.forEach((enemigo) => enemigo.vista.eliminar());
        this.enemigos = [];
        this.coleccionables.forEach((coleccionable) =>
            coleccionable.vista.eliminar()
        );
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
        const hayColisionEnemiga =
            this.obtenerColisionados(this.enemigos).length > 0;
        const hayColision = esColision || hayColisionEnemiga;
        this.vista.actualizarPosicion(
            posicion,
            velocidad,
            hayColision,
            limiteInferior
        );

        this.coleccionarColeccionables();

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

    coleccionarColeccionables() {
        const coleccionablesColisionados = this.obtenerColisionados(
            this.coleccionables
        );

        if (coleccionablesColisionados.length > 0) {
            // Informar al modelo para actualizar contadores
            this.modelo.coleccionar(coleccionablesColisionados);

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
                // debugBox(enemigoHitbox.top,enemigoHitbox.left,enemigoHitbox.ancho,enemigoHitbox.alto,"red");
                // debugBox(dragonHitbox.top,dragonHitbox.left,dragonHitbox.ancho,dragonHitbox.alto,"blue");
                res.push(npc);
            }
        }

        return res;
    }
}

function debugBox(y, x, width, height, color) {
    const container = document.querySelector(".parallax-container");

    const node = document.createElement("div");
    Object.assign(node.style, {
        position: "absolute",
        left: `${x}px`,
        top: `${y}px`,
        width: `${width}px`,
        height: `${height}px`,
        backgroundColor: color,
        opacity: "0.5",
    });
    console.log(node);

    container.appendChild(node);
    return node;
}
