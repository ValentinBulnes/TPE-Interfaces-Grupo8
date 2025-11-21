export class ObstaculoVista {
    constructor() {
        // Crear elementos para ambos tubos
        this.tuboSuperior = document.createElement('div');
        this.tuboInferior = document.createElement('div');
        
        this.tuboSuperior.classList.add('tubo', 'tubo-superior');
        this.tuboInferior.classList.add('tubo', 'tubo-inferior');
        
        // Find the container to append to
        const contenedor = document.querySelector('.parallax-container');
        if (contenedor) {
            contenedor.appendChild(this.tuboSuperior);
            contenedor.appendChild(this.tuboInferior);
        }
    }

    actualizarPosicion(posiciones) {
        // Actualizar tubo superior
        if (this.tuboSuperior) {
            this.tuboSuperior.style.left = `${posiciones.superior.x}px`;
            this.tuboSuperior.style.top = `${posiciones.superior.y}px`;
            this.tuboSuperior.style.height = `${posiciones.superior.alto}px`;
        }

        // Actualizar tubo inferior
        if (this.tuboInferior) {
            this.tuboInferior.style.left = `${posiciones.inferior.x}px`;
            this.tuboInferior.style.top = `${posiciones.inferior.y}px`;
            this.tuboInferior.style.height = `${posiciones.inferior.alto}px`;
        }
    }

    eliminar() {
        if (this.tuboSuperior && this.tuboSuperior.parentNode) {
            this.tuboSuperior.parentNode.removeChild(this.tuboSuperior);
        }
        if (this.tuboInferior && this.tuboInferior.parentNode) {
            this.tuboInferior.parentNode.removeChild(this.tuboInferior);
        }
    }
}

