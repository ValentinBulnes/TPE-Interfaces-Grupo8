// Controlador del juego - Coordina el modelo y la vista, maneja eventos y el game loop
import { EnemigoModelo } from "./modelo/EnemigoModelo.js";
import { EnemigoVista } from "./vista/EnemigoVista.js";
import { ColeccionableModelo } from "./modelo/ColeccionableModelo.js";
import { ColeccionableVista } from "./vista/ColeccionableVista.js";
import { ObstaculoModelo } from "./modelo/ObstaculoModelo.js";
import { ObstaculoVista } from "./vista/ObstaculoVista.js";

export class FlappyController {
    deltaEspacioTubos = 30;
    deltaIntervaloObstaculos = 100;
    espacioTubosInicial = 350;

    constructor(modelo, vista) {
        this.modelo = modelo;
        this.vista = vista;
        this.juegoIniciado = false;
        this.juegoPausado = false;
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

        // Sistema de dificultad progresiva para el gap de los tubos
        this.espacioTubos = this.espacioTubosInicial; // Espacio inicial entre tubos (más fácil)
        this.espacioTubosMin = 100; // Espacio mínimo entre tubos (más difícil)

        // Sistema de tiempo límite
        this.tiempoInicio = 0;
        this.tiempoLimite = 60000; // 60 segundos en milisegundos
        this.tiempoRestante = 60000;

        // Referencias a elementos del DOM (para control de flujo)
        this.contenedorJuego = document.getElementById("juego-flappy");
        this.contenedorParallax = document.querySelector(".parallax-container");
        this.mensajeGameOver = document.getElementById("mensaje-gameover-flappy");
        this.mensajeVictoria = document.getElementById("mensaje-victoria-flappy");

        // Configurar eventos
        this.configurarEventos();
    }

    // Configura todos los event listeners
    configurarEventos() {
        if (this.contenedorJuego) {
            // Evento de click en el juego para saltar
            this.contenedorJuego.addEventListener("click", () =>
                this.manejarSalto()
            );
            // Evento de presionar tecla W en el juego para saltar
            document.body.addEventListener("keydown", (e) => {
                if (e.key == "w" || e.key == "W") this.manejarSalto();
                if (e.key == "p" || e.key == "P") this.alternarPausa();
                if (e.key == "r" || e.key == "R") this.iniciarJuego();
            });
        }
    }

    // Inicia el juego
    iniciarJuego() {
        this.intervaloObstaculos = 2500;
        this.espacioTubos = this.espacioTubosInicial; // Reiniciar espacio de tubos

        // Mostrar el juego
        this.mostrarJuego();

        // Ocultar mensaje de game over si estaba visible
        this.ocultarGameOver();

        // Ocultar mensaje de victoria si estaba visible
        this.ocultarVictoria();

        // Calcular límites del dragón basándose en el contenedor
        this.modelo.calcularLimites();

        // Reiniciar el modelo
        this.modelo.reiniciar();

        // Limpiar enemigos existentes
        this.limpiarEnemigos();

        // Limpiar efectos visuales del dragón
        this.vista.limpiarEfectos();

        // Reiniciar contadores
        this.actualizarContadorPuntos();
        this.actualizarContadorVidas();
        
        // Reiniciar tiempo
        this.tiempoInicio = performance.now();
        this.tiempoRestante = this.tiempoLimite;
        this.actualizarContadorTiempo();

        // Marcar el juego como iniciado
        this.juegoIniciado = true;
        this.tiempoUltimoEnemigo = performance.now();
        this.tiempoUltimoColeccionable = performance.now();
        this.tiempoUltimoObstaculo = performance.now();

        // Iniciar el game loop
        this.gameLoop(performance.now());
    }

