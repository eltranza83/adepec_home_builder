import { initTheme, initCustomCursor, initLightbox, setupHoverEffects } from "./common.js";

document.addEventListener("DOMContentLoaded", () => {
  // 1. Initialize Common/Shared UI Features
  initTheme();
  initCustomCursor();
  const openLightbox = initLightbox();

  // 2. Element Selectors for Landing Page
  const loader = document.getElementById("loader");
  const loaderText = document.getElementById("loader-text");
  const heroTag = document.querySelector(".hero-tag");
  const heroTitleSpans = document.querySelectorAll("#hero-title span");
  const heroFooter = document.getElementById("hero-footer");
  const menuBtn = document.getElementById("menu-btn");
  const menuOverlay = document.getElementById("menu-overlay");
  const menuBtnText = document.getElementById("menu-btn-text");
  const heroImg = document.getElementById("hero-img");
  const philosophyImg = document.querySelector(".philosophy-img img");

  // 3. Intro Loader Sequence
  const runIntro = () => {
    // Check if intro has already been run in this session
    if (sessionStorage.getItem("introPlayed")) {
      if (loader) loader.style.display = "none";
      if (heroTag) {
        heroTag.style.transition = "none";
        heroTag.classList.add("revealed");
      }
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

    // Text reveals
    setTimeout(() => {
      if (loaderText) loaderText.classList.add("active");
    }, 100);

    // Slide up loader and fade out text
    setTimeout(() => {
      if (loader) loader.classList.add("loaded");
      if (loaderText) loaderText.classList.remove("active");
      document.body.classList.remove("loader-active");
    }, 2000);

    // Reveal hero elements
    setTimeout(() => {
      if (heroTag) {
        heroTag.classList.add("revealed");
      }
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

  // 4. Fullscreen Navigation Menu Toggle
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

  // 5. Scroll Reveal Animations using IntersectionObserver
  const revealOptions = {
    threshold: 0.15,
    rootMargin: "0px 0px -50px 0px"
  };

  const scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("revealed");
        scrollObserver.unobserve(entry.target);
      }
    });
  }, revealOptions);

  document.querySelectorAll(".reveal-on-scroll, .reveal-img-on-scroll").forEach(el => {
    scrollObserver.observe(el);
  });

  // 6. Homepage Project Cards Lightbox Binding
  document.querySelectorAll(".project-img-wrapper").forEach(wrapper => {
    wrapper.addEventListener("click", (e) => {
      e.stopPropagation();
      const img = wrapper.querySelector("img");
      if (img) {
        const card = wrapper.closest(".project-card");
        const titleEl = card ? card.querySelector(".project-title") : null;
        const captionText = titleEl ? titleEl.textContent : "";
        const mapUrl = card ? card.dataset.mapUrl : null;
        
        openLightbox(img.src, img.alt || captionText, captionText, mapUrl);
      }
    });
  });

  // Prevent map links click event from bubble-triggering lightbox
  document.querySelectorAll(".map-link").forEach(link => {
    link.addEventListener("click", (e) => {
      e.stopPropagation();
    });
  });

  // 7. Parallax Scroll Effect
  let scrollY = window.scrollY;

  function updateParallax() {
    scrollY = window.scrollY;

    // Hero Image Parallax (moves slowly downwards)
    if (heroImg) {
      heroImg.style.transform = `translate3d(0, ${scrollY * 0.35}px, 0) scale(1.1)`;
    }

    // Philosophy Image Parallax (moves inside relative to viewport)
    if (philosophyImg) {
      const rect = philosophyImg.parentElement.getBoundingClientRect();
      const isInViewport = rect.top < window.innerHeight && rect.bottom > 0;
      
      if (isInViewport) {
        const offset = (window.innerHeight - rect.top) * 0.12;
        philosophyImg.style.transform = `translate3d(0, ${-offset}px, 0) scale(1.05)`;
      }
    }
  }

  // Bind to scroll events with requestAnimationFrame (only if not prefers-reduced-motion)
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!prefersReducedMotion) {
    window.addEventListener("scroll", () => {
      requestAnimationFrame(updateParallax);
    }, { passive: true });
  }

  // 8. Contact Form Handling
  const inquiryForm = document.getElementById("inquiry-form");
  const formStatus = document.getElementById("form-status");
  if (inquiryForm) {
    inquiryForm.addEventListener("submit", (e) => {
      e.preventDefault();
      
      const submitBtn = inquiryForm.querySelector('button[type="submit"]');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = "Transmitting...";
      }

      setTimeout(() => {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = "Send Inquiry";
        }
        
        if (formStatus) {
          formStatus.innerHTML = `
            <div class="form-status-content success">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
              <div>
                <strong>Inquiry Received</strong>
                <p>Thank you. An architectural advisor from Adepec Homes will contact you within 24 hours.</p>
              </div>
            </div>
          `;
          formStatus.style.display = "block";
        }

        inquiryForm.reset();

        // Smoothly hide notification after 8 seconds
        setTimeout(() => {
          if (formStatus) {
            formStatus.style.opacity = "0";
            setTimeout(() => {
              formStatus.style.display = "none";
              formStatus.style.opacity = "1";
              formStatus.innerHTML = "";
            }, 500);
          }
        }, 8000);
      }, 600);
    });
  }

  // 9. Pre-fill inquiry form when clicking enclave inquiry buttons
  document.querySelectorAll(".enclave-inquire-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const siteInput = document.getElementById("site");
      const messageInput = document.getElementById("message");
      if (siteInput) {
        siteInput.value = "Northwood Trails III, North McAllen";
        siteInput.dispatchEvent(new Event("input", { bubbles: true }));
      }
      if (messageInput && !messageInput.value) {
        messageInput.value = "I am interested in reserving an exclusive homesite in Northwood Trails III.";
        messageInput.dispatchEvent(new Event("input", { bubbles: true }));
      }
    });
  });
});
