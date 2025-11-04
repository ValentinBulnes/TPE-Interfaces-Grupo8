export class FichaModelo {
    /**
     * Constructor de la ficha del modelo.
     * Inicializa la posición de la ficha (fila y columna), su tipo (1 = ficha, 0 = vacío)
     * y su estado de selección.
     */
    constructor(fila, columna, tipo = 1) {
        this.fila = fila;
        this.columna = columna;
        this.tipo = tipo; // 1 = ficha, 0 = vacío
        this.seleccionada = false;
    }
}
