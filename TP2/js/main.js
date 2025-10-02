document.addEventListener('DOMContentLoaded', function () {
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
    const menuIcon = menuToggle.querySelector('iconify-icon');

    if (menuToggle && dropdownMenu) {
        menuToggle.addEventListener('click', function() {
            // Toggle del menú
            dropdownMenu.classList.toggle('show');
            
            // Cambiar el ícono
            if (dropdownMenu.classList.contains('show')) {
                menuIcon.setAttribute('icon', 'lucide:x');
            } else {
                menuIcon.setAttribute('icon', 'lucide:menu');
            }
        });
    }

    // Menú desplegable del usuario
    const userAvatarBtn = document.querySelector('.user-avatar-btn');
    const userDropdownMenu = document.querySelector('.user-dropdown-menu');

    if (userAvatarBtn && userDropdownMenu) {
        const userAvatar = userAvatarBtn.querySelector('.user-avatar');
        const closeIcon = userAvatarBtn.querySelector('.close-icon');

        userAvatarBtn.addEventListener('click', function() {
            // Toggle del menú
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
});

  