var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var imageHeight = 0;
var imageWidth = 0;
var imageData;
var imageDataOriginal; // Guardar la imagen original sin filtros

// Array con las 8 imagenes
var imagenes = ["img/blocka/1x1/mario1-1x1.jpeg","img/blocka/1x1/mario2-1x1.jpg","img/blocka/1x1/mario3-1x1.jpg","img/blocka/1x1/mario4-1x1.jpg","img/blocka/1x1/mario5-1x1.jpg","img/blocka/1x1/mario6-1x1.jpg","img/blocka/1x1/mario7-1x1.jpg","img/blocka/1x1/mario8-1x1.jpg",];

// Array para guardar la rotación de cada cuadrante (0, 1, 2, 3 = 0°, 90°, 180°, 270°)
var filas = 2;
const columnas = 2;
var rotacionCuadrantes = [[0, 0], [0, 0]];

// Array para marcar cuadrantes fijos (que no se pueden rotar por usar la ayuda)
var cuadrantesFijos = [];

// Variable para controlar si ya se usó la ayuda en el nivel actual
var ayudaUsada = false;

// Variables del temporizador
var tiempoInicio;
var tiempoTranscurrido = 0;
var tiempoTranscurridoTotal = 0;
var intervaloTemporizador;
var juegoIniciado = false;

// Variables de niveles
var nivelActual = 1;
var maxNiveles = 6;

// Variable para tiempo total acumulado
var tiempoTotalAcumulado = 0;

// Variables para el nivel con límite de tiempo
var limiteTiempo = 10000; // 10 segundos en milisegundos
var tiempoRestante = 0;

// Array de imágenes mezcladas para el juego actual (sin repetir)
var imagenesMezcladas = [];

// Función para mostrar el menú principal
function mostrarMenuPrincipal() {
    var menuPrincipal = document.getElementById("menu-principal-blocka");
    var btnComenzarBlocka = document.getElementById("btn-comenzar-blocka");

    // Ocultar preview y botón, mostrar menú
    btnComenzarBlocka?.classList.add("oculto");
    menuPrincipal?.classList.remove("oculto");
}

// Función para iniciar el juego desde el menú
function iniciarJuego() {
    var juegoBlocka = document.getElementById("juego-blocka");
    var menuPrincipal = document.getElementById("menu-principal-blocka");

    // Ocultar menú, mostrar juego
    if (juegoBlocka && menuPrincipal) {
        menuPrincipal.classList.add("oculto");
        juegoBlocka.classList.remove("oculto");
    }

    // Resetear nivel y tiempo total al iniciar
    nivelActual = 1;
    tiempoTotalAcumulado = 0;
    
    // Mezclar las imágenes para este juego (sin repetir)
    imagenesMezcladas = imagenes.slice();  //copia del array de imágenes
    imagenesMezcladas.sort(function() {
        return Math.random() - 0.5;
    });
    
    cargarNivel(nivelActual);
}

// Función para cargar un nivel específico
function cargarNivel(nivel) {
    // Actualizar indicador de nivel
    var nivelIndicador = document.getElementById("nivel-indicador");
    if (nivelIndicador) {
        nivelIndicador.textContent = "Nivel " + nivel;
    }

    // Resetear el array de rotaciones
    rotacionCuadrantes = Array(filas)
        .fill(null)
        .map(() => Array(columnas).fill(0));

    // Resetear variables del juego
    tiempoTranscurrido = 0;
    juegoIniciado = false;
    
    // Resetear cuadrantes fijos y ayuda
    cuadrantesFijos = [];
    ayudaUsada = false;
    
    // Configurar el botón de ayuda según el nivel
    var btnAyuda = document.getElementById("btn-ayuda");
    if (btnAyuda) {
        if (nivel === 1 || nivel === 2) {
            // Deshabilitar en niveles 1 y 2
            btnAyuda.disabled = true;
        } else {
            // Habilitar en niveles 3+
            btnAyuda.disabled = false;

        }
    }

    // Seleccionar imagen del array mezclado según el nivel (sin repetir)
    var imagenSeleccionada = imagenesMezcladas[nivel - 1];

    // Cargar la imagen y iniciar el temporizador
    var Imagen = new Image();
    Imagen.src = imagenSeleccionada;
    Imagen.onload = function () {
        cargarImagenEnCanvas(this, nivel);
        iniciarTemporizador();
    };
}

