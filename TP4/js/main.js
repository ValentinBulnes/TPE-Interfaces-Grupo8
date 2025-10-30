var login = document.getElementById("login-container");
var register = document.getElementById("register-container");
var showRegister = document.getElementById("show-register");
var showLogin = document.getElementById("show-login");

function rotarLoginRegistro() {
    login.classList.toggle("hidden");
    register.classList.toggle("hidden");
}

if (login && register) {
    showRegister.addEventListener("click", rotarLoginRegistro);
    showLogin.addEventListener("click", rotarLoginRegistro);
}

// Menu desplegable del header
const menuToggle = document.querySelector(".menu-toggle");
const dropdownMenu = document.querySelector(".dropdown-menu");
const menuIcon = menuToggle ? menuToggle.querySelector("iconify-icon") : null;

// Menú desplegable del usuario
const userAvatarBtn = document.querySelector(".user-avatar-btn");
const userDropdownMenu = document.querySelector(".user-dropdown-menu");
const userAvatar = userAvatarBtn
    ? userAvatarBtn.querySelector(".user-avatar")
    : null;
const closeIcon = userAvatarBtn
    ? userAvatarBtn.querySelector(".close-icon")
    : null;

// Función para cerrar el menú de navegación
function closeDropdownMenu() {
    if (dropdownMenu && dropdownMenu.classList.contains("show")) {
        dropdownMenu.classList.remove("show");
        if (menuIcon) {
            menuIcon.setAttribute("icon", "lucide:menu");
        }
    }
}

// Función para cerrar el menú de usuario
function closeUserMenu() {
    if (userDropdownMenu && userDropdownMenu.classList.contains("show")) {
        userDropdownMenu.classList.remove("show");
        if (userAvatar && closeIcon) {
            userAvatar.classList.remove("hidden");
            closeIcon.classList.add("hidden");
        }
    }
}

// Event listener para el menú de navegación
if (menuToggle && dropdownMenu) {
    menuToggle.addEventListener("click", function () {
        // Cerrar el menú de usuario si está abierto
        closeUserMenu();

        // Toggle del menú de navegación
        dropdownMenu.classList.toggle("show");

        // Cambiar el ícono
        if (dropdownMenu.classList.contains("show")) {
            menuIcon.setAttribute("icon", "lucide:x");
        } else {
            menuIcon.setAttribute("icon", "lucide:menu");
        }
    });
}

// Event listener para el menú de usuario
if (userAvatarBtn && userDropdownMenu) {
    userAvatarBtn.addEventListener("click", function () {
        // Cerrar el menú de navegación si está abierto
        closeDropdownMenu();

        // Toggle del menú de usuario
        userDropdownMenu.classList.toggle("show");

        // Cambiar entre avatar y X
        userAvatar.classList.toggle("hidden");
        closeIcon.classList.toggle("hidden");
    });
}

// Footer accordion functionality
const footerCategoryHeaders = document.querySelectorAll(
    ".footer-category-header"
);

footerCategoryHeaders.forEach((header) => {
    header.addEventListener("click", function () {
        const list = this.nextElementSibling;
        const isActive = this.classList.contains("active");

        // Cerrar todas las categorías
        footerCategoryHeaders.forEach((h) => {
            h.classList.remove("active");
            h.nextElementSibling.classList.remove("show");
        });

        // Si no estaba activa, abrirla
        if (!isActive) {
            this.classList.add("active");
            list.classList.add("show");
        }
    });
});

// Menu de compartir
const shareButton = document.getElementById("share-button");
const shareMenu = document.getElementById("share-menu");

if (shareButton && shareMenu) {
    shareButton.addEventListener("click", function () {
        shareMenu.classList.toggle("hidden");
    });

    // Cerrar al hacer click fuera
    document.addEventListener("click", function (event) {
        if (
            !shareButton.contains(event.target) &&
            !shareMenu.contains(event.target)
        ) {
            shareMenu.classList.add("hidden");
        }
    });
}

