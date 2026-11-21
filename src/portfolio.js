import { initTheme, initCustomCursor, initLightbox, setupHoverEffects, initNavMenu } from "./common.js";
import { portfolioData } from "./data/portfolio.js";

document.addEventListener("DOMContentLoaded", () => {
  // 1. Initialize Common/Shared UI Features
  initTheme();
  initCustomCursor();
  initNavMenu();
  const openLightbox = initLightbox();

  // 2. Render Portfolio Sections
  const container = document.getElementById("portfolio-container");
  if (!container) return;

  renderPortfolio(container);

  // 3. Initialize Carousel Navigation Arrows (One-by-one card scroll)
  initPortfolioCarousels();

  // 4. Initialize Lightbox clicks for all interactive images
  initPortfolioLightbox(openLightbox);

  // 4. Initialize Scroll Reveals
  initScrollObserver();

  // 5. Setup cursor hover bindings on newly generated elements
  setupHoverEffects();

  // 6. Handle hash scroll on initial load
  if (window.location.hash) {
    setTimeout(() => {
      let targetId = window.location.hash.substring(1);
      if (targetId === "current-projects-9905" && !document.getElementById(targetId)) {
        targetId = "now-available-9905";
      }
      const targetElement = document.getElementById(targetId);
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 350);
  }
});

/**
 * Generates the clean architectural layout for the portfolio sections
 */
function renderPortfolio(container) {
  const activeHomes = portfolioData.filter(home => home.hasSpecs);
  const soldHomes = portfolioData.filter(home => !home.hasSpecs);

  let htmlContent = "";

  // 1. Active Residences (Warm Limestone Gallery Canvas)
  activeHomes.forEach(home => {
    const isAvailable = home.id.includes("now-available") || home.tagline === "Now Available";
    const statusDotClass = isAvailable ? "available-dot" : "construction-dot";
    const statusText = isAvailable ? "Move-In Ready · Falcon's Cove" : "Under Construction (Q4 2026) · Falcon's Cove";

    htmlContent += `
    <section class="portfolio-home-section" id="${home.id}">
      <div class="home-section-header reveal-on-scroll">
        <span class="section-tag">${home.tagline} &middot; Falcon's Cove</span>
        <h2>${home.title}</h2>
        <p>${home.description}</p>
      </div>

      <!-- Main Elevation Presentation Card (Clean, Unobstructed Architectural View) -->
      <div class="portfolio-elevation-card reveal-on-scroll">
        <div class="portfolio-img-frame link-hover portfolio-lightbox-trigger"
             data-home-id="${home.id}"
             data-img-index="0"
             data-img="${home.elevationImage.src}"
             data-alt="${home.elevationImage.alt}"
             data-caption="${home.elevationImage.caption}"
             data-map-url="${home.mapUrl || ''}">
          <img src="${home.elevationImage.src}" alt="${home.elevationImage.alt}" style="${home.elevationImage.style || ''}">
          <div class="portfolio-zoom-hint">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/></svg>
            <span>Click to Enlarge</span>
          </div>
        </div>
        <div class="portfolio-elevation-details">
          <div class="card-meta-top">
            <span class="card-status-label"><span class="status-dot ${statusDotClass}">●</span> ${statusText}</span>
            ${home.specs.price ? `<span class="card-price">${home.specs.price}</span>` : ''}
          </div>
          <div class="card-specs-bar" aria-label="Property specifications">
            <span class="spec-item">
              <svg class="spec-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path d="M2 20v-8a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v8"/>
                <path d="M4 10V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v4"/>
                <path d="M12 4v6"/>
                <path d="M2 18h20"/>
              </svg>
              ${home.specs.beds}
            </span>
            <span class="spec-item">
              <svg class="spec-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path d="M9 6 6.5 3.5a1.5 1.5 0 0 0-1-.5C4.683 3 4 3.683 4 4.5V17a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-5"/>
                <line x1="10" x2="8" y1="5" y2="7"/>
                <line x1="2" x2="22" y1="12" y2="12"/>
                <line x1="7" x2="7" y1="19" y2="21"/>
                <line x1="17" x2="17" y1="19" y2="21"/>
              </svg>
              ${home.specs.baths}
            </span>
            <span class="spec-item">
              <svg class="spec-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path d="M21.3 15.3a2.4 2.4 0 0 1 0 3.4l-2.6 2.6a2.4 2.4 0 0 1-3.4 0L2.7 8.7a2.41 2.41 0 0 1 0-3.4l2.6-2.6a2.41 2.41 0 0 1 3.4 0Z"/>
                <path d="m14.5 12.5 2-2"/>
                <path d="m11.5 9.5 2-2"/>
                <path d="m8.5 6.5 2-2"/>
                <path d="m17.5 15.5 2-2"/>
              </svg>
              ${home.specs.livingShort}
            </span>
          </div>
          <div class="portfolio-elevation-actions">
            ${home.mapUrl ? `
            <a href="${home.mapUrl}" target="_blank" rel="noopener noreferrer" class="card-map-link link-hover">
              <svg class="map-icon" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5-2.5 2.5z"/></svg>
              <span>View Map</span>
            </a>` : ''}
            <a href="index.html#gallery-contact" class="portfolio-inquire-link link-hover">Inquire About This Home &rarr;</a>
          </div>
        </div>
      </div>

      <!-- Carousel Row of Interior Details (If carousel exists) -->
      ${home.carouselImages ? `
      <div class="portfolio-carousel-wrapper reveal-on-scroll">
        <button class="carousel-arrow prev link-hover" aria-label="Previous photo">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M15 18l-6-6 6-6"/></svg>
        </button>
        <div class="portfolio-carousel-track">
          ${home.carouselImages.map((img, idx) => `
          <div class="portfolio-carousel-card portfolio-lightbox-trigger"
               data-home-id="${home.id}"
               data-img-index="${idx + 1}"
               data-img="${img.src}"
               data-alt="${img.alt}"
               data-caption="${img.caption}">
            <div class="carousel-frame link-hover">
              <img src="${img.src}" alt="${img.alt}" loading="lazy">
            </div>
            <div class="carousel-details">
              <h4>${img.label}</h4>
              <span>${img.sublabel}</span>
            </div>
          </div>
          `).join('')}
        </div>
        <button class="carousel-arrow next link-hover" aria-label="Next photo">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M9 18l6-6-6-6"/></svg>
        </button>
      </div>
      ` : ''}

      <!-- Specifications & Features Grid -->
      <div class="portfolio-specs-grid">
        <!-- Specs Card -->
        ${home.specs ? `
        <div class="build-specs-card reveal-on-scroll">
          <span class="section-tag">Specifications</span>
          <h4>Sizing &amp; Layout</h4>
          <table class="specs-table" style="margin-top: 0;">
            <tr><td>Total Slab Footprint</td><td><strong>${home.specs.slab}</strong></td></tr>
            <tr><td>Living Space Area</td><td>${home.specs.living}</td></tr>
            <tr><td>Garage Area</td><td>${home.specs.garage}</td></tr>
            <tr><td>Lot Size</td><td>${home.specs.lotSize}</td></tr>
            <tr><td>Room Layout</td><td>${home.specs.rooms}</td></tr>
            ${home.mapUrl ? `
            <tr>
              <td>Address</td>
              <td>
                <a href="${home.mapUrl}" target="_blank" rel="noopener noreferrer" class="specs-map-link link-hover">
                  ${home.specs.addressText}
                  <svg class="map-icon" style="margin-left: 2px;" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5-2.5 2.5z"/></svg>
                </a>
              </td>
            </tr>` : ''}
          </table>
        </div>
        ` : ''}

        <!-- Features Cards -->
        ${home.features ? home.features.map(feat => `
        <div class="build-specs-card reveal-on-scroll">
          <span class="section-tag">${feat.tagline}</span>
          <h4>${feat.title}</h4>
          <ul class="features-list" style="margin-top: 0;">
            ${feat.items.map(item => `<li>${item}</li>`).join('')}
          </ul>
        </div>
        `).join('') : ''}
      </div>
    </section>
    `;
  });

  // 2. Sold Legacy Showcase (Dark Architectural Canvas)
  htmlContent += `
  <section class="sold-showcase-section" id="crafted-legacy">
    <div class="sold-showcase-container">
      <div class="reveal-on-scroll">
        <span class="section-tag">Our Crafted Legacy</span>
        <h2>Signature <em>Completed Homes</em></h2>
        <p class="sold-intro">A showcase of past homes we’ve built—each designed with timeless style, natural light, and lasting finishes.</p>
      </div>

      ${soldHomes.map(home => `
      <div class="sold-home-block reveal-on-scroll" id="${home.id}">
        <div class="sold-home-title-bar">
          <div>
            <h3>${home.title}</h3>
            <p>${home.description}</p>
          </div>
          <span class="sold-pill">Sold</span>
        </div>

        <div class="sold-grid">
          ${home.gridImages.map((img, idx) => `
          <div class="sold-photo-card portfolio-lightbox-trigger"
               data-home-id="${home.id}"
               data-img-index="${idx}"
               data-img="${img.src}"
               data-alt="${img.alt}"
               data-caption="${img.caption}">
            <div class="photo-frame link-hover">
              <img src="${img.src}" alt="${img.alt}" loading="lazy">
            </div>
            <div class="photo-caption">
              <h5>${img.label}</h5>
              <span class="sold-tag">${img.sublabel}</span>
            </div>
          </div>
          `).join('')}
        </div>
      </div>
      `).join('')}
    </div>
  </section>
  `;

  // 3. Bottom CTA Block linking back to main contact inquiry section
  htmlContent += `
  <section class="portfolio-bottom-cta reveal-on-scroll">
    <div class="portfolio-bottom-cta-inner">
      <span class="section-tag">Begin Your Journey</span>
      <h2>Ready to Build Your <em>Masterpiece?</em></h2>
      <p>Whether acquiring our move-in ready homes at Falcon’s Cove, reserving upcoming lots in Northwood Trails III, or building a custom home from the ground up, our team is ready to help.</p>
      <a href="index.html#gallery-contact" class="cta-button link-hover">
        Inquire With Our Architectural Team
        <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M8.14645 3.14645C8.34171 2.95118 8.65829 2.95118 8.85355 3.14645L12.8536 7.14645C13.0488 7.34171 13.0488 7.65829 12.8536 7.85355L8.85355 11.8536C8.65829 12.0488 8.34171 12.0488 8.14645 11.8536C7.95118 11.6583 7.95118 11.3417 8.14645 11.1464L11.2929 8H2.5C2.22386 8 2 7.77614 2 7.5C2 7.22386 2.22386 7 2.5 7H11.2929L8.14645 3.85355C7.95118 3.65829 7.95118 3.34171 8.14645 3.14645Z" fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"/>
        </svg>
      </a>
    </div>
  </section>
  `;

  container.innerHTML = htmlContent;
}

// Global home image collections for lightbox multi-image browsing
const homeGalleries = {};

portfolioData.forEach(home => {
  const images = [];
  if (home.elevationImage) {
    images.push({
      src: home.elevationImage.src,
      alt: home.elevationImage.alt,
      caption: home.elevationImage.caption,
      mapUrl: home.mapUrl || null
    });
  }
  if (home.carouselImages) {
    home.carouselImages.forEach(img => {
      images.push({
        src: img.src,
        alt: img.alt,
        caption: img.caption,
        mapUrl: null
      });
    });
  }
  if (home.gridImages) {
    home.gridImages.forEach(img => {
      images.push({
        src: img.src,
        alt: img.alt,
        caption: img.caption,
        mapUrl: null
      });
    });
  }
  homeGalleries[home.id] = images;
});

/**
 * Initializes carousel navigation arrows to scroll one photo at a time
 */
function initPortfolioCarousels() {
  document.querySelectorAll(".portfolio-carousel-wrapper").forEach(wrapper => {
    const track = wrapper.querySelector(".portfolio-carousel-track");
    const prevBtn = wrapper.querySelector(".carousel-arrow.prev");
    const nextBtn = wrapper.querySelector(".carousel-arrow.next");

    if (!track || !prevBtn || !nextBtn) return;

    const getScrollStep = () => {
      const firstCard = track.querySelector(".portfolio-carousel-card");
      if (!firstCard) return 320;
      const cardWidth = firstCard.getBoundingClientRect().width;
      return cardWidth + 20; // 1 card width + 20px gap
    };

    nextBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      track.scrollBy({ left: getScrollStep(), behavior: "smooth" });
    });

    prevBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      track.scrollBy({ left: -getScrollStep(), behavior: "smooth" });
    });
  });
}

