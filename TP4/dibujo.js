let canvas = document.querySelector('#canvas');
let ctx = canvas.getContext('2d');
let canvasWidth = canvas.width;
let canvasHeight = canvas.height;

const CANT_FIG = 32;

let figures = [];
let lastClickFigure = null;
let isMouseDown = false;

var ImagenHTML5 = new Image();

const rows = 7;
const cols = 7;
const cellSize = 90; // Radio 30px + espacio 30px = 90px total

// 7x7 board layout (cross shape)
const board = [
    [0,0,1,1,1,0,0],
    [0,0,1,1,1,0,0],
    [1,1,1,1,1,1,1],
    [1,1,1,0,1,1,1], // centro vacío (3,3)
    [1,1,1,1,1,1,1],
    [0,0,1,1,1,0,0],
    [0,0,1,1,1,0,0],
  ];

function drawFigure() {
    clearCanvas();
    for (let i = 0; i < figures.length; i++) {
        figures[i].draw();
    }
}


function onMouseDown(e) {
    const mousePos = getMousePosition(e)
    
    console.log('Mouse down en:', mousePos.x, mousePos.y);
    isMouseDown = true;

    if (lastClickFigure != null) {
        lastClickFigure.setResaltado(false);
        lastClickFigure = null;
    }

    const clickFig = findClickedFigure( mousePos.x, mousePos.y);
    console.log('Figura encontrada:', clickFig);
    if (clickFig != null) {
        clickFig.setResaltado(true);
        lastClickFigure = clickFig;
        console.log('Figura seleccionada');
    }
    drawFigure();
}

function onMouseUp(e) {
    isMouseDown = false;
}

function onMouseMove(e) {
    if (isMouseDown && lastClickFigure != null) {
        const mousePos = getMousePosition(e)

        console.log('Moviendo figura a:', mousePos.x, mousePos.y);
        lastClickFigure.setPosition(mousePos.x, mousePos.y);
        drawFigure();
    }
}

function clearCanvas() {
    // Limpiar el canvas completamente
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    
    // Dibujar la imagen de fondo si está cargada
    if (ImagenHTML5.complete) {
        ctx.drawImage(ImagenHTML5, 0, 0, canvasWidth, canvasHeight);
    } else {
        // Si la imagen no está cargada aún, usar color de fondo temporal
        ctx.fillStyle = 'darkgray';
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    }
}

function addFigures() {
    // Limpiar el array de figuras
    figures = [];
    
    // Crear todas las fichas de una vez
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            if (board[i][j] === 1) {
                const posX = j * cellSize + cellSize / 2 + 17; 
                const posY = i * cellSize + cellSize / 2 + 17; // muevo ficha 17px para abajo y para la derecha para posicionarla en el centro de la celda.
                
                // El centro (3,3) arranca vacío
                if (!(i === 3 && j === 3)) {
                    let color = "blue";
                    let circle = new Circle(posX, posY, 30, color, ctx);
                    figures.push(circle);
                }
            }
        }
    }
    
    console.log('Fichas creadas:', figures.length);
}

function findClickedFigure(x, y) {
    for (let i = 0; i < figures.length; i++) {
        const element = figures[i];
        if (element.isPointInside(x, y)) {
            return element;
        }
    }
}

function getMousePosition(mouseEvent){
    return{
        x: mouseEvent.offsetX,
        y: mouseEvent.offsetY
    }
}

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM cargado, inicializando...');
    
    // Cargar la imagen de fondo
    ImagenHTML5.src = "Tablero.png";
    
    // Uso una función onload para que pinte la imagen una vez que ha sido descargada en el navegador
    ImagenHTML5.onload = function() {
        console.log('Imagen cargada, redibujando...');
        // Redibujar cuando la imagen esté cargada
        drawFigure();
    };
    
    addFigures();
    console.log('Figuras agregadas:', figures.length);
    
    // Agregar event listeners después de que todo esté inicializado
    canvas.addEventListener('mousedown', onMouseDown, false);
    canvas.addEventListener('mouseup', onMouseUp, false);
    canvas.addEventListener('mousemove', onMouseMove, false);
    
    console.log('Event listeners agregados');
    console.log('Canvas:', canvas);
    console.log('Canvas width:', canvas.width, 'height:', canvas.height);
});