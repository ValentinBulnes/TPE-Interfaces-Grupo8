// Modelo del dragón - Maneja toda la lógica y el estado del dragón
export class DragonModelo {
    constructor() {
        // Estado del dragón
        this.posicionY = 0; // Posición Y del dragón (en píxeles, desde el centro)
        this.velocidadY = 0; // Velocidad vertical del dragón
        
        // Constantes físicas
        this.gravedad = 0.23; // Aceleración de la gravedad
        this.fuerzaSalto = -5; // Fuerza del salto (negativo = hacia arriba)
        
        // Límites del contenedor (en píxeles desde el centro)
        this.limiteSuperior = -470; // % No puede subir más de esto
        this.limiteInferior = 350; // % No puede bajar más de esto 
    }

    // Aplica la gravedad y actualiza la posición del dragón
    actualizar() {
        // Aplicar gravedad
        this.velocidadY += this.gravedad;
        
        // Actualizar posición
        this.posicionY += this.velocidadY;

        // Verificar límites del contenedor
        if (this.posicionY < this.limiteSuperior) {
            // Si toca el techo
            this.posicionY = this.limiteSuperior;
            this.velocidadY = 0; // Detener el movimiento hacia arriba
        }
        
        if (this.posicionY > this.limiteInferior) {
            // Si toca el suelo
            this.posicionY = this.limiteInferior;
            this.velocidadY = 0; // Detener el movimiento hacia abajo
        }
    }

    // Hace saltar al dragón
    saltar() {
        this.velocidadY = this.fuerzaSalto;
    }

    // Obtiene la posición actual del dragón
    obtenerPosicion() {
        return this.posicionY;
    }

    // Obtiene la velocidad actual del dragón
    obtenerVelocidad() {
        return this.velocidadY;
    }

    // Reinicia el estado del dragón
    reiniciar() {
        this.posicionY = 0;
        this.velocidadY = 0;
    }

    esColision(){
        return this.posicionY == this.limiteSuperior
    }
}

