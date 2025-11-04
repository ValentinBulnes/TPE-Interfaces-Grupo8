import { FichaModelo } from "./FichaModelo.js";

export class TableroModelo {
    /**
     * Constructor del tablero del modelo.
     * Inicializa el tamaño del tablero y llama al método inicializar para crear las fichas.
     */
    constructor(size = 7) {
        this.size = size;
        this.fichas = [];
        this.inicializar();
    }

    /**
     * Inicializa el tablero creando las fichas en las posiciones válidas.
     * Las esquinas quedan como null (celdas inválidas) y el centro (3,3) queda vacío.
     */
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

    /**
     * Obtiene la ficha en la posición especificada.
     * Retorna null si la celda no es válida o no existe.
     */
    obtenerFicha(fila, col) {
        if (!this.esCeldaValida(fila, col)) return null;
        return this.fichas[fila][col];
    }

    /**
     * Elimina una ficha del tablero cambiando su tipo a 0 (vacío).
     */
    eliminarFicha(fila, col) {
        const ficha = this.obtenerFicha(fila, col);
        if (ficha) ficha.tipo = 0;
    }

    /**
     * Verifica si hay una ficha en la posición especificada.
     * Retorna true si existe una ficha (tipo = 1) en esa posición.
     */
    tieneFicha(fila, col) {
        const ficha = this.obtenerFicha(fila, col);
        return ficha && ficha.tipo === 1;
    }

    /**
     * Verifica si una celda es válida en el tablero.
     * Una celda es válida si está dentro de los límites y no es null.
     */
    esCeldaValida(fila, col) {
        return (
            fila >= 0 &&
            fila < this.size &&
            col >= 0 &&
            col < this.size &&
            this.fichas[fila][col] !== null
        );
    }

    /**
     * Verifica si un movimiento es válido.
     * Un movimiento es válido si: la ficha origen existe, el destino es válido y está vacío,
     * el salto es de exactamente 2 celdas en línea recta, y hay una ficha en el medio.
     */
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

    /**
     * Aplica un movimiento en el tablero.
     * Elimina la ficha del medio, mueve la ficha origen al destino y retorna true si el movimiento fue exitoso.
     */
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

    /**
     * Cuenta las fichas restantes en el tablero.
     * Recorre todas las celdas y cuenta las que tienen tipo = 1.
     */
    contarFichasRestantes() {
        let count = 0;
        for (let fila of this.fichas) {
            for (let ficha of fila) {
                if (ficha && ficha.tipo === 1) count++;
            }
        }
        return count;
    }

    /**
     * Verifica si se cumplió la condición de victoria.
     * El juego se gana cuando queda solo 1 ficha en el tablero.
     */
    verificarVictoria() {
        return this.contarFichasRestantes() === 1;
    }

    /**
     * Obtiene todos los movimientos posibles para una ficha seleccionada.
     * Verifica las 4 direcciones (arriba, abajo, izquierda, derecha) y retorna
     * las fichas destino donde se puede mover.
     */
    obtenerMovimientosPosibles(fichaSeleccionada) {
        const fichasDestino = [];
        const direcciones = [
            [-2, 0],
            [2, 0],
            [0, -2],
            [0, 2],
        ];

        for (let [df, dc] of direcciones) {
            const filaDestino = fichaSeleccionada.fila + df;
            const colDestino = fichaSeleccionada.columna + dc;
            if (
                this.esMovimientoValido(
                    fichaSeleccionada,
                    filaDestino,
                    colDestino
                )
            ) {
                fichasDestino.push(this.obtenerFicha(filaDestino, colDestino));
            }
        }

        return fichasDestino;
    }

    /**
     * Verifica si hay movimientos disponibles en el tablero.
     * Recorre todas las fichas y verifica si alguna puede realizar un movimiento válido.
     * Retorna true si hay al menos un movimiento posible.
     */
    hayMovimientosDisponibles() {
        const direcciones = [
            [-2, 0],
            [2, 0],
            [0, -2],
            [0, 2],
        ];

        for (let fila of this.fichas) {
            for (let ficha of fila) {
                if (ficha && ficha.tipo === 1) {
                    for (let [df, dc] of direcciones) {
                        if (
                            this.esMovimientoValido(
                                ficha,
                                ficha.fila + df,
                                ficha.columna + dc
                            )
                        ) {
                            return true;
                        }
                    }
                }
            }
        }
        return false;
    }
}
