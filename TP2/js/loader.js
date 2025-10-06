window.addEventListener("load", () => {
  setTimeout(() => {
    const loader = document.getElementById("loader");
    loader.classList.add("hidden");
    // document.body.style.overflow = "auto"; // restore scrolling
    setTimeout(() => {
      loader.remove();
    }, 800);
  }, 5000);
});