// Success Animation
function showSuccessAnimation() {
    const overlay = document.getElementById("success-overlay");

    if (overlay) {
        // Mostrar animación con un pequeño delay para asegurar que se vea
        setTimeout(() => {
            overlay.classList.add("show");
        }, 50);

        // Redirigir después de 2.5 segundos para dar tiempo a ver la animación completa
        setTimeout(() => {
            window.location.href = "index.html";
        }, 2500);
    }
}

// Interceptar envío de formularios de login y registro
const loginForm = document.querySelector(".login-form");
const registerForm = document.querySelector(".registration-form");

if (loginForm) {
    loginForm.addEventListener("submit", function (e) {
        e.preventDefault(); //al precionar submit no recarga la pagina
        showSuccessAnimation(); // mostrar animación de éxito
    });
}

if (registerForm) {
    registerForm.addEventListener("submit", function (e) {
        e.preventDefault();
        showSuccessAnimation();
    });
}


// ============================================
// JUEGO PEG SOLITAIRE - NAVEGACIÓN
// ============================================

// Función para mostrar el menú principal
function mostrarMenuPrincipalPeg() {
    var menuPrincipal = document.getElementById("menu-principal-peg");
    var btnComenzarPeg = document.querySelector(".play-btn.game-btn");
    var gamePageSection = document.querySelector("#game-execution.game-page-section");
    var imagenFondo = gamePageSection ? gamePageSection.querySelector("img") : null;

    // Agrandar el div game-page-section a 800px de altura y cambiar fondo
    if (gamePageSection) {
        gamePageSection.style.height = "800px";
        gamePageSection.style.backgroundColor = "#2e2e2e";
    }

    // Ocultar la imagen de fondo
    if (imagenFondo) {
        imagenFondo.style.display = "none";
    }

    // Ocultar preview y botón, mostrar menú
    if (btnComenzarPeg) {
        btnComenzarPeg.style.display = "none";
    }
    if (menuPrincipal) {
        menuPrincipal.classList.remove("oculto");
    }
}

// Función para iniciar el juego desde el menú
function iniciarJuegoPeg() {
    var menuPrincipal = document.getElementById("menu-principal-peg");

    // Ocultar menú
    if (menuPrincipal) {
        menuPrincipal.classList.add("oculto");
    }

    // Mostrar juego
    var juegoPeg = document.getElementById("juego-peg");
    if (juegoPeg) {
        juegoPeg.classList.remove("oculto");
    }
}

// Función para volver al menú principal desde el juego
function volverAlMenuPeg() {
    var juegoPeg = document.getElementById("juego-peg");
    var menuPrincipal = document.getElementById("menu-principal-peg");
    var mensajeVictoria = document.getElementById("mensaje-victoria");
    var mensajeGameOver = document.getElementById("mensaje-gameover");

    // Ocultar mensaje de victoria
    if (mensajeVictoria) {
        mensajeVictoria.classList.add("oculto");
        mensajeVictoria.classList.remove("aparecer");
    }

    // Ocultar mensaje de game over
    if (mensajeGameOver) {
        mensajeGameOver.classList.add("oculto");
        mensajeGameOver.classList.remove("aparecer");
    }

    // Ocultar juego y mostrar menú principal
    if (juegoPeg && menuPrincipal) {
        juegoPeg.classList.add("oculto");
        menuPrincipal.classList.remove("oculto");
    }

}

// Event listener para el botón de play (muestra menú principal)
var btnComenzarPeg = document.querySelector(".play-btn.game-btn");
if (btnComenzarPeg) {
    btnComenzarPeg.addEventListener("click", mostrarMenuPrincipalPeg);
}

// Event listener para el botón "Comenzar" del menú principal
var btnIniciarJuegoPeg = document.getElementById("btn-iniciar-juego");
if (btnIniciarJuegoPeg) {
    btnIniciarJuegoPeg.addEventListener("click", iniciarJuegoPeg);
}

// Event listener para el botón "Menú Principal"
var btnMenuPrincipalPeg = document.getElementById("btn-menu-principal");
if (btnMenuPrincipalPeg) {
    btnMenuPrincipalPeg.addEventListener("click", volverAlMenuPeg);
}
