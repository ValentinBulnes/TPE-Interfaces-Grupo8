import { NPCModelo } from './NPCModelo.js';

export class ColeccionableModelo extends NPCModelo {
    constructor(tipo) {
        let ancho = 64;
        let alto = 64;
        if (tipo === 'moneda') {
            ancho = 64;
            alto = 64;
        } else if (tipo === 'corazon') {
            ancho = 35;
            alto = 35;
        }

        super({ x: 640, velocidad: 5, ancho, alto });
        this.tipo = tipo;
    }
}

