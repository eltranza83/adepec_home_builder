import { initTheme, initCustomCursor, initLightbox, setupHoverEffects } from "./common.js";
import { portfolioData } from "./data/portfolio.js";

document.addEventListener("DOMContentLoaded", () => {
  // 1. Initialize Common/Shared UI Features
  initTheme();
  initCustomCursor();
  const openLightbox = initLightbox();

  // 2. Render Portfolio Data
  const container = document.getElementById("portfolio-container");
  if (!container) return;

  renderPortfolio(container);

  // 3. Initialize Carousels for rendered elements
  initAllCarousels();

  // 4. Initialize Lightbox clicks
  initPortfolioLightbox(openLightbox);

  // 5. Initialize Scroll Reveals
  initScrollObserver();

  // 6. Setup cursor hover bindings on newly generated elements
  setupHoverEffects();
});

/**
 * Generates the HTML layout for the portfolio sections
 */
function renderPortfolio(container) {
  let htmlContent = "";

  portfolioData.forEach(home => {
    if (home.hasSpecs) {
      // Available or Under Construction build layout
      htmlContent += `
      <div class="portfolio-home-section" id="${home.id}">
        <div class="home-section-header reveal-on-scroll">
          <span class="section-tag">${home.tagline}</span>
          <h2>${home.title}</h2>
          <p>${home.description}</p>
        </div>
        
        <div class="portfolio-grid" style="row-gap: 20px;">
          <!-- Top: Large Front Elevation (Hero-style portfolio item) -->
          <div class="portfolio-item reveal-on-scroll" data-caption="${home.elevationImage.caption}" data-map-url="${home.mapUrl || ''}">
            <div class="img-wrap">
              <img src="${home.elevationImage.src}" alt="${home.elevationImage.alt}" style="${home.elevationImage.style || ''}">
              <div class="badge-container">
                <span class="status-badge">${home.elevationImage.badge}</span>
                ${home.mapUrl ? `
                <a href="${home.mapUrl}" target="_blank" class="map-link link-hover">
                  <svg class="map-icon" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
                  <span>View Map</span>
                </a>` : ''}
              </div>
              ${home.elevationImage.isRendering ? `<span class="rendering-badge">Concept Rendering</span>` : ''}
            </div>
            <div class="item-label">
              <h3>${home.elevationImage.label}</h3>
              <span>${home.elevationImage.sublabel}</span>
            </div>
          </div>

          <!-- Carousel Row of Details (If carousel exists) -->
          ${home.carouselImages ? `
          <div class="portfolio-carousel-wrapper reveal-on-scroll">
            <button class="carousel-arrow prev link-hover" aria-label="Previous image">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
            </button>
            <div class="portfolio-carousel-track">
              ${home.carouselImages.map(img => `
              <div class="portfolio-item reveal-on-scroll" data-caption="${img.caption}">
                <div class="img-wrap">
                  <img src="${img.src}" alt="${img.alt}" loading="lazy">
                </div>
                <div class="item-label">
                  <h3>${img.label}</h3>
                  <span>${img.sublabel}</span>
                </div>
              </div>
              `).join('')}
            </div>
            <button class="carousel-arrow next link-hover" aria-label="Next image">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </button>
          </div>
          ` : ''}
          
          <!-- Bottom Left Card: Specifications -->
          ${home.specs ? `
          <div class="build-specs-card reveal-on-scroll">
            <span class="section-tag">Specifications</span>
            <h4>Sizing & Layout</h4>
            <table class="specs-table" style="margin-top: 0;">
              <tr>
                <td>Total Slab Footprint</td>
                <td><strong>${home.specs.slab}</strong></td>
              </tr>
              <tr>
                <td>Living Space Area</td>
                <td>${home.specs.living}</td>
              </tr>
              <tr>
                <td>Garage Area</td>
                <td>${home.specs.garage}</td>
              </tr>
              <tr>
                <td>Lot Size</td>
                <td>${home.specs.lotSize}</td>
              </tr>
              <tr>
                <td>Room Layout</td>
                <td>${home.specs.rooms}</td>
              </tr>
              ${home.mapUrl ? `
              <tr>
                <td>Address</td>
                <td>
                  <a href="${home.mapUrl}" target="_blank" class="specs-map-link link-hover">
                    ${home.specs.addressText}
                    <svg class="map-icon" style="margin-left: 2px;" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
                  </a>
                </td>
              </tr>
              ` : ''}
            </table>
          </div>
          ` : ''}
          
          <!-- Remaining Features & Amenities Cards -->
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
      </div>
      `;
    } else {
      // Sold projects layout
      htmlContent += `
      <div class="portfolio-home-section" id="${home.id}">
        <div class="home-section-header reveal-on-scroll">
          <span class="section-tag">${home.tagline}</span>
          <h2>${home.title}</h2>
          <p>${home.description}</p>
        </div>
        
        <div class="portfolio-grid">
          ${home.gridImages.map(img => `
          <div class="portfolio-item reveal-on-scroll" data-caption="${img.caption}">
            <div class="img-wrap">
              <img src="${img.src}" alt="${img.alt}" loading="lazy">
              ${img.badge ? `<span class="sold-badge">${img.badge}</span>` : ''}
            </div>
            <div class="item-label">
              <h3>${img.label}</h3>
              <span>${img.sublabel}</span>
            </div>
          </div>
          `).join('')}
        </div>
      </div>
      `;
    }
  });

  container.innerHTML = htmlContent;
}

