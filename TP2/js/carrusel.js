// carousel.js
class CarouselCard extends HTMLElement {
  template;

  constructor() {
    super();
    this.template = document.getElementById("card-template");
  }

  connectedCallback() {
    this.appendChild(this.template.content.cloneNode(true));
    this.querySelector("img").src = this.getAttribute("img") || "";
    this.querySelector("img").alt = this.getAttribute("title") || "";
    this.querySelector("h3").textContent = this.getAttribute("title") || "";
    this.querySelector("p").textContent = this.getAttribute("text") || "";
  }
}
customElements.define("carousel-card", CarouselCard);

class ImageCarousel extends HTMLElement {
  template;
  slides;
  track;
  _step;
  visibleCount;

  constructor() {
    super();
    this.currentIndex = 0;
    this.template = document.getElementById("carousel-template");
    this._step = parseInt(this.getAttribute("step")) || null;
  }

  connectedCallback() {
    const slides = Array.from(this.children).filter(
      (el) => el.tagName.toLowerCase() === "carousel-card"
    );

    this.innerHTML = this.template.innerHTML;
    const track = this.querySelector(".track");

    slides.forEach((slide) => track.appendChild(slide));

    this.slides = track.querySelectorAll("carousel-card");
    this.track = track;

    // listen for resize to recalc visible count
    window.addEventListener("resize", () => this.update());

    this.querySelector(".prev").addEventListener("click", () =>
      this.navigate(-1)
    );
    this.querySelector(".next").addEventListener("click", () =>
      this.navigate(1)
    );

    // Observe dynamic changes
    this.observer = new MutationObserver(() => this.refresh());
    this.observer.observe(this, { childList: true });

    this.update();
  }

  disconnectedCallback() {
    // Clean up observer if component is removed
    if (this.observer) this.observer.disconnect();
  }

  get step() {
    return this._step || this.visibleCount;
  }

  update() {
    if (!this.slides.length) return;

    const slideWidth = this.slides[0].offsetWidth;
    const trackWidth = this.querySelector(".carousel").offsetWidth;
    this.visibleCount = Math.max(1, Math.floor(trackWidth / slideWidth));

    const offset = this.currentIndex * (100 / this.visibleCount);
    this.track.style.transform = `translateX(-${offset}%)`;
  }

  navigate(direction) {
    const totalSlides = this.slides.length;
    const maxIndex = totalSlides - this.visibleCount;

    this.currentIndex = Math.min(
      Math.max(this.currentIndex + direction * this.step, 0),
      maxIndex
    );

    this.update();
  }

  refresh() {
    // moves any direct child <carousel-card> into track
    // Gets called twice per insert: first for the insert, and a second time due to card relocation
    const cards = Array.from(this.querySelectorAll(":scope > carousel-card"));
    cards.forEach((card) => this.track.appendChild(card));

    this.slides = this.track.querySelectorAll("carousel-card");
    this.update();
  }
}

customElements.define("image-carousel", ImageCarousel);
