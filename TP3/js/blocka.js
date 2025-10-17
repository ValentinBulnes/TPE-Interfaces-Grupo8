class PuzzlePiece {
  x_start;
  x_end;
  y_start;
  y_end;
  rotation;

  constructor(x_start, x_end, y_start, y_end) {
    this.x_start = x_start;
    this.x_end = x_end;
    this.y_start = y_start;
    this.y_end = y_end;
    this.rotation = 0;
  }

  isWithinRange(pos_x, pos_y) {
    return (
      pos_x >= this.x_start &&
      pos_x < this.x_end &&
      pos_y >= this.y_start &&
      pos_y < this.y_end
    );
  }

  toString() {
    return `x(${this.x_start}, ${this.x_end}), y(${this.y_start}, ${this.y_end}), rotation(${this.rotation})`;
  }
}

class Blocka {
  canvas;
  ctx;
  puzzle; // matrix?
  constructor() {
    this.canvas = document.querySelector("#canvas");
    this.ctx = this.canvas.getContext("2d");
    this.puzzle = new Array();
  }

  play() {
    this.loadImage("./img/blocka/1x1/mario1-1x1.jpeg");
    this.loadPuzzle(2, 2);
    this.canvas.addEventListener("click", (e) => this.leftClick(e, 1));
    this.canvas.addEventListener("contextmenu", (e) => this.leftClick(e, -1));
  }

  loadPuzzle(x_pieces, y_pieces) {
    const piece_width = Math.floor(this.canvas.width / x_pieces);
    const piece_height = Math.floor(this.canvas.height / y_pieces);
    for (let x = 0; x < x_pieces; x++) {
      for (let y = 0; y < y_pieces; y++) {
        const x_start = piece_width * x;
        const x_end = piece_width * (x + 1);
        const y_start = piece_height * y;
        const y_end = piece_height * (y + 1);
        const piece = new PuzzlePiece(x_start, x_end, y_start, y_end);
        this.puzzle.push(piece);
      }
    }
  }

  loadImage(src) {
    const image = new Image();
    image.src = src;
    image.onload = () => {
      this.drawImage(image);
      // ctx.getImageData
      // hacer los filtros y rotaciones de imagen
      // ctx.putImageData
    };
  }

  clearCanvas() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.puzzle = new Array();
  }

  drawImage(image) {
    this.ctx.drawImage(image, 0, 0);
  }

  leftClick(event, rotationDirection) {
    event.preventDefault();
    const pos_x = event.offsetX;
    const pos_y = event.offsetY;
    const target = this.puzzle
      .filter((piece) => piece.isWithinRange(pos_x, pos_y))
      .pop();
    console.log(target, rotationDirection);
    // ROTATE AND UPDATE ROTATION STATE
    this.rotatePiece(target)
  }

  rotatePiece(piece) {
    const height =
      piece.y_end == this.canvas.height ? this.canvas.height + 1 : piece.y_end;
    const width =
      piece.x_end == this.canvas.width ? this.canvas.width + 1 : piece.x_end;
    const pieceWidth = piece.y_end - piece.y_start;
    const pieceHeight = piece.x_end - piece.x_start;

    const srcData = this.ctx.getImageData(
      piece.x_start,
      piece.y_start,
      pieceWidth,
      pieceHeight
    );
    const dstData = this.ctx.createImageData(pieceWidth, pieceHeight);
    const src = srcData.data;
    const dst = dstData.data;

    for (let x = piece.x_start; x < width; x++) {
      for (let y = piece.y_start; y < height; y++) {
        const srcIndex = (y * width + x) * 4;
        // clockwise
        const newX = y;
        const newY = width - 1 - x;
        // counter clockwise
        // const newX = height - 1 - y;
        // const newY = x;
        const dstIndex = (newY * width + newX) * 4;
        //copy
        dst[dstIndex] = src[srcIndex];
        dst[dstIndex + 1] = src[srcIndex + 1];
        dst[dstIndex + 2] = src[srcIndex + 2];
        dst[dstIndex + 3] = src[srcIndex + 3];
      }
    }

    // Clear the quarter
    // this.ctx.clearRect(piece.x_start, piece.y_start, width, height);

    // Put the rotated pixels back
    this.ctx.putImageData(dstData, piece.x_start, piece.y_start);
  }
}

