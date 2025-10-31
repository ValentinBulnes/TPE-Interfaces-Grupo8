export class FichaModelo {
    constructor(fila, columna, tipo = 1) {
        this.fila = fila;
        this.columna = columna;
        this.tipo = tipo; // 1 = ficha, 0 = vacío
        this.seleccionada = false;
    }
}
