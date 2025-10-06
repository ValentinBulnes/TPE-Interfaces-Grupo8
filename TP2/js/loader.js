window.addEventListener("load", () => {
  const percentageElement = document.querySelector(".percentage");
  const loader = document.getElementById("loader");
  
  let percentage = 0;
  const interval = setInterval(() => {
    percentage += 2; // Incremento de 2% cada 100ms
    percentageElement.textContent = Math.min(percentage, 100) + "%";
    
    if (percentage >= 100) {
      clearInterval(interval);
      setTimeout(() => {
        loader.classList.add("hidden");
        setTimeout(() => loader.remove(), 800);
      }, 200);  //delay de 200ms para ver el 100%
    }
  }, 100);  //intervalo de 100ms para actualizar el porcentaje. cada 100ms se ejecuta.
});
