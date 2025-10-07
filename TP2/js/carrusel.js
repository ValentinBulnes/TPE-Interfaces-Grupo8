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
      "section .material-symbols-rounded"
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
  apiUrl = "https://vj.interfaces.jima.com.ar/api/v2";
  isApi;
  isPremium;

  constructor() {
    super();
    this.currentIndex = 0;
    this.template = document.getElementById("carousel-template");
    this._step = parseInt(this.getAttribute("step")) || null;
    this.slides = [];
    this.isApi = false;
    this.isPremium = false;
  }

  connectedCallback() {
    this.innerHTML = this.template.innerHTML;
    this.isApi = this.hasAttribute("api");
    this.isPremium = this.hasAttribute("premium");
    this.track = this.querySelector(".carousel > div");
    this.filter = this.getAttribute("filter") || "default?";
    this.carousel = this.querySelector(".carousel");

    this.querySelector("h3").textContent = this.getAttribute("title") || "E404";

    const dataUrl = this.isApi ? this.apiUrl : this.jsonPath;
    fetch(dataUrl)
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
    this.resizeObserver = new ResizeObserver(() => {
      this.update();
      this.updateScrollPill(true);
    });
    this.resizeObserver.observe(this.carousel);
    this.carousel.addEventListener("scroll", () => this.updateScrollPill(true));

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
    const slides = this.isApi
      ? this.parseApi(jsonData)
      : this.parseLocal(jsonData);

    // Update internal reference
    this.slides = this.track.querySelectorAll("carousel-card,premium-card");

    return slides;
  }

  createCard({ img, title, price }) {
    const tagName = this.isPremium ? "premium-card" : "carousel-card";
    const card = document.createElement(tagName);

    card.setAttribute("img", img);
    card.setAttribute("title", title);
    card.setAttribute("price", price);

    this.track.appendChild(card);
    return card;
  }

  parseLocal(jsonData) {
    return jsonData
      .filter(
        (item) => Array.isArray(item.tags) && item.tags.includes(this.filter)
      )
      .map((item) =>
        this.createCard({
          img: item.image,
          title: item.title,
          price: item.price,
        })
      );
  }

  parseApi(jsonData) {
    return jsonData
      .filter((item) =>
        item.genres?.some(
          (genre) => genre.name.toLowerCase() === this.filter.toLowerCase()
        )
      )
      .map((item) =>
        this.createCard({
          img: item.background_image_low_res,
          title: item.name,
          price: `$${(parseFloat(item.rating) * 10).toFixed(2)}`,
        })
      );
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
      Math.floor((carousel.offsetWidth + gap) / slotSize)
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

  updateScrollPill(isScroll = false) {
    const container = this.querySelector(".scroll-pill");
    const pill = container?.querySelector("div");
    const carousel = this.carousel;
    if (!pill || !container || !carousel || !this.slides.length) return;

    // --- Width proportional to visible slides ---
    const total = this.slides.length;
    const fractionVisible = this.visibleCount / total;
    pill.style.width = `${fractionVisible * 100}%`;

    const containerTravel = container.offsetWidth - pill.offsetWidth;
    const slide = this.slides[0];
    const slideWidth = slide.offsetWidth;
    const style = getComputedStyle(this.track);
    const gap = parseFloat(style.columnGap || style.gap || 0);
    const slotSize = slideWidth + gap;

    // max index for the pill to reach the end
    const maxIndex = total - this.visibleCount;
    const lastOffset = Math.max(0, maxIndex * slotSize);
    const realMaxScroll = Math.min(
      carousel.scrollWidth - carousel.clientWidth,
      lastOffset
    );

    let progress = 0;
    if (isScroll && realMaxScroll > 0) {
      progress = Math.min(carousel.scrollLeft / realMaxScroll, 1);
    } else if (maxIndex > 0) {
      progress = this.currentIndex / maxIndex;
    }

    pill.style.transform = `translateX(${progress * containerTravel}px)`;
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
