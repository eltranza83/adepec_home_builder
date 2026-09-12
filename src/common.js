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

  if (!lightbox || !lightboxImg) return () => {};

  const closeLightbox = () => {
    lightbox.classList.remove("open");
    const menuOverlay = document.getElementById("menu-overlay");
    if (!menuOverlay || !menuOverlay.classList.contains("open")) {
      document.body.style.overflow = "";
    }
    // Remove hover override if open
    document.body.classList.remove("hovering-link");
  };

  if (lightboxClose) {
    lightboxClose.addEventListener("click", (e) => {
      e.stopPropagation();
      closeLightbox();
    });
  }

  lightbox.addEventListener("click", () => {
    closeLightbox();
  });

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && lightbox.classList.contains("open")) {
      closeLightbox();
    }
  });

  // Return the open function
  return function openLightbox(imgSrc, imgAlt, captionText, mapUrl = null) {
    lightboxImg.src = imgSrc;
    lightboxImg.alt = imgAlt || captionText || "";
    
    if (lightboxCaption) {
      lightboxCaption.innerHTML = ""; // Clear existing
      
      const textNode = document.createTextNode(captionText || "");
      lightboxCaption.appendChild(textNode);

      if (mapUrl) {
        const bulletNode = document.createElement("span");
        bulletNode.innerHTML = " &bull; ";
        
        const mapLink = document.createElement("a");
        mapLink.href = mapUrl;
        mapLink.target = "_blank";
        mapLink.textContent = "Open in Google Maps";
        mapLink.className = "map-link link-hover";
        mapLink.addEventListener("click", (e) => e.stopPropagation());
        
        // Setup mouse hover effects since this is dynamically created
        mapLink.addEventListener("mouseenter", () => document.body.classList.add("hovering-link"));
        mapLink.addEventListener("mouseleave", () => document.body.classList.remove("hovering-link"));

        lightboxCaption.appendChild(bulletNode);
        lightboxCaption.appendChild(mapLink);
      }
    }

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

