var login = document.getElementById('login-container');
var register = document.getElementById('register-container');
var showRegister = document.getElementById('show-register');
var showLogin = document.getElementById('show-login');

function rotarLoginRegistro() {
    login.classList.toggle('hidden');
    register.classList.toggle('hidden');
}

if (login && register) {
    showRegister.addEventListener('click', rotarLoginRegistro);
    showLogin.addEventListener('click', rotarLoginRegistro);
}

// Menu desplegable del header
const menuToggle = document.querySelector('.menu-toggle');
const dropdownMenu = document.querySelector('.dropdown-menu');
const menuIcon = menuToggle ? menuToggle.querySelector('iconify-icon') : null;

// Menú desplegable del usuario
const userAvatarBtn = document.querySelector('.user-avatar-btn');
const userDropdownMenu = document.querySelector('.user-dropdown-menu');
const userAvatar = userAvatarBtn ? userAvatarBtn.querySelector('.user-avatar') : null;
const closeIcon = userAvatarBtn ? userAvatarBtn.querySelector('.close-icon') : null;

// Función para cerrar el menú de navegación
function closeDropdownMenu() {
    if (dropdownMenu && dropdownMenu.classList.contains('show')) {
        dropdownMenu.classList.remove('show');
        if (menuIcon) {
            menuIcon.setAttribute('icon', 'lucide:menu');
        }
    }
}

// Función para cerrar el menú de usuario
function closeUserMenu() {
    if (userDropdownMenu && userDropdownMenu.classList.contains('show')) {
        userDropdownMenu.classList.remove('show');
        if (userAvatar && closeIcon) {
            userAvatar.classList.remove('hidden');
            closeIcon.classList.add('hidden');
        }
    }
}

// Event listener para el menú de navegación
if (menuToggle && dropdownMenu) {
    menuToggle.addEventListener('click', function() {
        // Cerrar el menú de usuario si está abierto
        closeUserMenu();
        
        // Toggle del menú de navegación
        dropdownMenu.classList.toggle('show');
        
        // Cambiar el ícono
        if (dropdownMenu.classList.contains('show')) {
            menuIcon.setAttribute('icon', 'lucide:x');
        } else {
            menuIcon.setAttribute('icon', 'lucide:menu');
        }
    });
}

// Event listener para el menú de usuario
if (userAvatarBtn && userDropdownMenu) {
    userAvatarBtn.addEventListener('click', function() {
        // Cerrar el menú de navegación si está abierto
        closeDropdownMenu();
        
        // Toggle del menú de usuario
        userDropdownMenu.classList.toggle('show');
        
        // Cambiar entre avatar y X
        userAvatar.classList.toggle('hidden');
        closeIcon.classList.toggle('hidden');
    });
}

// Footer accordion functionality
const footerCategoryHeaders = document.querySelectorAll('.footer-category-header');

footerCategoryHeaders.forEach(header => {
    header.addEventListener('click', function() {
        const list = this.nextElementSibling;
        const isActive = this.classList.contains('active');
        
        // Cerrar todas las categorías
        footerCategoryHeaders.forEach(h => {
            h.classList.remove('active');
            h.nextElementSibling.classList.remove('show');
        });
        
        // Si no estaba activa, abrirla
        if (!isActive) {
            this.classList.add('active');
            list.classList.add('show');
        }
    });
});

// Menu de compartir
const shareButton = document.getElementById('share-button');
const shareMenu = document.getElementById('share-menu');

if (shareButton && shareMenu) {
    shareButton.addEventListener('click', function() {
        shareMenu.classList.toggle('hidden');
    });
    
    // Cerrar al hacer click fuera
    document.addEventListener('click', function(event) {
        if (!shareButton.contains(event.target) && !shareMenu.contains(event.target)) {
            shareMenu.classList.add('hidden');
        }
    });
}

// Función para crear una card con los datos del juego
function createGameCard(game, template) {
    const clone = template.content.cloneNode(true);
    
    const img = clone.querySelector('.game-card-image');
    img.src = game.image;
    img.alt = game.alt;
    
    const title = clone.querySelector('.game-card-title');
    title.textContent = game.title;
    
    const price = clone.querySelector('.game-card-price');
    price.textContent = game.price;
    
    // Configurar el enlace según el tipo de juego
    const playLink = clone.querySelector('.game-card-play-btn');
    const playIcon = clone.querySelector('.play-icon');
    const cartIcon = clone.querySelector('.cart-icon');
    
    if (game.price === "Sin costo" || game.price === "Adquirido") {
        price.classList.add('free-game');
        // Mostrar icono de play para juegos gratis/adquiridos
        playIcon.classList.remove('hidden');
        cartIcon.classList.add('hidden');
    } else {
        // Mostrar icono de carrito para juegos de pago
        playIcon.classList.add('hidden');
        cartIcon.classList.remove('hidden');
    }
    
    return clone;
}

