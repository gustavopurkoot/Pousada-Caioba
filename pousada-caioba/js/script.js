(function () {
  "use strict";

  /* ========================================================================
     Configuração central — altere apenas aqui quando os dados mudarem.
     ======================================================================== */
  const CONFIG = {
    whatsappNumber: "5541995696112",
    whatsappMessage: "Olá! Vim pelo site da Pousada Caiobá e gostaria de informações sobre reservas.",
    instagramUrl: "https://www.instagram.com/pousadacaioba_oficial/",
    address: "R. Jacarezinho, 275 - Caiobá, Matinhos - PR, 83260-000",
    
    youtubeHotelId: "lZDSMZ95i8c",
    youtubeVideo2Id: "sJtHVjIubcU",
  };

  function buildWhatsappUrl() {
    const encodedMessage = encodeURIComponent(CONFIG.whatsappMessage);
    return `https://wa.me/${CONFIG.whatsappNumber}?text=${encodedMessage}`;
  }

  function buildMapsUrl() {
    const encodedAddress = encodeURIComponent(CONFIG.address);
    return `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;
  }

  function buildYoutubeEmbedUrl(videoId) {
    return `https://www.youtube-nocookie.com/embed/${videoId}?rel=0`;
  }

  /* ========================================================================
     Links centralizados (WhatsApp, Maps, Instagram)
     ======================================================================== */
  function setupLinks() {
    const whatsappUrl = buildWhatsappUrl();
    document.querySelectorAll(".js-whatsapp-link").forEach((el) => {
      el.setAttribute("href", whatsappUrl);
      el.setAttribute("target", "_blank");
      el.setAttribute("rel", "noopener noreferrer");
    });

    const mapsUrl = buildMapsUrl();
    document.querySelectorAll(".js-maps-link").forEach((el) => {
      el.setAttribute("href", mapsUrl);
    });

    document.querySelectorAll(".js-instagram-link").forEach((el) => {
      el.setAttribute("href", CONFIG.instagramUrl);
    });
  }

  /* ========================================================================
     Vídeos do YouTube — cria os iframes dentro dos frames responsivos
     ======================================================================== */
  function setupVideos() {
    const videoMap = {
      hotel: { id: CONFIG.youtubeHotelId, title: "Vídeo da Pousada Caiobá" },
      reserva: { id: CONFIG.youtubeVideo2Id, title: "Vídeo — Reserve direto conosco" },
    };

    document.querySelectorAll(".video-frame[data-video]").forEach((frame) => {
      const key = frame.getAttribute("data-video");
      const video = videoMap[key];
      if (!video) return;

      const iframe = document.createElement("iframe");
      iframe.src = buildYoutubeEmbedUrl(video.id);
      iframe.title = video.title;
      iframe.loading = "lazy";
      iframe.referrerPolicy = "strict-origin-when-cross-origin";
      iframe.allow = "accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
      iframe.allowFullscreen = true;

      const placeholder = frame.querySelector(".video-frame__placeholder");
      if (placeholder) placeholder.remove();
      frame.appendChild(iframe);
    });
  }

  /* ========================================================================
     Carrossel reutilizável
     ======================================================================== */
  class Gallery {
    constructor(root) {
      this.root = root;
      this.track = root.querySelector(".gallery__track");
      this.slides = Array.from(root.querySelectorAll(".gallery__slide"));
      this.prevBtn = root.querySelector(".gallery__arrow--prev");
      this.nextBtn = root.querySelector(".gallery__arrow--next");
      this.dotsContainer = root.querySelector(".gallery__dots");
      this.currentIndex = 0;
      this.autoplayDelay = 5000;
      this.autoplayTimer = null;
      this.reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      const aspect = root.getAttribute("data-aspect");
      if (aspect) {
        root.style.setProperty("--gallery-aspect", aspect.replace("/", " / "));
      }

      if (this.slides.length <= 1) {
        if (this.prevBtn) this.prevBtn.hidden = true;
        if (this.nextBtn) this.nextBtn.hidden = true;
        return;
      }

      this.buildDots();
      this.bindEvents();
      this.goTo(0);
      if (!this.reducedMotion) this.startAutoplay();
    }

    buildDots() {
      if (!this.dotsContainer) return;
      this.dots = this.slides.map((_, i) => {
        const dot = document.createElement("button");
        dot.type = "button";
        dot.className = "gallery__dot";
        dot.setAttribute("role", "tab");
        dot.setAttribute("aria-label", `Ir para a foto ${i + 1}`);
        dot.addEventListener("click", () => {
          this.goTo(i);
          this.restartAutoplay();
        });
        this.dotsContainer.appendChild(dot);
        return dot;
      });
    }

    bindEvents() {
      if (this.prevBtn) {
        this.prevBtn.addEventListener("click", () => {
          this.prev();
          this.restartAutoplay();
        });
      }
      if (this.nextBtn) {
        this.nextBtn.addEventListener("click", () => {
          this.next();
          this.restartAutoplay();
        });
      }

      this.root.addEventListener("keydown", (e) => {
        if (e.key === "ArrowLeft") {
          this.prev();
          this.restartAutoplay();
        } else if (e.key === "ArrowRight") {
          this.next();
          this.restartAutoplay();
        }
      });

      // Touch / pointer swipe
      let startX = 0;
      let currentX = 0;
      let isDragging = false;
      const viewport = this.root.querySelector(".gallery__viewport");

      viewport.addEventListener("pointerdown", (e) => {
        isDragging = true;
        startX = e.clientX;
        currentX = startX;
      });

      viewport.addEventListener("pointermove", (e) => {
        if (!isDragging) return;
        currentX = e.clientX;
      });

      const endDrag = () => {
        if (!isDragging) return;
        isDragging = false;
        const delta = currentX - startX;
        const threshold = 40;
        if (delta > threshold) {
          this.prev();
          this.restartAutoplay();
        } else if (delta < -threshold) {
          this.next();
          this.restartAutoplay();
        }
      };

      viewport.addEventListener("pointerup", endDrag);
      viewport.addEventListener("pointercancel", endDrag);
      viewport.addEventListener("pointerleave", endDrag);

      this.root.addEventListener("mouseenter", () => this.stopAutoplay());
      this.root.addEventListener("mouseleave", () => {
        if (!this.reducedMotion) this.startAutoplay();
      });
      this.root.addEventListener("focusin", () => this.stopAutoplay());
      this.root.addEventListener("focusout", () => {
        if (!this.reducedMotion) this.startAutoplay();
      });
    }

    goTo(index) {
      const total = this.slides.length;
      this.currentIndex = (index + total) % total;
      this.track.style.transform = `translateX(-${this.currentIndex * 100}%)`;
      if (this.dots) {
        this.dots.forEach((dot, i) => {
          dot.setAttribute("aria-selected", i === this.currentIndex ? "true" : "false");
        });
      }
    }

    next() {
      this.goTo(this.currentIndex + 1);
    }

    prev() {
      this.goTo(this.currentIndex - 1);
    }

    startAutoplay() {
      this.stopAutoplay();
      this.autoplayTimer = setInterval(() => this.next(), this.autoplayDelay);
    }

    stopAutoplay() {
      if (this.autoplayTimer) {
        clearInterval(this.autoplayTimer);
        this.autoplayTimer = null;
      }
    }

    restartAutoplay() {
      if (!this.reducedMotion) this.startAutoplay();
    }
  }

  function setupGalleries() {
    document.querySelectorAll("[data-gallery]").forEach((el) => new Gallery(el));
  }

  /* ========================================================================
     Inicialização
     ======================================================================== */
  document.addEventListener("DOMContentLoaded", () => {
    setupLinks();
    setupVideos();
    setupGalleries();
  });
})();
