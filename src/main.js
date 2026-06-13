const projectsData = {
  residence2621: {
    title: "Elegant Residence",
    location: "McAllen, Texas",
    specs: {
      architect: "Adepec Homes",
      area: "3,200 Sq Ft",
      beds: "4 Bedrooms",
      baths: "3 Bathrooms",
      status: "Sold"
    },
    tagline: "A clean stucco and white stone sanctuary with bespoke entry details.",
    description: "Residence 2621 embodies the clean lines of modern suburban luxury. With an open floor plan emphasizing double-height ceilings and marble-look polished floors, the home offers a bright, airy sanctuary. Features include a bespoke double-door entryway, custom coffered ceilings, and a massive kitchen suite opening to the main family quarters.",
    images: [
      "/assets/foyer.jpg",
      "/assets/kitchen.jpg",
      "/assets/bathroom_1.jpg"
    ]
  },
  residence4704: {
    title: "Modern Retreat",
    location: "McAllen, Texas",
    specs: {
      architect: "Adepec Homes",
      area: "3,500 Sq Ft",
      beds: "4 Bedrooms",
      baths: "3.5 Bathrooms",
      status: "Sold"
    },
    tagline: "Elevated modern kitchen suites and private wet baths.",
    description: "Residence 4704 focuses on interior choreography. The heart of the home is a spacious culinary suite featuring cobalt-blue cabinetry, quartz countertops, and designer pendant lights. The private bath suite is designed as a geometric sanctuary, boasting floating double vanities and an glass-enclosed pentagonal wet shower.",
    images: [
      "/assets/living_kitchen_open.jpg",
      "/assets/living_room.jpg",
      "/assets/bathroom_2.jpg"
    ]
  }
};