// Función para cargar y renderizar el carrusel
async function loadCarousel() {
    const carouselTrack = document.getElementById('carousel-track');
    const carouselTrack2 = document.getElementById('carousel-track-2');
    const carouselTrack3 = document.getElementById('carousel-track-3');
    const template = document.getElementById('game-card-template');
    
    if (!carouselTrack || !template) {
        console.error('No se encontró el carousel-track o template');
        return;
    }
    
    try {
        const response = await fetch('games.JSON');
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const games = await response.json();
        
        // Primer carrusel: primeras 12 cards
        const carouselGames = games.slice(0, 12);
        
        carouselGames.forEach((game) => {
            const card = createGameCard(game, template);
            carouselTrack.appendChild(card);
        });
        
        console.log('Primer carrusel generado con', carouselGames.length, 'juegos');
        
        // Segundo carrusel: siguientes 12 cards
        if (carouselTrack2) {
            const carouselGames2 = games.slice(12, 24);
            
            carouselGames2.forEach((game) => {
                const card = createGameCard(game, template);
                carouselTrack2.appendChild(card);
            });
            
            console.log('Segundo carrusel generado con', carouselGames2.length, 'juegos');
        }
        
        // Tercer carrusel: últimas 12 cards
        if (carouselTrack3) {
            const carouselGames3 = games.slice(24, 36);
            
            carouselGames3.forEach((game) => {
                const card = createGameCard(game, template);
                carouselTrack3.appendChild(card);
            });
            
            console.log('Tercer carrusel generado con', carouselGames3.length, 'juegos');
        }
        
        // Inicializar la funcionalidad del carrusel
        initCarousel();
        
    } catch (error) {
        console.error('Error al cargar el carrusel:', error);
    }
}


// Funcionalidad del carrusel
function initCarousel() {
    const cardWidth = 221; // Ancho de la card
    const gap = 37; // Gap entre cards
    const scrollAmount = (cardWidth + gap) * 2; // Mover 2 cards a la vez
    
    // Configurar cada carrusel
    const carousels = [
        {
            track: document.getElementById('carousel-track'),
            prevBtn: document.querySelector('.carousel-btn-prev'),
            nextBtn: document.querySelector('.carousel-btn-next'),
            indicator: document.getElementById('carousel-indicator-1'),
            currentPosition: 0,
            currentIndex: 0
        },
        {
            track: document.getElementById('carousel-track-2'),
            prevBtn: document.querySelector('.carousel-btn-prev-2'),
            nextBtn: document.querySelector('.carousel-btn-next-2'),
            indicator: document.getElementById('carousel-indicator-2'),
            currentPosition: 0,
            currentIndex: 0
        },
        {
            track: document.getElementById('carousel-track-3'),
            prevBtn: document.querySelector('.carousel-btn-prev-3'),
            nextBtn: document.querySelector('.carousel-btn-next-3'),
            indicator: document.getElementById('carousel-indicator-3'),
            currentPosition: 0,
            currentIndex: 0
        }
    ];
    
    console.log('Carruseles inicializados');
    
    // Función para mover el carrusel
    function moveCarousel(carousel, direction) {
        if (!carousel.track) return;
        
        const cards = carousel.track.querySelectorAll('.game-card');
        const totalCards = cards.length;
        const visibleCards = 4.5; // Cantidad de cards visibles
        const cardWidth = 221;
        const gap = 37;
        const cardWithGap = cardWidth + gap;
        
        // Calcular el número máximo de pasos posibles
        // Considerando que movemos 2 cards por paso y que queremos mostrar al menos 4.5 cards
        const cardsPerStep = 2;
        const maxSteps = Math.max(0, Math.floor((totalCards - Math.floor(visibleCards)) / cardsPerStep));
        
        // Calcular nueva posición e índice
        let newPosition = carousel.currentPosition;
        let newIndex = carousel.currentIndex;
        
        if (direction === 'next') {
            newIndex++;
            newPosition -= scrollAmount;
        } else {
            newIndex--;
            newPosition += scrollAmount;
        }
        
        // Limitar el scroll - no permitir moverse más allá de los límites
        if (newIndex < 0) {
            newIndex = 0;
            newPosition = 0;
        } else if (newIndex > maxSteps) {
            newIndex = maxSteps;
            newPosition = -newIndex * scrollAmount;
        }
        
        // Verificación adicional: no permitir scroll si no hay suficientes cards
        if (totalCards <= Math.floor(visibleCards)) {
            newIndex = 0;
            newPosition = 0;
        }
        
        // Actualizar los valores del carrusel
        carousel.currentIndex = newIndex;
        carousel.currentPosition = newPosition;
        
        // Agregar clase de movimiento según dirección
        carousel.track.classList.remove('moving', 'moving-left');
        if (direction === 'next') {
            carousel.track.classList.add('moving');
        } else {
            carousel.track.classList.add('moving-left');
        }
        
        // Aplicar transformación suave
        carousel.track.style.transform = `translateX(${carousel.currentPosition}px)`;
        
        // Actualizar indicador
        if (carousel.indicator) {
            const indicatorWidth = 75; // Ancho de la barra indicadora en px
            const containerWidth = 300; // Ancho del contenedor en px
            const maxTranslate = containerWidth - indicatorWidth; // 225px máximo
            
            // Calcular progreso basado en los pasos máximos
            const progress = maxSteps > 0 ? carousel.currentIndex / maxSteps : 0;
            const indicatorPosition = Math.min(progress * maxTranslate, maxTranslate);
            carousel.indicator.style.transform = `translateX(${indicatorPosition}px)`;
        }
        
        // Quitar clase después de la animación
        setTimeout(() => {
            carousel.track.classList.remove('moving', 'moving-left');
        }, 2000);
    }
    
    // Configurar botones para cada carrusel
    carousels.forEach(carousel => {
        if (carousel.prevBtn && carousel.nextBtn && carousel.track) {
            carousel.nextBtn.addEventListener('click', () => {
                moveCarousel(carousel, 'next');
            });
            
            carousel.prevBtn.addEventListener('click', () => {
                moveCarousel(carousel, 'prev');
            });
        }
    });
    
    // Actualizar indicador en scroll manual (mobile)
    const wrappers = [
        { wrapper: document.querySelector('.carousel-wrapper'), indicator: document.getElementById('carousel-indicator-1') },
        { wrapper: document.querySelector('.carousel-wrapper-2'), indicator: document.getElementById('carousel-indicator-2') },
        { wrapper: document.querySelector('.carousel-wrapper-3'), indicator: document.getElementById('carousel-indicator-3') }
    ];
    
    wrappers.forEach(item => {
        if (item.wrapper && item.indicator) {
            item.wrapper.addEventListener('scroll', () => {
                // Quitar la transición para movimiento instantáneo
                item.indicator.style.transition = 'none';
                
                const scrollLeft = item.wrapper.scrollLeft;
                const scrollWidth = item.wrapper.scrollWidth - item.wrapper.clientWidth;
                const indicatorWidth = 75;
                const containerWidth = 300;
                const maxTranslate = containerWidth - indicatorWidth;
                const progress = scrollLeft / scrollWidth;
                const indicatorPosition = Math.min(progress * maxTranslate, maxTranslate);
                item.indicator.style.transform = `translateX(${indicatorPosition}px)`;
            });
            
            // Restaurar la transición cuando termina el scroll
            item.wrapper.addEventListener('scrollend', () => {
                item.indicator.style.transition = 'transform 2s ease-out';
            });
        }
    });
}

