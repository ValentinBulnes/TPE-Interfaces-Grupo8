import { FichaModelo } from "./FichaModelo.js";

export class TableroModelo {
    constructor(size = 7) {
        this.size = size;
        this.fichas = [];
        this.inicializar();
    }

    inicializar() {
        this.fichas = [];

        for (let fila = 0; fila < this.size; fila++) {
            this.fichas[fila] = [];
            for (let col = 0; col < this.size; col++) {
                // Celdas inválidas → null directamente
                if ((fila < 2 || fila > 4) && (col < 2 || col > 4)) {
                    this.fichas[fila][col] = null;
                } else {
                    this.fichas[fila][col] = new FichaModelo(fila, col, 1);
                }
            }
        }
        this.fichas[3][3].tipo = 0;
    }

    obtenerFicha(fila, col) {
        if (!this.esCeldaValida(fila, col)) return null;
        return this.fichas[fila][col];
    }

    eliminarFicha(fila, col) {
        const ficha = this.obtenerFicha(fila, col);
        if (ficha) ficha.tipo = 0;
    }

    tieneFicha(fila, col) {
        const ficha = this.obtenerFicha(fila, col);
        return ficha && ficha.tipo === 1;
    }

    esCeldaValida(fila, col) {
        return (
            fila >= 0 &&
            fila < this.size &&
            col >= 0 &&
            col < this.size &&
            this.fichas[fila][col] !== null
        );
    }

    esMovimientoValido(fichaOrigen, filaDestino, colDestino) {
        if (!fichaOrigen || fichaOrigen.tipo !== 1) return false;
        if (!this.esCeldaValida(filaDestino, colDestino)) return false;
        if (this.tieneFicha(filaDestino, colDestino)) return false;

        const deltaFila = filaDestino - fichaOrigen.fila;
        const deltaCol = colDestino - fichaOrigen.columna;

        // Solo se permiten saltos de 2 celdas en línea recta
        if (
            !(
                (Math.abs(deltaFila) === 2 && deltaCol === 0) ||
                (Math.abs(deltaCol) === 2 && deltaFila === 0)
            )
        )
            return false;

        const filaMedio = fichaOrigen.fila + deltaFila / 2;
        const colMedio = fichaOrigen.columna + deltaCol / 2;

        return this.tieneFicha(filaMedio, colMedio);
    }

    aplicarMovimiento(fichaOrigen, filaDestino, colDestino) {
        if (!this.esMovimientoValido(fichaOrigen, filaDestino, colDestino))
            return false;

        const filaMedio = (fichaOrigen.fila + filaDestino) / 2;
        const colMedio = (fichaOrigen.columna + colDestino) / 2;

        // Mover ficha
        this.eliminarFicha(filaMedio, colMedio);
        fichaOrigen.tipo = 0;
        this.fichas[filaDestino][colDestino].tipo = 1;

        return true;
    }

    contarFichasRestantes() {
        let count = 0;
        for (let fila of this.fichas) {
            for (let ficha of fila) {
                if (ficha && ficha.tipo === 1) count++;
            }
        }
        return count;
    }

    verificarVictoria() {
        // El juego se gana cuando queda solo 1 ficha
        return this.contarFichasRestantes() === 1;
    }

    obtenerMovimientosPosibles() {
        const movimientos = [];
        const direcciones = [[-2, 0], [2, 0], [0, -2], [0, 2]];

        for (let fila of this.fichas) {
            for (let ficha of fila) {
                if (ficha && ficha.tipo === 1) {
                    for (let [df, dc] of direcciones) {
                        if (this.esMovimientoValido(ficha, ficha.fila + df, ficha.columna + dc)) {
                            movimientos.push({
                                origen: ficha,
                                destino: { fila: ficha.fila + df, columna: ficha.columna + dc }
                            });
                        }
                    }
                }
            }
        }
        return movimientos;
    }

    hayMovimientosDisponibles() {
        return this.obtenerMovimientosPosibles().length > 0;
    }
}

