export class ColeccionableVista {
    constructor(tipo) {
        this.tipo = tipo;
        this.elemento = this.crearElemento();
    }

    crearElemento() {
        const elemento = document.createElement('div');
        
        // Aplicar clase CSS según el tipo
        if (this.tipo === 'moneda') {
            elemento.className = 'moneda-movil';
        } else if (this.tipo === 'corazon') {
            elemento.className = 'corazon-movil';
        }
        
        const contenedor = document.querySelector('.parallax-container');
        if (contenedor) {
            contenedor.appendChild(elemento);
        }
        
        return elemento;
    }

    actualizarPosicion(x, y) {
        if (this.elemento) {
            this.elemento.style.left = x + 'px';
            this.elemento.style.bottom = y + 'px';
        }
    }

    eliminar() {
        if (this.elemento && this.elemento.parentNode) {
            this.elemento.parentNode.removeChild(this.elemento);
        }
    }
}