// Galería simple con botones y swipe
const gallery = document.getElementById('gallery');
if (gallery) {
    const images = gallery.querySelectorAll('img');
    const galleryTitle = document.getElementById('gallery-title');
    const galleryPrice = document.getElementById('gallery-price');
    const galleryIndicator = document.getElementById('gallery-indicator-text');
    let currentIndex = 0;

    // Precios correspondientes a cada imagen
    const gamePrices = ['$99.99', '$79.99', '$89.99', '$49.99', '$39.99'];

    const showImage = (index) => {
        images.forEach((img, i) => {
            if (i === index) {
                img.classList.add('active');
                // Actualizar el título con el alt de la imagen
                if (galleryTitle) {
                    galleryTitle.textContent = img.alt;
                }
                // Actualizar el precio
                if (galleryPrice) {
                    galleryPrice.textContent = gamePrices[i];
                }
                // Actualizar el indicador
                if (galleryIndicator) {
                    galleryIndicator.textContent = `${index + 1} / ${images.length}`;
                }
            } else {
                img.classList.remove('active');
            }
        });
    };

    // Botones para desktop
    document.querySelector('.gallery-btn-next')?.addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % images.length;
        showImage(currentIndex);
    });

    document.querySelector('.gallery-btn-prev')?.addEventListener('click', () => {
        currentIndex = (currentIndex - 1 + images.length) % images.length;
        showImage(currentIndex);
    });

    // Swipe para mobile
    let touchStartX = 0;
    let touchEndX = 0;

    gallery.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    });

    gallery.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });

    const handleSwipe = () => {
        if (touchEndX < touchStartX - 50) {
            // Swipe left - siguiente imagen
            currentIndex = (currentIndex + 1) % images.length;
            showImage(currentIndex);
        }
        if (touchEndX > touchStartX + 50) {
            // Swipe right - imagen anterior
            currentIndex = (currentIndex - 1 + images.length) % images.length;
            showImage(currentIndex);
        }
    };
    
    // Mostrar la primera imagen
    showImage(currentIndex);
}

// Cargar la aplicación cuando el DOM esté listo
function initApp() {
    loadCarousel();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    // DOM ya está listo, ejecutar inmediatamente
    initApp();
}