// Función para ir al siguiente nivel
function siguienteNivel() {
    var mensajeVictoria = document.getElementById("mensaje-victoria");

    // Ocultar mensaje de victoria
    if (mensajeVictoria) {
        mensajeVictoria.classList.add("oculto");
        mensajeVictoria.classList.remove("aparecer");
    }

    // Incrementar nivel
    nivelActual++;

    // Cargar el siguiente nivel
    cargarNivel(nivelActual);
}

// Función para volver al menú principal desde el juego
function volverAlMenu() {
    var juegoBlocka = document.getElementById("juego-blocka");
    var menuPrincipal = document.getElementById("menu-principal-blocka");
    var mensajeVictoria = document.getElementById("mensaje-victoria");
    var mensajeGameOver = document.getElementById("mensaje-gameover");

    // Detener el temporizador si está corriendo
    detenerTemporizador();

    // Ocultar mensaje de victoria
    if (mensajeVictoria) {
        mensajeVictoria.classList.add("oculto");
        mensajeVictoria.classList.remove("aparecer");
    }

    // Ocultar mensaje de game over
    if (mensajeGameOver) {
        mensajeGameOver.classList.add("oculto");
        mensajeGameOver.classList.remove("aparecer");
    }

    // Ocultar juego y mostrar menú principal
    if (juegoBlocka && menuPrincipal) {
        juegoBlocka.classList.add("oculto");
        menuPrincipal.classList.remove("oculto");
    }

    // Limpiar el canvas
    if (canvas && ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    // Resetear variables
    juegoIniciado = false;
    tiempoTranscurrido = 0;
    nivelActual = 1;
    tiempoTotalAcumulado = 0;
}

// Función para cargar imagen en el canvas
function cargarImagenEnCanvas(imagen, nivel) {
    imageWidth = imagen.width;
    imageHeight = imagen.height;

    // Ajustar el tamaño del canvas al tamaño de la imagen
    canvas.width = imageWidth;
    canvas.height = imageHeight;

    ctx.drawImage(imagen, 0, 0);

    // Guardar la imagen original sin filtros
    imageDataOriginal = ctx.getImageData(0, 0, imageWidth, imageHeight);

    // Crear una copia para aplicar el filtro
    imageData = ctx.getImageData(0, 0, imageWidth, imageHeight);

    // Aplicar filtro según el nivel
    aplicarFiltroPorNivel(imageData, nivel);
    ctx.putImageData(imageData, 0, 0);

    // Dibujar bordes en cada cuadrante
    dibujarBordesCuadrantes();
    rotarCuadrantesAleatorio();
    juegoIniciado = true;
}

// Función para dibujar los bordes de todos los cuadrantes
function dibujarBordesCuadrantes() {
    var anchoCuadrante = imageWidth / columnas;
    var altoCuadrante = imageHeight / filas;
    ctx.strokeStyle = "red";
    ctx.lineWidth = 2;

    for (var x = 0; x < 2; x++) {
        for (var y = 0; y < filas; y++) {
            var posX = x * anchoCuadrante;
            var posY = y * altoCuadrante;
            ctx.strokeRect(posX, posY, anchoCuadrante, altoCuadrante);
        }
    }
}

// Función para aplicar filtro según el nivel
function aplicarFiltroPorNivel(imageData, nivel) {
    const filtros = {
        1: () => {}, // Nivel 1: Sin filtro
        2: () => filtroBrillo(imageData), // Nivel 2: Filtro de brillo
        3: () => filtroEscalaDeGrises(imageData), // Nivel 3: Escala de grises
        4: () => filtroNegativo(imageData), // Nivel 4: Filtro negativo
        5: () => aplicarFiltrosPorCuadrante(imageData), // Nivel 5: Filtros mixtos por cuadrante
        6: () => aplicarFiltrosPorCuadrante(imageData) // Nivel 6: Filtros mixtos por cuadrante + límite de tiempo
    };
    
    (filtros[nivel] || filtros[1])(); // Si no existe, sin filtro
}

// Función para aplicar diferentes filtros a cada cuadrante
function aplicarFiltrosPorCuadrante(imageData) {
    const anchoCuadrante = imageWidth / columnas;
    const altoCuadrante = imageHeight / filas;

    // Cuadrante superior izquierdo (0,0): Sin filtro
    // No se aplica nada

    // Cuadrante superior derecho (1,0): Filtro de brillo
    aplicarFiltroCuadrante(
        imageData,
        1,
        0,
        anchoCuadrante,
        altoCuadrante,
        filtroBrillo
    );

    // Cuadrante inferior izquierdo (0,1): Escala de grises
    aplicarFiltroCuadrante(
        imageData,
        0,
        1,
        anchoCuadrante,
        altoCuadrante,
        filtroEscalaDeGrises
    );

    // Cuadrante inferior derecho (1,1): Filtro negativo
    aplicarFiltroCuadrante(
        imageData,
        1,
        1,
        anchoCuadrante,
        altoCuadrante,
        filtroNegativo
    );
}

// Función auxiliar para aplicar filtro a un cuadrante específico
function aplicarFiltroCuadrante(
    imageData,
    cuadranteX,
    cuadranteY,
    anchoCuadrante,
    altoCuadrante,
    filtroFn
) {
    const startX = cuadranteX * anchoCuadrante;
    const startY = cuadranteY * altoCuadrante;

    // Extraer el cuadrante
    const cuadranteData = ctx.getImageData(
        startX,
        startY,
        anchoCuadrante,
        altoCuadrante
    );

    // Aplicar el filtro al cuadrante
    filtroFn(cuadranteData);

    // Colocar el cuadrante filtrado de vuelta en la imagen completa
    for (var y = 0; y < altoCuadrante; y++) {
        for (var x = 0; x < anchoCuadrante; x++) {
            const pixel = getPixel(cuadranteData, x, y);
            setPixel(
                imageData,
                startX + x,
                startY + y,
                pixel.r,
                pixel.g,
                pixel.b,
                pixel.a
            );
        }
    }
}

function setPixel(imageData, x, y, r, g, b, a) {
    index = (x + y * imageData.width) * 4;
    imageData.data[index + 0] = r;
    imageData.data[index + 1] = g;
    imageData.data[index + 2] = b;
    imageData.data[index + 3] = a;
}

function getPixel(imageData, x, y) {
    index = (x + y * imageData.width) * 4;
    return {
        r: imageData.data[index + 0],
        g: imageData.data[index + 1],
        b: imageData.data[index + 2],
        a: imageData.data[index + 3],
    };
}

function filtroEscalaDeGrises(imageData) {
    for (var x = 0; x < imageData.width; x++) {
        for (var y = 0; y < imageData.height; y++) {
            var pixel = getPixel(imageData, x, y);
            // Fórmula de luminosidad: gray = 0.299R + 0.587G + 0.114B
            var gris = 0.299 * pixel.r + 0.587 * pixel.g + 0.114 * pixel.b;
            setPixel(imageData, x, y, gris, gris, gris, pixel.a);
        }
    }
    return imageData;
}

function filtroBrillo(imageData, brillo = 1.3) {
    for (var x = 0; x < imageData.width; x++) {
        for (var y = 0; y < imageData.height; y++) {
            var pixel = getPixel(imageData, x, y);

            // Aumentar cada canal RGB por el factor
            var nuevoR = Math.min(255, pixel.r * brillo);
            var nuevoG = Math.min(255, pixel.g * brillo);
            var nuevoB = Math.min(255, pixel.b * brillo);

            setPixel(imageData, x, y, nuevoR, nuevoG, nuevoB, pixel.a);
        }
    }
    return imageData;
}

function filtroNegativo(imageData) {
    for (var x = 0; x < imageData.width; x++) {
        for (var y = 0; y < imageData.height; y++) {
            var pixel = getPixel(imageData, x, y);

            var nuevoR = 255 - pixel.r;
            var nuevoG = 255 - pixel.g;
            var nuevoB = 255 - pixel.b;

            setPixel(imageData, x, y, nuevoR, nuevoG, nuevoB, pixel.a);
        }
    }
    return imageData;
}

// Función para rotar todos los cuadrantes aleatoriamente
function rotarCuadrantesAleatorio() {
    // Rotar cada uno de los 4 cuadrantes
    for (var x = 0; x < 2; x++) {
        for (var y = 0; y < filas; y++) {
            // Generar número aleatorio de rotaciones (1, 2, o 3 veces 90°, nunca 0)
            var numRotaciones = Math.floor(Math.random() * 3) + 1;

            // Aplicar las rotaciones visualmente (rotarCuadrante actualiza el array automáticamente)
            for (var i = 0; i < numRotaciones; i++) {
                rotarCuadrante(x, y, 1); // 1 = rotar a la derecha
            }
        }
    }
}

// Función para rotar un cuadrante específico
function rotarCuadrante(cuadranteX, cuadranteY, direccion) {
    const anchoCuadrante = imageWidth / columnas;
    const altoCuadrante = imageHeight / filas;

    //Calcular la posición inicial del cuadrante en el canvas
    var posX = cuadranteX * anchoCuadrante;
    var posY = cuadranteY * altoCuadrante;

    var dataCuadrante = ctx.getImageData(
        posX,
        posY,
        anchoCuadrante,
        altoCuadrante
    );

    //Crear un canvas temporal para dibujar el cuadrante rotado
    var canvasTemp = document.createElement("canvas");
    canvasTemp.width = anchoCuadrante;
    canvasTemp.height = altoCuadrante;
    var ctxTemp = canvasTemp.getContext("2d");

    // Dibujar los píxeles extraídos en el canvas temporal
    ctxTemp.putImageData(dataCuadrante, 0, 0);

    //Limpiar el área del cuadrante original en el canvas principal
    ctx.clearRect(posX, posY, anchoCuadrante, altoCuadrante);

    ctx.save(); //Guardar el estado del contexto

    //Mover el punto de origen al centro del cuadrante
    ctx.translate(posX + anchoCuadrante / 2, posY + altoCuadrante / 2);

    //Rotar el contexto (direccion: 1 = derecha, -1 = izquierda)
    var angulo = (direccion * 90 * Math.PI) / 180;
    ctx.rotate(angulo);

    //Dibujar el canvas temporal rotado (centrado en el origen)
    ctx.drawImage(canvasTemp, -anchoCuadrante / 2, -altoCuadrante / 2);

    //Restaurar el estado del contexto
    ctx.restore();

    //Actualizar el estado de rotación del cuadrante
    rotacionCuadrantes[cuadranteY][cuadranteX] += direccion;
    // Mantener el valor entre 0 y 3 (módulo 4)
    rotacionCuadrantes[cuadranteY][cuadranteX] =
        (rotacionCuadrantes[cuadranteY][cuadranteX] + 4) % 4;
}

// Función para verificar si todos los cuadrantes están correctos
function verificarJuegoCompleto() {
    for (var y = 0; y < filas; y++) {
        for (var x = 0; x < 2; x++) {
            // Si algún cuadrante no está en rotación 0 (0°), no está completo
            if (rotacionCuadrantes[y][x] !== 0) {
                return false;
            }
        }
    }
    return true; // Todos los cuadrantes están en 0°
}

// Función para mostrar mensaje de victoria
function mostrarVictoria() {
    juegoIniciado = false;
    
    // Capturar el tiempo transcurrido ANTES de detener el temporizador
    var tiempoNivelCompletado = Date.now() - tiempoInicio;
    
    detenerTemporizador();

    // Mostrar la imagen original en RGB (sin filtros)
    ctx.putImageData(imageDataOriginal, 0, 0);

    var segundosTotales = obtenerSegundos(tiempoNivelCompletado);

    // Acumular el tiempo del nivel actual usando el tiempo capturado
    tiempoTotalAcumulado += tiempoNivelCompletado;

    var mensajeTiempo = document.getElementById("mensaje-tiempo");
    var mensajeVictoria = document.getElementById("mensaje-victoria");
    var tituloVictoria = mensajeVictoria.querySelector("h1");
    var btnSiguienteNivel = document.getElementById("btn-siguiente-nivel");
    var btnJugarNuevo = document.getElementById("btn-jugar-nuevo");

    // Verificar si es el último nivel
    if (nivelActual >= maxNiveles) {
        // Mostrar tiempo total acumulado en el último nivel
        var segundosTotalesAcumulados = obtenerSegundos(tiempoTotalAcumulado);
        tituloVictoria.textContent = "¡JUEGO COMPLETADO!";
        mensajeTiempo.textContent =
            "Completaste el juego en un tiempo total de " +
            segundosTotalesAcumulados +
            " segundos";
        // Ocultar botón de siguiente nivel y mostrar botón jugar de nuevo
        if (btnSiguienteNivel) {
            btnSiguienteNivel.style.display = "none";
        }
        if (btnJugarNuevo) {
            btnJugarNuevo.style.display = "inline-block";
        }
    } else {
        // Mostrar tiempo del nivel actual
        tituloVictoria.textContent = "¡NIVEL COMPLETADO!";
        mensajeTiempo.textContent =
            "Completaste el nivel en " + segundosTotales + " segundos";
        // Mostrar botón de siguiente nivel y ocultar botón jugar de nuevo
        if (btnSiguienteNivel) {
            btnSiguienteNivel.style.display = "inline-block";
        }
        if (btnJugarNuevo) {
            btnJugarNuevo.style.display = "none";
        }
    }

    // Mostrar el mensaje de victoria después de 1 segundo
    setTimeout(() => {
        mensajeVictoria.classList.remove("oculto");
        // Pequeño delay para que la transición se active correctamente
        setTimeout(() => {
            mensajeVictoria.classList.add("aparecer");
        }, 10);
    }, 1000);
}

// Función para mostrar mensaje de game over
function mostrarGameOver() {
    juegoIniciado = false;
    
    // Capturar el tiempo transcurrido ANTES de detener el temporizador
    tiempoTranscurrido = Date.now() - tiempoInicio;
    
    detenerTemporizador();

    var mensajeGameOver = document.getElementById("mensaje-gameover");
    var btnReintentar = document.getElementById("btn-reintentar");

    // Mostrar el mensaje de game over
    setTimeout(() => {
        mensajeGameOver.classList.remove("oculto");
        // Pequeño delay para que la transición se active correctamente
        setTimeout(() => {
            mensajeGameOver.classList.add("aparecer");
        }, 10);
    }, 500);
}

// Función para reintentar el nivel 6
function reintentarNivel() {
    var mensajeGameOver = document.getElementById("mensaje-gameover");
    if (mensajeGameOver) {
        mensajeGameOver.classList.add("oculto");
        mensajeGameOver.classList.remove("aparecer");
    }
    // Acumular el tiempo transcurrido del intento fallido (los 10 segundos completos)
    tiempoTotalAcumulado += limiteTiempo;
    // Agregar penalización de 5 segundos al tiempo total
    tiempoTotalAcumulado += 5000;
    cargarNivel(6);
}

// Función para detectar en qué cuadrante se hizo click
function obtenerCuadrante(event) {
    var x = event.offsetX;
    var y = event.offsetY;

    const anchoCuadrante = imageWidth / columnas;
    const altoCuadrante = imageHeight / filas;

    var cuadranteX = calcularCuadrante(x, anchoCuadrante);
    var cuadranteY = calcularCuadrante(y, altoCuadrante);

    return { x: cuadranteX, y: cuadranteY };
}

function calcularCuadrante(pos, lado) {
    var cuadrante = 1;
    while (pos > lado * cuadrante) {
        cuadrante += 1;
    }
    return cuadrante - 1; // 0 index
}

function clickCuadrante(e, direccion) {
    e.preventDefault();
    if (!juegoIniciado) {
        return;
    }

    var cuadrante = obtenerCuadrante(e);
    
    // Verificar si el cuadrante está fijo
    var esFijo = false;
    for (var i = 0; i < cuadrantesFijos.length; i++) {
        if (cuadrantesFijos[i].x === cuadrante.x && cuadrantesFijos[i].y === cuadrante.y) {
            esFijo = true;
            break;
        }
    }
    
    if (esFijo) {
        return;
    }
    
    rotarCuadrante(cuadrante.x, cuadrante.y, direccion);

    if (verificarJuegoCompleto()) {
        mostrarVictoria();
    }
}

// Función para usar la ayuda
function usarAyuda() {
    if (!juegoIniciado) {
        return;
    }
    
    // Verificar si la ayuda ya fue usada en este nivel
    if (ayudaUsada) {
        return;
    }
    
    // Buscar cuadrantes incorrectos que no estén fijos
    var cuadrantesIncorrectos = [];
    for (var y = 0; y < filas; y++) {
        for (var x = 0; x < 2; x++) {
            var esFijo = false;
            for (var i = 0; i < cuadrantesFijos.length; i++) {
                if (cuadrantesFijos[i].x === x && cuadrantesFijos[i].y === y) {
                    esFijo = true;
                    break;
                }
            }
            
            if (!esFijo && rotacionCuadrantes[y][x] !== 0) {
                cuadrantesIncorrectos.push({ x: x, y: y });
            }
        }
    }
    
    if (cuadrantesIncorrectos.length === 0) {
        return;
    }
    
    // Seleccionar un cuadrante aleatorio
    var indiceAleatorio = Math.floor(Math.random() * cuadrantesIncorrectos.length);
    var cuadrante = cuadrantesIncorrectos[indiceAleatorio];
    
    // Calcular cuántas rotaciones necesita
    var rotacionActual = rotacionCuadrantes[cuadrante.y][cuadrante.x];
    var rotaciones = (4 - rotacionActual) % 4;
    
    // Rotar el cuadrante hasta la posición correcta
    for (var i = 0; i < rotaciones; i++) {
        rotarCuadrante(cuadrante.x, cuadrante.y, 1);
    }
    
    // Marcar como fijo y sumar tiempo
    cuadrantesFijos.push(cuadrante);
    
    // Marcar que la ayuda ya fue usada en este nivel
    ayudaUsada = true;
    
    // Deshabilitar el botón de ayuda
    var btnAyuda = document.getElementById("btn-ayuda");
    if (btnAyuda) {
        btnAyuda.disabled = true;
    }
    
    // Sumar 5 segundos de penalización
    if (nivelActual === 6) {
        // En nivel 6: solo sumar al tiempo total, no afectar el tiempo restante
        tiempoTotalAcumulado += 5000;
        actualizarTiempoTotal();
    } else {
        // En otros niveles: restar al tiempo de inicio para simular que pasaron 5 segundos más
        tiempoInicio -= 5000;
        // Forzar actualización inmediata del display
        actualizarTemporizador();
    }
    
    resaltarCuadrante(cuadrante.x, cuadrante.y);
    
    // Verificar si completó el juego
    if (verificarJuegoCompleto()) {
        mostrarVictoria();
    }
}

// Función para mostrar el cuadrante corregido con borde dorado
function resaltarCuadrante(cuadranteX, cuadranteY) {
    const anchoCuadrante = imageWidth / columnas;
    const altoCuadrante = imageHeight / filas;
    const posX = cuadranteX * anchoCuadrante;
    const posY = cuadranteY * altoCuadrante;
    
    // Guardar el estado actual del canvas (con todas las rotaciones)
    var estadoActual = ctx.getImageData(0, 0, imageWidth, imageHeight);
    
    // Dibujar borde
    ctx.strokeStyle = "#FFD700";
    ctx.lineWidth = 5;
    ctx.strokeRect(posX, posY, anchoCuadrante, altoCuadrante);
    
    // Después de 1 segundo, restaurar
    setTimeout(function() {
        // Solo restaurar si el nivel no se completo
        if (juegoIniciado) {
            // Restaurar el canvas
            ctx.putImageData(estadoActual, 0, 0);
            dibujarBordesCuadrantes();
        }
    }, 1000);
}

// Funciones del temporizador
function iniciarTemporizador() {
    // Asegurarse de que no haya un temporizador previo corriendo
    detenerTemporizador();
    
    tiempoInicio = Date.now();
    tiempoTranscurrido = 0;
    
    if (nivelActual === 6) {
        tiempoRestante = limiteTiempo;
    }
    
    intervaloTemporizador = setInterval(actualizarTemporizador, 100);
}

function actualizarTemporizador() {
    // No actualizar si el juego no está iniciado o el temporizador fue detenido
    if (!juegoIniciado || !intervaloTemporizador) {
        return;
    }
    
    if (nivelActual === 6) {
        // Cuenta regresiva para nivel 6
        tiempoTranscurrido = Date.now() - tiempoInicio;
        tiempoRestante = limiteTiempo - tiempoTranscurrido;
        var temporizador = document.getElementById("temporizador");
        
        if (tiempoRestante <= 0) {
            tiempoRestante = 0;
            temporizador.textContent = `Tiempo restante: 0s`;
            temporizador.style.color = "#ff4444";
            mostrarGameOver();
            return;
        }
        
        var segundosRestantes = Math.ceil(tiempoRestante / 1000);
        temporizador.textContent = `Tiempo restante: ${segundosRestantes}s`;
        temporizador.style.color = "#ff4444";
        actualizarTiempoTotal();
    } else {
        // Temporizador normal para otros niveles
        tiempoTranscurrido = Date.now() - tiempoInicio;
        var segundos = obtenerSegundos(tiempoTranscurrido);
        var temporizador = document.getElementById("temporizador");
        temporizador.textContent = `Tiempo: ${segundos}s`;
        temporizador.style.color = "#fff";
        actualizarTiempoTotal();
    }
}

function actualizarTiempoTotal() {
    const tiempoTranscurridoTotal = tiempoTotalAcumulado + tiempoTranscurrido;
    var segundos = obtenerSegundos(tiempoTranscurridoTotal);
    const tiempoTotalElem = document.querySelector("#game-info >h3");
    tiempoTotalElem.textContent = `Tiempo total: ${segundos}s`;
}

function detenerTemporizador() {
    if (intervaloTemporizador) {
        clearInterval(intervaloTemporizador);
        intervaloTemporizador = null;
    }
}

function obtenerSegundos(milisegundos) {
    return Math.floor(milisegundos / 1000);
}

// ============================================
// EVENT LISTENERS
// ============================================

// Event listener para el botón de play (muestra menú principal)
var btnComenzarBlocka = document.getElementById("btn-comenzar-blocka");
if (btnComenzarBlocka) {
    btnComenzarBlocka.addEventListener("click", mostrarMenuPrincipal);
}

// Event listener para el botón "JUGAR" del menú principal
var btnIniciarJuego = document.getElementById("btn-iniciar-juego");
if (btnIniciarJuego) {
    btnIniciarJuego.addEventListener("click", iniciarJuego);
}

// Event listener para el botón "Siguiente Nivel"
var btnSiguienteNivel = document.getElementById("btn-siguiente-nivel");
if (btnSiguienteNivel) {
    btnSiguienteNivel.addEventListener("click", siguienteNivel);
}

// Event listener para el botón "Menú Principal"
var btnMenuPrincipal = document.getElementById("btn-menu-principal");
if (btnMenuPrincipal) {
    btnMenuPrincipal.addEventListener("click", volverAlMenu);
}

// Event listener para el botón "Jugar de nuevo"
var btnJugarNuevo = document.getElementById("btn-jugar-nuevo");
if (btnJugarNuevo) {
    btnJugarNuevo.addEventListener("click", function() {
        var mensajeVictoria = document.getElementById("mensaje-victoria");
        if (mensajeVictoria) {
            mensajeVictoria.classList.add("oculto");
            mensajeVictoria.classList.remove("aparecer");
        }
        iniciarJuego();
    });
}

// Event listener para el botón "Reintentar"
var btnReintentar = document.getElementById("btn-reintentar");
if (btnReintentar) {
    btnReintentar.addEventListener("click", reintentarNivel);
}

// Event listener para el botón "Menú Principal" desde Game Over
var btnMenuGameOver = document.getElementById("btn-menu-gameover");
if (btnMenuGameOver) {
    btnMenuGameOver.addEventListener("click", function() {
        var mensajeGameOver = document.getElementById("mensaje-gameover");
        if (mensajeGameOver) {
            mensajeGameOver.classList.add("oculto");
            mensajeGameOver.classList.remove("aparecer");
        }
        volverAlMenu();
    });
}

// Event listener para el botón de ayuda
var btnAyuda = document.getElementById("btn-ayuda");
if (btnAyuda) {
    btnAyuda.addEventListener("click", usarAyuda);
}

// Event listener para click izquierdo (rotar cuadrante a la izquierda)
canvas.addEventListener("click", (e) => clickCuadrante(e, -1));

// Event listener para click derecho (rotar cuadrante a la derecha)
canvas.addEventListener("contextmenu", (e) => clickCuadrante(e, 1));
