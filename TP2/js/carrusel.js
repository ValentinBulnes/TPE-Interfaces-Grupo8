// carousel.js
class CarouselCard extends HTMLElement {
  template;
  isCart;
  isFree;

  constructor() {
    super();
    this.template = document.getElementById("card-template");
    this.isCart = false;
    this.isFree = false;
  }

  connectedCallback() {
    this.innerHTML = this.template.innerHTML;
    this.isCart = this.hasAttribute("cart");
    this.isFree = this.hasAttribute("free");

    this.querySelector("img").src = this.getAttribute("img") || "E404";
    this.querySelector("img").alt = this.getAttribute("title") || "E404";
    this.querySelector("section > h3.bold").textContent =
      this.getAttribute("title") || "E404";

    const priceElem = this.querySelector("section div h3");
    if (this.isFree) {
      priceElem.textContent = "Sin costo";
    } else {
      priceElem.textContent = this.getAttribute("price") || "E404";
    }

    if (this.isCart) {
      this.querySelector("div > span").textContent = "shopping_cart";
    }

    const favoriteIcon = this.querySelector(
      ".flex-row > .material-symbols-rounded"
    );
    favoriteIcon.addEventListener("click", () => {
      favoriteIcon.classList.toggle("filled");
    });
  }
}
customElements.define("carousel-card", CarouselCard);

class ImageCarousel extends HTMLElement {
  template;
  slides;
  track;
  _step;
  visibleCount;
  jsonPath = "./js/games.json";
  filter;
  carousel;

  constructor() {
    super();
    this.currentIndex = 0;
    this.template = document.getElementById("carousel-template");
    this._step = parseInt(this.getAttribute("step")) || null;
    this.slides = [];
  }

  connectedCallback() {
    this.innerHTML = this.template.innerHTML;
    this.track = this.querySelector(".carousel > div");
    this.filter = this.getAttribute("filter") || "default?";
    this.carousel = this.querySelector(".carousel");

    this.querySelector("h3").textContent = this.getAttribute("title") || "E404";

    fetch(this.jsonPath)
      .then((res) => res.json())
      .then((data) => this.loadFromJSON(data));

    this.querySelector(".prev").addEventListener("click", () =>
      this.navigate(-1)
    );
    this.querySelector(".next").addEventListener("click", () =>
      this.navigate(1)
    );

    // Observe dynamic changes in children
    this.observer = new MutationObserver(() => this.refresh());
    this.observer.observe(this, { childList: true });

    // Use ResizeObserver instead of window resize
    this.resizeObserver = new ResizeObserver(() => this.update());
    this.resizeObserver.observe(this.carousel);
    this.carousel.addEventListener("scroll", () => this.handleScroll());

    this.initSwipe(this.carousel);

    // Initial update after layout has settled
    requestAnimationFrame(() => this.update());
  }

  loadFromJSON(jsonData) {
    if (!this.track) {
      console.warn(
        "Carousel track not initialized yet. Run after connectedCallback."
      );
      return [];
    }

    // Create and append slides
    const slides = jsonData
      .filter(
        (item) => Array.isArray(item.tags) && item.tags.includes(this.filter)
      )
      .map((item) => {
        var card;
        if (this.filter == "premium")
          card = document.createElement("premium-card");
        else card = document.createElement("carousel-card");

        card.setAttribute("img", item.image);
        card.setAttribute("title", item.title);
        card.setAttribute("price", item.price);
        this.track.appendChild(card);
        return card;
      });

    // Update internal reference
    this.slides = this.track.querySelectorAll("carousel-card,premium-card");

    return slides;
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

    const carousel = this.querySelector(".carousel");
    const slide = this.slides[0];

    const slideWidth = slide.offsetWidth;
    const style = getComputedStyle(this.track);
    const gap = parseFloat(style.columnGap || style.gap || 0);

    // total width one "slot" takes (slide + gap)
    const slotSize = slideWidth + gap;

    // how many slides fit in the visible viewport
    this.visibleCount = Math.max(
      1,
      Math.floor(carousel.offsetWidth / slotSize)
    );

    // compute the offset in px
    const offset = this.currentIndex * slotSize;

    this.track.style.transform = `translateX(-${offset}px)`;

    this.updateScrollPill();
  }

