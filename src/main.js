document.addEventListener("DOMContentLoaded", () => {
  // Elements
  const cursor = document.getElementById("custom-cursor");
  const cursorOutline = document.getElementById("custom-cursor-outline");
  const loader = document.getElementById("loader");
  const loaderText = document.getElementById("loader-text");
  const heroTitleSpans = document.querySelectorAll("#hero-title span");
  const heroFooter = document.getElementById("hero-footer");
  const menuBtn = document.getElementById("menu-btn");
  const menuOverlay = document.getElementById("menu-overlay");
  const menuBtnText = document.getElementById("menu-btn-text");
  const heroImg = document.getElementById("hero-img");
  const philosophyImg = document.querySelector(".philosophy-img img");
  
  // Custom Cursor Physics & Tracking
  let mouse = { x: 0, y: 0 };
  let cursorPositions = { x: 0, y: 0 };
  let outlinePositions = { x: 0, y: 0 };
  
  window.addEventListener("mousemove", (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  // Lerp function for custom cursor easing
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

    requestAnimationFrame(animateCursor);
  }
  requestAnimationFrame(animateCursor);

  // Hover States for Custom Cursor
  const setupHoverEffects = () => {
    const hoverElements = document.querySelectorAll(".link-hover, a, button");
    hoverElements.forEach(el => {
      el.addEventListener("mouseenter", () => {
        document.body.classList.add("hovering-link");
      });
      el.addEventListener("mouseleave", () => {
        document.body.classList.remove("hovering-link");
      });
    });
  };
  setupHoverEffects();

  // Theme Toggle Logic
  const themeBtn = document.getElementById("theme-btn");
  if (themeBtn) {
    themeBtn.addEventListener("click", () => {
      const currentTheme = document.documentElement.getAttribute("data-theme") || "dark";
      const newTheme = currentTheme === "dark" ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", newTheme);
      localStorage.setItem("theme", newTheme);
    });
  }

  // Intro Loader Sequence
  const runIntro = () => {
    // Check if intro has already been run in this session
    if (sessionStorage.getItem("introPlayed")) {
      if (loader) loader.style.display = "none";
      if (heroTitleSpans) {
        heroTitleSpans.forEach(span => {
          span.style.transition = "none";
          span.classList.add("revealed");
        });
      }
      if (heroFooter) {
        heroFooter.style.transition = "none";
        heroFooter.classList.add("revealed");
      }
      if (heroImg) {
        heroImg.style.transition = "none";
        heroImg.style.transform = "translate3d(0, 0, 0) scale(1.1)";
      }
      return;
    }

    // Set item in sessionStorage
    sessionStorage.setItem("introPlayed", "true");

    // Add class to change cursor color on dark splash screen
    document.body.classList.add("loader-active");

    // 1. Text reveals
    setTimeout(() => {
      if (loaderText) loaderText.classList.add("active");
    }, 100);

    // 2. Slide up loader and fade out text
    setTimeout(() => {
      if (loader) loader.classList.add("loaded");
      if (loaderText) loaderText.classList.remove("active");
      document.body.classList.remove("loader-active");
    }, 2000);

    // 3. Reveal hero elements
    setTimeout(() => {
      if (heroTitleSpans) {
        heroTitleSpans.forEach(span => span.classList.add("revealed"));
      }
      if (heroFooter) {
        heroFooter.classList.add("revealed");
      }
      // Scale down background image slightly for a camera zoom-out effect
      if (heroImg) {
        heroImg.style.transition = "transform 2s cubic-bezier(0.16, 1, 0.3, 1)";
        heroImg.style.transform = "translate3d(0, 0, 0) scale(1.1)";
      }
    }, 3000);
  };
  runIntro();

  // Fullscreen Navigation Menu Toggle
  if (menuBtn && menuOverlay && menuBtnText) {
    menuBtn.addEventListener("click", () => {
      const isOpen = menuOverlay.classList.toggle("open");
      menuBtn.classList.toggle("open");
      menuBtnText.textContent = isOpen ? "Close" : "Menu";
      
      // Toggle body scrolling
      document.body.style.overflow = isOpen ? "hidden" : "";
    });
  }

  // Close menu when navigation item is clicked
  const closeTriggers = document.querySelectorAll(".menu-close-trigger");
  if (closeTriggers && menuOverlay && menuBtn && menuBtnText) {
    closeTriggers.forEach(trigger => {
      trigger.addEventListener("click", () => {
        menuOverlay.classList.remove("open");
        menuBtn.classList.remove("open");
        menuBtnText.textContent = "Menu";
        document.body.style.overflow = "";
      });
    });
  }

  // Scroll Reveal Animations using IntersectionObserver
  const revealOptions = {
    threshold: 0.15,
    rootMargin: "0px 0px -50px 0px"
  };

  const scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("revealed");
        // Stop observing once animated
        scrollObserver.unobserve(entry.target);
      }
    });
  }, revealOptions);

  document.querySelectorAll(".reveal-on-scroll, .reveal-img-on-scroll").forEach(el => {
    scrollObserver.observe(el);
  });

  // Homepage Lightbox
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightbox-img");
  const lightboxCaption = document.getElementById("lightbox-caption");
  const lightboxClose = document.getElementById("lightbox-close");

  if (lightbox && lightboxImg) {
    document.querySelectorAll(".project-img-wrapper").forEach(wrapper => {
      wrapper.addEventListener("click", (e) => {
        e.stopPropagation();
        const img = wrapper.querySelector("img");
        if (img) {
          const card = wrapper.closest(".project-card");
          const titleEl = card ? card.querySelector(".project-title") : null;
          const caption = titleEl ? titleEl.textContent : "";
          
          lightboxImg.src = img.src;
          lightboxImg.alt = img.alt || caption;
          if (lightboxCaption) {
            let formattedCaption = caption;
            if (caption.includes("9908")) {
              formattedCaption = `${caption} &bull; <a href="https://maps.google.com/?q=9908+North+25th+Street,+McAllen,+Texas+78504" target="_blank" style="color: #C5A059; text-decoration: none; border-bottom: 1px solid; margin-left: 8px;" onclick="event.stopPropagation();">Open in Google Maps</a>`;
            } else if (caption.includes("9905")) {
              formattedCaption = `${caption} &bull; <a href="https://maps.google.com/?q=9905+North+25th+Street,+McAllen,+Texas+78504" target="_blank" style="color: #C5A059; text-decoration: none; border-bottom: 1px solid; margin-left: 8px;" onclick="event.stopPropagation();">Open in Google Maps</a>`;
            }
            lightboxCaption.innerHTML = formattedCaption;
          }
          lightbox.classList.add("open");
          document.body.style.overflow = "hidden";
        }
      });
    });

    const closeLightbox = () => {
      lightbox.classList.remove("open");
      if (menuOverlay && !menuOverlay.classList.contains("open")) {
        document.body.style.overflow = "";
      }
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
  }

  // Parallax Scroll Effect
  let scrollY = window.scrollY;

  function updateParallax() {
    scrollY = window.scrollY;

    // 1. Hero Image Parallax (moves slowly downwards)
    if (heroImg) {
      heroImg.style.transform = `translate3d(0, ${scrollY * 0.35}px, 0) scale(1.1)`;
    }

    // 2. Philosophy Image Parallax (moves inside relative to viewport)
    if (philosophyImg) {
      const rect = philosophyImg.parentElement.getBoundingClientRect();
      const isInViewport = rect.top < window.innerHeight && rect.bottom > 0;
      
      if (isInViewport) {
        const offset = (window.innerHeight - rect.top) * 0.12;
        philosophyImg.style.transform = `translate3d(0, ${-offset}px, 0) scale(1.05)`;
      }
    }
  }

  // Bind to scroll events with requestAnimationFrame
  window.addEventListener("scroll", () => {
    requestAnimationFrame(updateParallax);
  }, { passive: true });
});
