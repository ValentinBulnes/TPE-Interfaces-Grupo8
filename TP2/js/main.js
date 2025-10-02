var login = document.getElementById('login-container');
var register = document.getElementById('register-container');
var showRegister = document.getElementById('show-register');
var showLogin = document.getElementById('show-login');

function mostrarLogin() {
    login.classList.remove('hidden');
    register.classList.add('hidden');
}

function mostrarRegistro() {
    login.classList.add('hidden');
    register.classList.remove('hidden');
}

// Estado inicial, login visible
if (login && register) {
    mostrarLogin();
}

// Eventos
if (showRegister) {
    showRegister.addEventListener('click', mostrarRegistro);
}

if (showLogin) {
    showLogin.addEventListener('click', mostrarLogin);
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
        if (userDropdownMenu.classList.contains('show')) {
            userAvatar.classList.add('hidden');
            closeIcon.classList.remove('hidden');
        } else {
            userAvatar.classList.remove('hidden');
            closeIcon.classList.add('hidden');
        }
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