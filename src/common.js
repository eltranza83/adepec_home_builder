// Shared logic for Theme, Custom Cursor, and Lightbox

/**
 * Initializes Theme Toggle
 */
export function initTheme() {
  const themeBtn = document.getElementById("theme-btn");
  
  // Set initial theme
  const savedTheme = localStorage.getItem("theme") || "dark";
  document.documentElement.setAttribute("data-theme", savedTheme);

  if (themeBtn) {
    themeBtn.addEventListener("click", () => {
      const currentTheme = document.documentElement.getAttribute("data-theme") || "dark";
      const newTheme = currentTheme === "dark" ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", newTheme);
      localStorage.setItem("theme", newTheme);
    });
  }
}

/**
 * Initializes Premium Custom Cursor (handles touch/mobile & reduced-motion fallback)
 */
export function initCustomCursor() {
  const cursor = document.getElementById("custom-cursor");
  const cursorOutline = document.getElementById("custom-cursor-outline");

  if (!cursor && !cursorOutline) return;

  // Accessibility Check: Disables custom cursor physics/rendering for touch devices & prefers-reduced-motion
  const isTouchDevice = window.matchMedia("(pointer: coarse)").matches || window.matchMedia("(hover: none)").matches;
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (isTouchDevice || prefersReducedMotion) {
    if (cursor) cursor.style.display = "none";
    if (cursorOutline) cursorOutline.style.display = "none";
    document.body.classList.add("disable-custom-cursor");
    return;
  }

  let mouse = { x: -100, y: -100 }; // Keep cursor off-screen initially
  let cursorPositions = { x: -100, y: -100 };
  let outlinePositions = { x: -100, y: -100 };
  let animationFrameId = null;

  window.addEventListener("mousemove", (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  function lerp(start, end, amt) {
    return (1 - amt) * start + amt * end;
  }

  function animateCursor() {
    // Inner dot - fast tracking
    if (cursor) {
      cursorPositions.x = lerp(cursorPositions.x, mouse.x, 0.3);
      cursorPositions.y = lerp(cursorPositions.y, mouse.y, 0.3);
      cursor.style.left = `${cursorPositions.x}px`;
      cursor.style.top = `${cursorPositions.y}px`;
    }

    // Outer outline - slow trailing (lerp)
    if (cursorOutline) {
      outlinePositions.x = lerp(outlinePositions.x, mouse.x, 0.12);
      outlinePositions.y = lerp(outlinePositions.y, mouse.y, 0.12);
      cursorOutline.style.left = `${outlinePositions.x}px`;
      cursorOutline.style.top = `${outlinePositions.y}px`;
    }

    animationFrameId = requestAnimationFrame(animateCursor);
  }
  
  animateCursor();

  // Hover States for Interactive Elements
  setupHoverEffects();
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
