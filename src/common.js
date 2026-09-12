// Shared logic for Theme, Custom Cursor, and Lightbox

/**
 * Single Unified Theme (Dark Luxury Noir & Warm Limestone Gallery)
 */
export function initTheme() {
  localStorage.removeItem("theme");
  document.documentElement.setAttribute("data-theme", "dark");
}

/**
 * Initializes Premium Custom Cursor (handles touch/mobile & reduced-motion fallback)
 */
export function initCustomCursor() {
  const cursor = document.getElementById("custom-cursor");
  const cursorOutline = document.getElementById("custom-cursor-outline");

  if (cursor) cursor.remove();
  if (cursorOutline) cursorOutline.remove();
}

/**
 * Re-runs hover bindings on dynamic elements (needed after JS rendering)
 */
export function setupHoverEffects() {
  const hoverElements = document.querySelectorAll(".link-hover, a, button, .portfolio-item");
  hoverElements.forEach(el => {
    // Avoid double binding
    if (el.dataset.hoverBound) return;
    el.dataset.hoverBound = "true";

    el.addEventListener("mouseenter", () => {
      document.body.classList.add("hovering-link");
    });
    el.addEventListener("mouseleave", () => {
      document.body.classList.remove("hovering-link");
    });
  });
}

/**
 * Initializes Lightbox Logic and returns an openLightbox function
 */
export function initLightbox() {
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightbox-img");
  const lightboxCaption = document.getElementById("lightbox-caption");
  const lightboxClose = document.getElementById("lightbox-close");
  const lightboxPrev = document.getElementById("lightbox-prev");
  const lightboxNext = document.getElementById("lightbox-next");
  const lightboxCounter = document.getElementById("lightbox-counter");

  if (!lightbox || !lightboxImg) return () => {};

  let currentGallery = [];
  let currentIndex = 0;

  const updateLightboxContent = (index) => {
    if (!currentGallery.length) return;
    if (index < 0) index = currentGallery.length - 1;
    if (index >= currentGallery.length) index = 0;
    currentIndex = index;

    const item = currentGallery[currentIndex];
    lightboxImg.src = item.src;
    lightboxImg.alt = item.alt || item.caption || "";

    if (lightboxCaption) {
      lightboxCaption.innerHTML = "";
      const textNode = document.createTextNode(item.caption || "");
      lightboxCaption.appendChild(textNode);

      if (item.mapUrl) {
        const bulletNode = document.createElement("span");
        bulletNode.innerHTML = " &bull; ";

        const mapLink = document.createElement("a");
        mapLink.href = item.mapUrl;
        mapLink.target = "_blank";
        mapLink.textContent = "Open in Google Maps";
        mapLink.className = "map-link link-hover";
        mapLink.addEventListener("click", (e) => e.stopPropagation());

        mapLink.addEventListener("mouseenter", () => document.body.classList.add("hovering-link"));
        mapLink.addEventListener("mouseleave", () => document.body.classList.remove("hovering-link"));

        lightboxCaption.appendChild(bulletNode);
        lightboxCaption.appendChild(mapLink);
      }
    }

    if (lightboxCounter) {
      if (currentGallery.length > 1) {
        lightboxCounter.textContent = `${currentIndex + 1} / ${currentGallery.length}`;
        lightboxCounter.style.display = "block";
      } else {
        lightboxCounter.style.display = "none";
      }
    }

    if (lightboxPrev && lightboxNext) {
      if (currentGallery.length > 1) {
        lightboxPrev.style.display = "flex";
        lightboxNext.style.display = "flex";
      } else {
        lightboxPrev.style.display = "none";
        lightboxNext.style.display = "none";
      }
    }
  };

  const showNext = (e) => {
    if (e) e.stopPropagation();
    updateLightboxContent(currentIndex + 1);
  };

  const showPrev = (e) => {
    if (e) e.stopPropagation();
    updateLightboxContent(currentIndex - 1);
  };

  if (lightboxNext) lightboxNext.addEventListener("click", showNext);
  if (lightboxPrev) lightboxPrev.addEventListener("click", showPrev);

  const closeLightbox = () => {
    lightbox.classList.remove("open");
    const menuOverlay = document.getElementById("menu-overlay");
    if (!menuOverlay || !menuOverlay.classList.contains("open")) {
      document.body.style.overflow = "";
    }
    document.body.classList.remove("hovering-link");
  };

  if (lightboxClose) {
    lightboxClose.addEventListener("click", (e) => {
      e.stopPropagation();
      closeLightbox();
    });
  }

  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox || e.target === lightboxImg) {
      closeLightbox();
    }
  });

  window.addEventListener("keydown", (e) => {
    if (!lightbox.classList.contains("open")) return;
    if (e.key === "Escape") {
      closeLightbox();
    } else if (e.key === "ArrowRight") {
      showNext();
    } else if (e.key === "ArrowLeft") {
      showPrev();
    }
  });

  // Return the open function
  return function openLightbox(target, initialIndex = 0, captionText = null, mapUrl = null) {
    if (Array.isArray(target)) {
      currentGallery = target;
      currentIndex = typeof initialIndex === "number" ? initialIndex : 0;
    } else if (typeof target === "string") {
      currentGallery = [{
        src: target,
        alt: typeof initialIndex === "string" ? initialIndex : (captionText || ""),
        caption: captionText || "",
        mapUrl: mapUrl
      }];
      currentIndex = 0;
    }
    updateLightboxContent(currentIndex);
    lightbox.classList.add("open");
    document.body.style.overflow = "hidden";
  };
}

/**
 * Initializes Fullscreen Navigation Overlay & Hamburger Toggle
 */
export function initNavMenu() {
  const menuBtn = document.getElementById("menu-btn");
  const menuOverlay = document.getElementById("menu-overlay");
  const menuBtnText = document.getElementById("menu-btn-text");

  if (menuBtn && menuOverlay && menuBtnText) {
    menuBtn.addEventListener("click", () => {
      const isOpen = menuOverlay.classList.toggle("open");
      menuBtn.classList.toggle("open");
      menuBtnText.textContent = isOpen ? "Close" : "Menu";
      document.body.style.overflow = isOpen ? "hidden" : "";
    });

    const closeTriggers = document.querySelectorAll(".menu-close-trigger");
    closeTriggers.forEach(trigger => {
      trigger.addEventListener("click", () => {
        menuOverlay.classList.remove("open");
        menuBtn.classList.remove("open");
        menuBtnText.textContent = "Menu";
        document.body.style.overflow = "";
      });
    });
  }
}

