import { initTheme, initNavMenu, initCopyrightYear } from "./common.js";

document.addEventListener("DOMContentLoaded", () => {
  // 1. Initialize Common/Shared UI Features
  initTheme();
  initNavMenu();
  initCopyrightYear();

  // 2. Element Selectors for Landing Page
  const loader = document.getElementById("loader");
  const loaderContent = document.getElementById("loader-content");
  const heroTag = document.querySelector(".hero-tag");
  const heroTitleSpans = document.querySelectorAll("#hero-title span");
  const heroFooter = document.getElementById("hero-footer");
  const heroImg = document.getElementById("hero-img");

  // 3. Intro Loader Sequence (Option 1: Refined Logo Curtain)
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

    // 1. Logo & expanding lines reveal
    setTimeout(() => {
      if (loaderContent) loaderContent.classList.add("active");
    }, 50);

    // 2. Slide up curtain into the ceiling (~0.45s snappy intro)
    setTimeout(() => {
      if (loader) loader.classList.add("loaded");
    }, 450);

    // 3. Reveal hero elements in smooth choreography
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
      if (heroImg) {
        heroImg.style.transition = "transform 1.4s cubic-bezier(0.16, 1, 0.3, 1)";
        heroImg.style.transform = "translate3d(0, 0, 0) scale(1.1)";
      }
    }, 550);
  };
  runIntro();

  // 4. Scroll Reveal Animations using IntersectionObserver
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

  // 5. Prevent map links click event from bubbling
  document.querySelectorAll(".map-link").forEach(link => {
    link.addEventListener("click", (e) => {
      e.stopPropagation();
    });
  });

  // 6. Hero Parallax Scroll Effect
  function updateParallax() {
    if (heroImg) {
      heroImg.style.transform = `translate3d(0, ${window.scrollY * 0.35}px, 0) scale(1.1)`;
    }
  }

  // Bind to scroll events with requestAnimationFrame (only if not prefers-reduced-motion)
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!prefersReducedMotion && heroImg) {
    window.addEventListener("scroll", () => {
      requestAnimationFrame(updateParallax);
    }, { passive: true });
  }

  // 6b. Auto-select inquiry dropdown (?interest=...) and property CTA pre-fill
  const interestSelect = document.getElementById("interest-select");
  if (interestSelect) {
    const urlInterest = new URLSearchParams(window.location.search).get("interest");
    if (urlInterest) {
      interestSelect.value = urlInterest;
    }

    document.querySelectorAll(".prop-inquire-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const interest = btn.getAttribute("data-interest");
        if (interest) {
          interestSelect.value = interest;
        }
      });
    });
  }

  // 7. Contact Form Handling
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
          submitBtn.textContent = "Send message";
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
});