/**
 * Attaches Lightbox events to triggers and prevents click bubbling on links
 */
function initPortfolioLightbox(openLightbox) {
  document.querySelectorAll(".portfolio-lightbox-trigger").forEach(trigger => {
    trigger.addEventListener("click", () => {
      const homeId = trigger.getAttribute("data-home-id");
      const imgIndex = parseInt(trigger.getAttribute("data-img-index") || "0", 10);
      const gallery = homeGalleries[homeId];

      if (gallery && gallery.length > 0) {
        openLightbox(gallery, imgIndex);
      } else {
        const imgSrc = trigger.getAttribute("data-img") || (trigger.querySelector("img") ? trigger.querySelector("img").src : "");
        const imgAlt = trigger.getAttribute("data-alt") || "";
        const caption = trigger.getAttribute("data-caption") || "";
        const mapUrl = trigger.getAttribute("data-map-url") || null;
        if (imgSrc) {
          openLightbox(imgSrc, imgAlt, caption, mapUrl);
        }
      }
    });
  });

  document.querySelectorAll(".card-map-link, .specs-map-link, .portfolio-inquire-link, .cta-button, .carousel-arrow").forEach(link => {
    link.addEventListener("click", (e) => {
      e.stopPropagation();
    });
  });
}

/**
 * Hooks scroll reveals on newly generated DOM
 */
function initScrollObserver() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("revealed");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -50px 0px" });

  document.querySelectorAll(".reveal-on-scroll").forEach(el => observer.observe(el));
}