document.addEventListener("DOMContentLoaded", () => {
  // Elements
  const cursor = document.getElementById("custom-cursor");
  const cursorOutline = document.getElementById("custom-cursor-outline");
  const loader = document.getElementById("loader");
  const loaderText = document.getElementById("loader-text");
  const loaderBar = document.getElementById("loader-bar");
  const heroTitleSpans = document.querySelectorAll("#hero-title span");
  const heroFooter = document.getElementById("hero-footer");
  const menuBtn = document.getElementById("menu-btn");
  const menuOverlay = document.getElementById("menu-overlay");
  const menuBtnText = document.getElementById("menu-btn-text");
  
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
    cursorPositions.x = lerp(cursorPositions.x, mouse.x, 0.3);
    cursorPositions.y = lerp(cursorPositions.y, mouse.y, 0.3);
    cursor.style.left = `${cursorPositions.x}px`;
    cursor.style.top = `${cursorPositions.y}px`;

    // Outer outline - slow trailing (lerp)
    outlinePositions.x = lerp(outlinePositions.x, mouse.x, 0.12);
    outlinePositions.y = lerp(outlinePositions.y, mouse.y, 0.12);
    cursorOutline.style.left = `${outlinePositions.x}px`;
    cursorOutline.style.top = `${outlinePositions.y}px`;

    requestAnimationFrame(animateCursor);
  }
  requestAnimationFrame(animateCursor);

  // Hover States for Custom Cursor
  const setupHoverEffects = () => {
    const hoverElements = document.querySelectorAll(".link-hover, a, button, .material-option");
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

  // Intro Loader Sequence
  const runIntro = () => {
    // Check if intro has already been run in this session
    if (sessionStorage.getItem("introPlayed")) {
      loader.style.display = "none";
      heroTitleSpans.forEach(span => {
        span.style.transition = "none";
        span.classList.add("revealed");
      });
      heroFooter.style.transition = "none";
      heroFooter.classList.add("revealed");
      const heroImg = document.getElementById("hero-img");
      if (heroImg) {
        heroImg.style.transition = "none";
        heroImg.style.transform = "scale(1)";
      }
      return;
    }

    // Set item in sessionStorage
    sessionStorage.setItem("introPlayed", "true");

    // Add class to change cursor color on dark splash screen
    document.body.classList.add("loader-active");

    // 1. Text reveals
    setTimeout(() => {
      loaderText.classList.add("active");
      loaderBar.style.width = "100%";
    }, 100);

    // 2. Slide up loader and fade out text
    setTimeout(() => {
      loader.classList.add("loaded");
      loaderText.classList.remove("active");
      document.body.classList.remove("loader-active");
    }, 2000);

    // 3. Reveal hero elements
    setTimeout(() => {
      heroTitleSpans.forEach(span => span.classList.add("revealed"));
      heroFooter.classList.add("revealed");
      // Scale down background image slightly for a camera zoom-out effect
      const heroImg = document.getElementById("hero-img");
      if (heroImg) heroImg.style.transform = "scale(1)";
    }, 3000);
  };
  runIntro();

  // Fullscreen Navigation Menu Toggle
  menuBtn.addEventListener("click", () => {
    const isOpen = menuOverlay.classList.toggle("open");
    menuBtn.classList.toggle("open");
    menuBtnText.textContent = isOpen ? "Close" : "Menu";
    
    // Toggle body scrolling
    document.body.style.overflow = isOpen ? "hidden" : "";
  });

  // Close menu when navigation item is clicked
  const closeTriggers = document.querySelectorAll(".menu-close-trigger");
  closeTriggers.forEach(trigger => {
    trigger.addEventListener("click", () => {
      menuOverlay.classList.remove("open");
      menuBtn.classList.remove("open");
      menuBtnText.textContent = "Menu";
      document.body.style.overflow = "";
    });
  });

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

  // Interactive Material Configurator
  const materialOptions = document.querySelectorAll(".material-option");
  const configLayers = document.querySelectorAll(".config-image-layer");

  materialOptions.forEach(opt => {
    opt.addEventListener("click", () => {
      // Deactivate other selectors
      materialOptions.forEach(el => el.classList.remove("active"));
      // Activate clicked one
      opt.classList.add("active");

      const material = opt.getAttribute("data-material");

      // Cross-fade image layers
      configLayers.forEach(layer => {
        if (layer.id === `layer-${material}`) {
          layer.classList.add("active");
        } else {
          layer.classList.remove("active");
        }
      });
    });
  });

  // Showcase Project Details Lightbox Modal
  const projectCards = document.querySelectorAll(".project-card");
  const modal = document.getElementById("project-modal");
  const modalContent = document.getElementById("modal-content");
  const modalClose = document.getElementById("modal-close");

  projectCards.forEach(card => {
    card.addEventListener("click", (e) => {
      const projectKey = card.getAttribute("data-project");
      const project = projectsData[projectKey];

      if (project) {
        e.preventDefault();
        // Build modal layout dynamically
        modalContent.innerHTML = `
          <div class="modal-header">
            <span class="section-tag">${project.location}</span>
            <h2>${project.title}</h2>
            <p class="highlight-p" style="margin-top: 15px; max-width: 800px;">${project.tagline}</p>
          </div>

          <div class="modal-meta-grid">
            <div class="modal-meta-item">
              <h4>Architect</h4>
              <p>${project.specs.architect}</p>
            </div>
            <div class="modal-meta-item">
              <h4>Area</h4>
              <p>${project.specs.area}</p>
            </div>
            <div class="modal-meta-item">
              <h4>Details</h4>
              <p>${project.specs.beds} / ${project.specs.baths}</p>
            </div>
            <div class="modal-meta-item">
              <h4>Status</h4>
              <p>${project.specs.status}</p>
            </div>
          </div>

          <div class="modal-desc-cols">
            <div>
              <p>${project.description}</p>
            </div>
            <div style="color: var(--color-text-muted);">
              <p>Every Adepec Homes residence is engineered for environmental performance, utilizing intelligent solar orientation, geothermal cooling, and sustainable timber supply chains.</p>
            </div>
          </div>

          <div class="modal-gallery">
            <div class="modal-gallery-img">
              <img src="${project.images[0]}" alt="${project.title} Render 1">
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px;">
              <div class="modal-gallery-img" style="aspect-ratio: 1/1;">
                <img src="${project.images[1]}" alt="${project.title} Render 2">
              </div>
              <div class="modal-gallery-img" style="aspect-ratio: 1/1;">
                <img src="${project.images[2]}" alt="${project.title} Render 3">
              </div>
            </div>
          </div>
        `;

        // Open Modal
        modal.classList.add("open");
        document.body.style.overflow = "hidden";
        
        // Re-setup hover effects for dynamically added elements inside modal
        setupHoverEffects();
      }
    });
  });

  modalClose.addEventListener("click", () => {
    modal.classList.remove("open");
    // Only restore body overflow if navigation menu is not open
    if (!menuOverlay.classList.contains("open")) {
      document.body.style.overflow = "";
    }
  });

  // Close modal on escape key
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("open")) {
      modal.classList.remove("open");
      if (!menuOverlay.classList.contains("open")) {
        document.body.style.overflow = "";
      }
    }
  });
});