  navigate(direction) {
    const totalSlides = this.slides.length;
    const maxIndex = totalSlides - this.visibleCount;
    const lastIndex = this.currentIndex;

    this.slides.forEach((slide, i) => {
      slide.style.animation = "none"; // reset in case animation is mid-flight
      slide.offsetHeight; // force reflow so animation restarts
      slide.style.animation = `${
        direction > 0 ? "flip-left" : "flip-right"
      } 1s ease`;
    });

    this.currentIndex = Math.min(
      Math.max(this.currentIndex + direction * this.step, 0),
      maxIndex
    );

    if (this.currentIndex == maxIndex) {
      this.querySelector(".next").disabled = true;
    } else if (lastIndex == maxIndex) {
      this.querySelector(".next").disabled = false;
    }
    if (this.currentIndex == 0) {
      this.querySelector(".prev").disabled = true;
    } else if (lastIndex == 0) {
      this.querySelector(".prev").disabled = false;
    }

    this.update();
  }

  initSwipe(element) {
    let touchStartX = 0;
    let touchEndX = 0;

    element.addEventListener("touchstart", (e) => {
      touchStartX = e.changedTouches[0].screenX;
    });

    element.addEventListener("touchend", (e) => {
      touchEndX = e.changedTouches[0].screenX;
      this.handleSwipe(touchStartX, touchEndX);
    });
  }

  handleSwipe(startX, endX) {
    const swipeThreshold = 50;
    if (endX < startX - swipeThreshold) {
      // Swipe left → next
      this.navigate(1);
    } else if (endX > startX + swipeThreshold) {
      // Swipe right → previous
      this.navigate(-1);
    }
  }

  refresh() {
    // moves any direct child <carousel-card> into track
    // Gets called twice per insert: first for the insert, and a second time due to card relocation
    const cards = Array.from(
      this.querySelectorAll(":scope > carousel-card, :scope > premium-card")
    );
    cards.forEach((card) => this.track.appendChild(card));

    this.slides = this.track.querySelectorAll("carousel-card,premium-card");
    this.update();
  }

  handleScroll() {
    const carousel = this.querySelector(".carousel");
    const container = this.querySelector(".scroll-pill");
    const pill = container?.querySelector("div");
    if (!carousel || !pill || !this.slides.length) return;

    const maxScroll = carousel.scrollWidth - carousel.clientWidth;
    if (maxScroll <= 0) return;

    const progress = carousel.scrollLeft / maxScroll; // 0 → 1
    const travel = container.offsetWidth - pill.offsetWidth;

    pill.style.transform = `translateX(${progress * travel}px)`;
  }

  updateScrollPill() {
    const pill = this.querySelector(".scroll-pill > div");
    const container = this.querySelector(".scroll-pill");
    if (!pill || !container) return;

    const total = this.slides.length;
    if (!total) return;

    // fraction of visible slides
    const fractionVisible = this.visibleCount / total;
    pill.style.width = `${fractionVisible * 100}%`;

    const maxIndex = total - this.visibleCount;
    if (maxIndex <= 0) {
      pill.style.transform = "translateX(0px)";
      return;
    }

    // available travel distance in pixels
    const containerWidth = container.offsetWidth;
    const pillWidth = pill.offsetWidth;
    const travel = containerWidth - pillWidth;

    // pixel offset proportional to currentIndex
    const offset = (this.currentIndex / maxIndex) * travel;

    pill.style.transform = `translateX(${offset}px)`;
  }
}

customElements.define("image-carousel", ImageCarousel);

class PremiumCard extends HTMLElement {
  template;

  constructor() {
    super();
    this.template = document.getElementById("premium-card-template");
  }

  connectedCallback() {
    this.innerHTML = this.template.innerHTML;
    this.isCart = this.hasAttribute("cart");
    this.isFree = this.hasAttribute("free");

    this.querySelector("img").src = this.getAttribute("img") || "E404";
    this.querySelector("img").alt = this.getAttribute("title") || "E404";
    this.querySelector("section h1").textContent =
      this.getAttribute("title") || "E404";

    this.querySelector("section h2").textContent =
      this.getAttribute("price") || "E404";
  }
}

customElements.define("premium-card", PremiumCard);