/**
 * Attaches events to prevent map links from bubble-triggering parent item clicks
 */
function initPortfolioLightbox(openLightbox) {
  document.querySelectorAll(".portfolio-item").forEach(item => {
    item.addEventListener("click", () => {
      const img = item.querySelector("img");
      const caption = item.getAttribute("data-caption") || "";
      const mapUrl = item.getAttribute("data-map-url") || null;
      if (img) {
        openLightbox(img.src, img.alt, caption, mapUrl);
      }
    });
  });

  document.querySelectorAll(".map-link, .specs-map-link").forEach(link => {
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
  }, { threshold: 0.15, rootMargin: "0px 0px -50px 0px" });

  document.querySelectorAll(".reveal-on-scroll").forEach(el => observer.observe(el));
}

/**
 * Initializes independent scrollers for each carousel instance on the page
 */
function initAllCarousels() {
  document.querySelectorAll(".portfolio-carousel-wrapper").forEach(wrapper => {
    const track = wrapper.querySelector(".portfolio-carousel-track");
    const prevBtn = wrapper.querySelector(".carousel-arrow.prev");
    const nextBtn = wrapper.querySelector(".carousel-arrow.next");

    if (!track || !prevBtn || !nextBtn) return;

    const getScrollAmount = () => {
      const firstItem = track.querySelector(".portfolio-item");
      if (firstItem) {
        return firstItem.offsetWidth + 30; // card width + gap
      }
      return track.offsetWidth;
    };

    nextBtn.addEventListener("click", () => {
      track.scrollBy({ left: getScrollAmount(), behavior: "smooth" });
    });

    prevBtn.addEventListener("click", () => {
      track.scrollBy({ left: -getScrollAmount(), behavior: "smooth" });
    });

    const toggleArrows = () => {
      const scrollLeft = Math.round(track.scrollLeft);
      const maxScrollLeft = track.scrollWidth - track.clientWidth;
      
      prevBtn.style.opacity = scrollLeft <= 5 ? "0.2" : "0.9";
      prevBtn.style.pointerEvents = scrollLeft <= 5 ? "none" : "auto";
      
      nextBtn.style.opacity = scrollLeft >= maxScrollLeft - 5 ? "0.2" : "0.9";
      nextBtn.style.pointerEvents = scrollLeft >= maxScrollLeft - 5 ? "none" : "auto";
    };

    track.addEventListener("scroll", toggleArrows);
    // Initial run
    setTimeout(toggleArrows, 100);
    // Resize listener
    window.addEventListener("resize", toggleArrows);
  });
}
