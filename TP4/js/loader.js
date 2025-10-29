window.addEventListener("load", () => {
    // Actualizar porcentaje
    const percentageElement = document.querySelector(".percentage");
    let progress = 0;
    const totalDuration = 4300;
    const updateInterval = 50;

    const updatePercentage = () => {
        progress += (updateInterval / totalDuration) * 100;

        if (progress >= 100) {
            percentageElement.textContent = "100%";
            return;
        }

        percentageElement.textContent = Math.round(progress) + "%";
        setTimeout(updatePercentage, updateInterval);
    };

    setTimeout(updatePercentage, 100);

    // Ocultar loader después de 5 segundos
    setTimeout(() => {
        const loader = document.getElementById("loader");
        loader.classList.add("hidden");
        // document.body.style.overflow = "auto"; // restore scrolling
        setTimeout(() => {
            loader.remove();
        }, 800);
    }, 5000);
});