    limpiarEnemigos() {
        this.enemigos.forEach((enemigo) => {
            enemigo.modelo.marcarParaEliminar();
            enemigo.vista.eliminar();
        });
        this.enemigos = [];
        this.coleccionables.forEach((coleccionable) => {
            coleccionable.modelo.marcarParaEliminar();
            coleccionable.vista.eliminar();
        });
        this.coleccionables = [];
        this.obstaculos.forEach((obstaculo) => {
            obstaculo.modelo.marcarParaEliminar();
            obstaculo.vista.eliminar();
        });
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

        // Verificar si está pausado
        if (this.juegoPausado) return;

        // Actualizar tiempo restante
        const tiempoTranscurrido = tiempoActual - this.tiempoInicio;
        this.tiempoRestante = Math.max(0, this.tiempoLimite - tiempoTranscurrido);
        this.actualizarContadorTiempo();

        // Verificar si se ganó el juego (tiempo agotado sin perder)
        if (this.tiempoRestante <= 0) {
            this.ganarJuego();
            return;
        }

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

    alternarPausa() {
        if (!this.juegoIniciado) return;

        this.juegoPausado = !this.juegoPausado;

        if (this.juegoPausado) {
            this.vista.mostrarPausa?.(); // Si tienes método en la vista
        } else {
            this.vista.ocultarPausa?.(); // Si tienes método en la vista
            // Reiniciar el gameLoop
            requestAnimationFrame((t) => this.gameLoop(t));
        }
    }

    coleccionarColeccionables() {
        const coleccionablesColisionados = this.obtenerColisionados(
            this.coleccionables
        );

        if (coleccionablesColisionados.length > 0) {
            // Informar al modelo para actualizar contadores
            this.modelo.coleccionar(coleccionablesColisionados);
            
            // Aplicar efecto visual de power-up al dragón
            this.vista.aplicarEfectoPowerUp();

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
        this.mostrarGameOver();

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
            
            // Aumentar dificultad: reducir intervalo y espacio entre tubos
            if (this.intervaloObstaculos > this.intervaloObstaculosMin)
                this.intervaloObstaculos -= this.deltaIntervaloObstaculos;
            if (this.espacioTubos > this.espacioTubosMin)
                this.espacioTubos -= this.deltaEspacioTubos; 
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
        const modelo = new ObstaculoModelo(this.espacioTubos);
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

    // Actualiza el contador de tiempo en la interfaz
    actualizarContadorTiempo() {
        const contadorTiempo = document.getElementById("contador-tiempo");
        if (contadorTiempo) {
            const segundos = Math.ceil(this.tiempoRestante / 1000);
            const minutos = Math.floor(segundos / 60);
            const segs = segundos % 60;
            const textoTiempo = `${minutos}:${segs.toString().padStart(2, '0')}`;
            contadorTiempo.textContent = textoTiempo;
        }
    }

    // Termina el juego con victoria
    ganarJuego() {
        this.juegoIniciado = false;
        this.mostrarVictoria();

        // Actualizar puntos finales en el mensaje de victoria
        const puntosFinales = document.getElementById("puntos-finales-victoria");
        if (puntosFinales) {
            puntosFinales.textContent = this.modelo.obtenerPuntos();
        }

        // Configurar botón de jugar otra vez
        const botonJugarOtraVez = document.getElementById(
            "btn-jugar-otra-vez-flappy"
        );
        if (botonJugarOtraVez) {
            botonJugarOtraVez.onclick = () => this.iniciarJuego();
        }
    }

    // ========== MÉTODOS DE CONTROL DE FLUJO DE UI ==========

    // Muestra el contenedor del juego
    mostrarJuego() {
        if (this.contenedorJuego) {
            this.contenedorJuego.classList.remove("oculto");
        }
        // Reactivar animaciones del parallax
        if (this.contenedorParallax) {
            this.contenedorParallax.classList.remove("game-over");
        }
    }

    // Muestra el mensaje de game over
    mostrarGameOver() {
        // Detener todas las animaciones
        if (this.contenedorParallax) {
            this.contenedorParallax.classList.add("game-over");
        }

        // Aplicar efecto visual de crash al dragón
        this.vista.aplicarEfectoCrash();

        // Mostrar mensaje
        if (this.mensajeGameOver) {
            this.mensajeGameOver.classList.remove("oculto");
            // Pequeño delay para que la animación se vea
            setTimeout(() => {
                this.mensajeGameOver.classList.add("aparecer");
            }, 100);
        }
    }

    // Oculta el mensaje de game over
    ocultarGameOver() {
        if (this.mensajeGameOver) {
            this.mensajeGameOver.classList.remove("aparecer");
            setTimeout(() => {
                this.mensajeGameOver.classList.add("oculto");
            }, 600);
        }
    }

    // Muestra el mensaje de victoria
    mostrarVictoria() {
        // Detener todas las animaciones
        if (this.contenedorParallax) {
            this.contenedorParallax.classList.add("game-over");
        }

        // Mostrar mensaje
        if (this.mensajeVictoria) {
            this.mensajeVictoria.classList.remove("oculto");
            // Pequeño delay para que la animación se vea
            setTimeout(() => {
                this.mensajeVictoria.classList.add("aparecer");
            }, 100);
        }
    }

    // Oculta el mensaje de victoria
    ocultarVictoria() {
        if (this.mensajeVictoria) {
            this.mensajeVictoria.classList.remove("aparecer");
            setTimeout(() => {
                this.mensajeVictoria.classList.add("oculto");
            }, 600);
        }
    }
}