const blocka = new Blocka();
blocka.play();
/*
DISCLAIMER: No se permite la implementación en lenguajes específicos.  
A continuación se presenta la **estructura en pseudo-código** necesaria para generar, manipular y rastrear las piezas iniciales del juego BLOCKA mediante un elemento tipo *canvas*.

------------------------------------------------------------
TÍTULO: MANEJO DE PIEZAS – BLOQUE DE INTERACCIÓN CON CANVAS
------------------------------------------------------------

OBJETIVO:
Proveer la base lógica para:
1. Crear y renderizar las piezas dentro de un CANVAS.
2. Detectar clics y determinar qué pieza fue afectada.
3. Rotar y actualizar visualmente las piezas.
4. Mantener coherencia entre los datos lógicos y la representación gráfica.

------------------------------------------------------------
SECCIÓN 1 – CONFIGURACIÓN DEL CANVAS
------------------------------------------------------------

FUNCIÓN InicializarCanvas()
    CREAR elemento CANVAS en pantalla
    OBTENER contexto de dibujo (CONTEXT)
    DEFINIR dimensiones del CANVAS (ancho, alto)
    ASIGNAR manejadores de eventos:
        - OnClickIzquierdo(evento)
        - OnClickDerecho(evento)
    CREAR lista global: PIEZAS
FIN FUNCIÓN


------------------------------------------------------------
SECCIÓN 2 – GENERACIÓN DE PIEZAS INICIALES
------------------------------------------------------------

FUNCIÓN GenerarPiezas(imagenBase)
    DIVIDIR imagenBase en 4 regiones iguales:
        PARA cada región (fila, columna):
            CREAR estructura PIEZA con:
                - id
                - subImagen (fragmento de la imagen)
                - posicionActual (x, y)
                - anguloRotacion (aleatorio entre 0°, 90°, 180°, 270°)
                - posicionCorrecta (coordenadas originales)
                - filtroAsignado (según nivel)
            AÑADIR PIEZA a lista PIEZAS
    FIN PARA
FIN FUNCIÓN


------------------------------------------------------------
SECCIÓN 3 – DIBUJADO DE PIEZAS
------------------------------------------------------------

FUNCIÓN DibujarPiezas()
    LIMPIAR CANVAS
    PARA cada PIEZA en PIEZAS:
        APLICAR rotación según PIEZA.anguloRotacion
        APLICAR filtro visual (si corresponde)
        DIBUJAR PIEZA.subImagen en PIEZA.posicionActual
    FIN PARA
FIN FUNCIÓN


------------------------------------------------------------
SECCIÓN 4 – DETECCIÓN DE CLICS Y ROTACIÓN
------------------------------------------------------------

EVENTO OnClickIzquierdo(evento)
    coordenadas ← OBTENER CoordenadasDelClick(evento)
    piezaSeleccionada ← DetectarPieza(coordenadas)
    SI piezaSeleccionada ≠ NULL ENTONCES
        LLAMAR RotarPieza(piezaSeleccionada, IZQUIERDA)
        LLAMAR DibujarPiezas()
        LLAMAR VerificarCompletado()
    FIN SI
FIN EVENTO


EVENTO OnClickDerecho(evento)
    coordenadas ← OBTENER CoordenadasDelClick(evento)
    piezaSeleccionada ← DetectarPieza(coordenadas)
    SI piezaSeleccionada ≠ NULL ENTONCES
        LLAMAR RotarPieza(piezaSeleccionada, DERECHA)
        LLAMAR DibujarPiezas()
        LLAMAR VerificarCompletado()
    FIN SI
    CANCELAR menú contextual por defecto
FIN EVENTO


------------------------------------------------------------
SECCIÓN 5 – MANIPULACIÓN DE PIEZAS
------------------------------------------------------------

FUNCIÓN DetectarPieza(coordenadas)
    PARA cada PIEZA en PIEZAS:
        SI coordenadas DENTRO del área de PIEZA.posicionActual ENTONCES
            RETURN PIEZA
    FIN PARA
    RETURN NULL
FIN FUNCIÓN


FUNCIÓN RotarPieza(pieza, direccion)
    SI direccion = DERECHA ENTONCES
        pieza.anguloRotacion ← (pieza.anguloRotacion + 90) MOD 360
    SI direccion = IZQUIERDA ENTONCES
        pieza.anguloRotacion ← (pieza.anguloRotacion - 90) MOD 360
FIN FUNCIÓN


------------------------------------------------------------
SECCIÓN 6 – CONTROL DE ESTADO Y VERIFICACIÓN
------------------------------------------------------------

FUNCIÓN VerificarCompletado()
    PARA cada PIEZA en PIEZAS:
        SI pieza.anguloRotacion ≠ 0 ENTONCES
            RETURN FALSO
    FIN PARA
    LLAMAR EventoImagenCompletada()
FIN FUNCIÓN


FUNCIÓN EventoImagenCompletada()
    DETENER temporizador
    ELIMINAR filtros visuales de PIEZAS
    MOSTRAR imagen completa en RGB
    MOSTRAR mensaje “¡Imagen completada!”
FIN FUNCIÓN


------------------------------------------------------------
SECCIÓN 7 – CICLO DE ACTUALIZACIÓN
------------------------------------------------------------

FUNCIÓN BucleRender()
    MIENTRAS juegoActivo = VERDADERO:
        LLAMAR DibujarPiezas()
        ESPERAR pequeño intervalo (para mantener fluidez)
    FIN MIENTRAS
FIN FUNCIÓN


------------------------------------------------------------
ESTRUCTURA DE DATOS PROPUESTA
------------------------------------------------------------

ESTRUCTURA PIEZA
    id: entero
    subImagen: referencia a fragmento de imagen
    posicionActual: (x, y)
    posicionCorrecta: (x, y)
    anguloRotacion: número (0°, 90°, 180°, 270°)
    filtroAsignado: tipoFiltro
FIN ESTRUCTURA


------------------------------------------------------------
FLUJO RESUMIDO DE INTERACCIÓN
------------------------------------------------------------

1. InicializarCanvas()
2. Cargar imagen base
3. GenerarPiezas(imagenBase)
4. DibujarPiezas()
5. Esperar clics del usuario:
   - Clic izquierdo → rotar izquierda
   - Clic derecho → rotar derecha
6. Actualizar canvas y verificar si todas las piezas están correctamente orientadas
7. Si completado → mostrar imagen sin filtros y detener tiempo


------------------------------------------------------------
FIN DEL BLOQUE DE PSEUDO-CÓDIGO
------------------------------------------------------------
*/
