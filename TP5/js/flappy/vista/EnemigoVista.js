export class EnemigoVista {
    constructor() {
        this.elemento = document.createElement('div');
        this.elemento.classList.add('enemy');
        
        // Find the container to append to
        const contenedor = document.querySelector('.parallax-container');
        if (contenedor) {
            contenedor.appendChild(this.elemento);
        }
    }

    actualizarPosicion(x, y) {
        if (this.elemento) {
            this.elemento.style.left = `${x}px`;
            this.elemento.style.bottom = `${y}px`;
        }
    }

    eliminar() {
        if (this.elemento && this.elemento.parentNode) {
            this.elemento.parentNode.removeChild(this.elemento);
        }
    }
}
