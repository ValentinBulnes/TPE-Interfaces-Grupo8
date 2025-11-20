import { NPCModelo } from "./NPCModelo.js";

export class EnemigoModelo extends NPCModelo {
    constructor() {
        super({
            x: 640,
            velocidad: 5,
            ancho: 75,
            alto: 75,
            reduccionHitbox: 0.6,
        });
    }
}
