var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var imageHeight = 0;
var imageWidth  = 0;
var imageData;

// Array para guardar la rotación de cada cuadrante (0, 1, 2, 3 = 0°, 90°, 180°, 270°)
var filas = 2
const columnas = 2
var rotacionCuadrantes = Array(filas).fill(Array(columnas).fill(0))

// Array con las rutas de las imágenes disponibles
var imagenes = [
    "img/blocka/1x1/mario1-1x1.jpeg",
    "img/blocka/1x1/mario2-1x1.jpg",
    "img/blocka/1x1/mario3-1x1.jpg",
    "img/blocka/1x1/mario4-1x1.jpg",
    "img/blocka/1x1/mario5-1x1.jpg",
    "img/blocka/1x1/mario6-1x1.jpg"
];

// Variables del temporizador
var tiempoInicio;
var tiempoTranscurrido = 0;
var intervaloTemporizador;
var juegoIniciado = false;

// Función para iniciar el juego
function iniciarJuego() {
    var pantallaInicio = document.getElementById("pantalla-inicio");
    var juego = document.getElementById("juego");
    
    // Ocultar pantalla de inicio y mostrar juego
    pantallaInicio.classList.add("oculto");
    juego.classList.remove("oculto");
    
    // Seleccionar una imagen aleatoria
    var indiceAleatorio = Math.floor(Math.random() * imagenes.length);
    var imagenSeleccionada = imagenes[indiceAleatorio];
    
    // Cargar la imagen y iniciar el temporizador
    var Imagen = new Image();
    Imagen.src = imagenSeleccionada;
    Imagen.onload = function() {
        cargarImagenEnCanvas(this);
        iniciarTemporizador();
    };
}

// Event listener para el botón de comenzar
document.getElementById("btn-comenzar").addEventListener("click", iniciarJuego);

// Función para cargar imagen en el canvas
function cargarImagenEnCanvas(imagen) {
    imageWidth  = imagen.width;
    imageHeight = imagen.height;
    
    // Ajustar el tamaño del canvas al tamaño de la imagen
    canvas.width = imageWidth;
    canvas.height = imageHeight;
    
    ctx.drawImage(imagen, 0, 0);
    
    imageData = ctx.getImageData(0, 0, imageWidth, imageHeight);
    
    aplicarFiltroRandom(imageData);
    ctx.putImageData(imageData, 0, 0);
    
    // Dibujar bordes en cada cuadrante
    const anchoCuadrante = imageWidth / columnas;
    const altoCuadrante = imageHeight / filas;
    ctx.strokeStyle = "red";
    ctx.lineWidth = 2;
    
    for (var x = 0; x < 2; x++) {
        for (var y = 0; y < filas; y++) {
            var posX = x * anchoCuadrante;
            var posY = y * altoCuadrante;
            ctx.strokeRect(posX, posY, anchoCuadrante, altoCuadrante);
        }
    }
    rotarCuadrantesAleatorio();
    juegoIniciado = true;
}

function aplicarFiltroRandom(imageData){
    const filtros = [filtroBrillo, filtroEscalaDeGrises, filtroNegativo]
    const random = Math.floor(Math.random() * filtros.length)
    filtros[random](imageData)
}

function setPixel(imageData,x,y,r,g,b,a){
    index = (x + y * imageData.width) *4;
    imageData.data[index+0] = r;
    imageData.data[index+1] = g;
    imageData.data[index+2] = b;
    imageData.data[index+3] = a;
}

