export class FichaModelo {
    constructor(fila, columna, tipo = 1) {
        this.fila = fila;
        this.columna = columna;
        this.tipo = tipo; // 1 = ficha, 0 = vacío
        this.seleccionada = false;
    }

    mover(filaDestino, colDestino) {
        // mejor no usar
        this.fila = filaDestino;
        this.columna = colDestino;
    }

    flip(){
        if (this.tipo == 1)
            this.tipo = 0
        else
            this.tipo = 1
    }
}
