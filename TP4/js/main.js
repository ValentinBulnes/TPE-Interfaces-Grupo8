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