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

  constructor() {
    super();
    this.currentIndex = 0;
    this.template = document.getElementById("carousel-template");
  }

  connectedCallback() {
    this.render();
  }

  render() {
      const slides = Array.from(this.children).filter(
        (el) => el.tagName === "CAROUSEL-CARD"
      );
    this.innerHTML = this.template.innerHTML;
    const track = this.querySelector(".track");
    console.log(this.children);

    slides.forEach((slide) => track.appendChild(slide.cloneNode(true)));

    track.style.transform = `translateX(-${this.currentIndex * 100}%)`;

    this.querySelector(".prev").addEventListener("click", () =>
      this.navigate(-1)
    );
    this.querySelector(".next").addEventListener("click", () =>
      this.navigate(1)
    );
  }

  update() {
    const track = this.querySelector(".track");
    track.style.transform = `translateX(-${this.currentIndex * 100}%)`;
  }

  navigate(direction) {
    const total = this.querySelectorAll(".track carousel-card").length;
    this.currentIndex = (this.currentIndex + direction + total) % total;
    this.update();
  }
}

customElements.define("image-carousel", ImageCarousel);