function getPixel(imageData,x,y){
    index = (x + y * imageData.width) * 4;
    return {
        r: imageData.data[index+0],
        g: imageData.data[index+1],
        b: imageData.data[index+2],
        a: imageData.data[index+3]
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
    
    var dataCuadrante = ctx.getImageData(posX, posY, anchoCuadrante, altoCuadrante);
    
    //Crear un canvas temporal para dibujar el cuadrante rotado
    var canvasTemp = document.createElement('canvas');
    canvasTemp.width = anchoCuadrante;
    canvasTemp.height = altoCuadrante;
    var ctxTemp = canvasTemp.getContext('2d');
    
    // Dibujar los píxeles extraídos en el canvas temporal
    ctxTemp.putImageData(dataCuadrante, 0, 0);
    
    //Limpiar el área del cuadrante original en el canvas principal
    ctx.clearRect(posX, posY, anchoCuadrante, altoCuadrante);
    
    ctx.save(); //Guardar el estado del contexto
    
    //Mover el punto de origen al centro del cuadrante
    ctx.translate(posX + anchoCuadrante / 2, posY + altoCuadrante / 2);
    
    //Rotar el contexto (direccion: 1 = derecha, -1 = izquierda)
    var angulo = direccion * 90 * Math.PI / 180;
    ctx.rotate(angulo);
    
    //Dibujar el canvas temporal rotado (centrado en el origen)
    ctx.drawImage(canvasTemp, -anchoCuadrante / 2, -altoCuadrante / 2);
    
    //Restaurar el estado del contexto
    ctx.restore();
    
    //Actualizar el estado de rotación del cuadrante
    rotacionCuadrantes[cuadranteY][cuadranteX] += direccion;
    // Mantener el valor entre 0 y 3 (módulo 4)
    rotacionCuadrantes[cuadranteY][cuadranteX] = (rotacionCuadrantes[cuadranteY][cuadranteX] + 4) % 4;
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
    juegoIniciado = false
    detenerTemporizador();
    
    var segundosTotales = obtenerSegundos(tiempoTranscurrido);
    var tiempoFinal = document.getElementById("tiempo-final");
    var mensajeVictoria = document.getElementById("mensaje-victoria");
    
    tiempoFinal.textContent = segundosTotales + " segundos";
    mensajeVictoria.classList.remove("oculto");
}

// Función para detectar en qué cuadrante se hizo click
function obtenerCuadrante(event) {
    var x = event.offsetX
    var y = event.offsetY
    
    const anchoCuadrante = imageWidth / columnas;
    const altoCuadrante = imageHeight / filas;
    
    var cuadranteX = calcularCuadrante(x, anchoCuadrante);
    var cuadranteY = calcularCuadrante(y, altoCuadrante);
    
    return { x: cuadranteX, y: cuadranteY };
}

function calcularCuadrante(pos, lado){
    var cuadrante = 1
    while (pos > lado * cuadrante){
        cuadrante += 1
    }
    return cuadrante -1 // 0 index
}

function clickCuadrante(e, direccion){
    e.preventDefault();
    if (!juegoIniciado) return; // Solo permitir clicks si el juego inició
    
    var cuadrante = obtenerCuadrante(e);
    rotarCuadrante(cuadrante.x, cuadrante.y, direccion); // -1 = izquierda
    
    // Verificar si se completó el juego
    if (verificarJuegoCompleto()) {
        mostrarVictoria();
    }

}

// Event listener para click izquierdo (rotar cuadrante a la izquierda)
canvas.addEventListener("click", (e) => clickCuadrante(e, -1))

// Event listener para click derecho (rotar cuadrante a la derecha)
canvas.addEventListener("contextmenu", (e) => clickCuadrante(e, 1))


// Funciones del temporizador
function iniciarTemporizador() {
    tiempoInicio = Date.now();
    intervaloTemporizador = setInterval(actualizarTemporizador, 100);
}

function actualizarTemporizador() {
    tiempoTranscurrido = Date.now() - tiempoInicio;
    var segundos = Math.floor(tiempoTranscurrido / 1000);
    var temporizador = document.getElementById("temporizador");
    
    temporizador.textContent = segundos + " segundos";
}

function detenerTemporizador() {
    clearInterval(intervaloTemporizador);
}

function obtenerSegundos(milisegundos) {
    return Math.floor(milisegundos / 1000);
}
