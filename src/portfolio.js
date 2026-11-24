import { initTheme, initLightbox, initNavMenu, initCopyrightYear } from "./common.js";
import { portfolioData } from "./data/portfolio.js";

document.addEventListener("DOMContentLoaded", () => {
  // 1. Initialize Common/Shared UI Features
  initTheme();
  initNavMenu();
  initCopyrightYear();
  const openLightbox = initLightbox();

  // 2. Render Portfolio Sections (Sticky Jump Bar + Bento Mosaic + Contact Sheet + Sold Legacy)
  const container = document.getElementById("portfolio-container");
  if (!container) return;

  renderPortfolio(container);

  // 3. Initialize Jump Bar Scroll-Spy, Contact Sheet Dialogs, Lightbox, and Scroll Reveals
  initJumpBarScrollSpy();
  initGallerySheets(openLightbox);
  initPortfolioLightbox(openLightbox);
  initScrollObserver();

  // 4. Handle hash scroll on initial load
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
 * Picks 4 best highlight interior/exterior images for the Bento Mosaic right-hand tiles
 */
function pickBentoHighlights(carouselImages) {
  if (!carouselImages || !carouselImages.length) return [];
  const preferredKeywords = ["open living", "kitchen", "master bath", "primary bath", "backyard", "patio"];
  const picked = [];
  const usedIndices = new Set();

  for (const kw of preferredKeywords) {
    if (picked.length >= 4) break;
    const idx = carouselImages.findIndex(
      (img, i) => !usedIndices.has(i) && `${img.label} ${img.alt}`.toLowerCase().includes(kw)
    );
    if (idx !== -1) {
      usedIndices.add(idx);
      picked.push({ img: carouselImages[idx], galleryIndex: idx + 1 });
    }
  }

  for (let i = 0; i < carouselImages.length && picked.length < 4; i++) {
    if (!usedIndices.has(i)) {
      usedIndices.add(i);
      picked.push({ img: carouselImages[i], galleryIndex: i + 1 });
    }
  }
  return picked;
}

/**
 * Generates the architectural Bento Mosaic portfolio layout
 */
function renderPortfolio(container) {
  const activeHomes = portfolioData.filter(home => home.hasSpecs);
  const soldHomes = portfolioData.filter(home => !home.hasSpecs);

  let htmlContent = `
    <nav class="portfolio-jump-bar" aria-label="Jump to residence">
      <div class="portfolio-jump-bar-inner">
        <div class="portfolio-jump-links">
          ${activeHomes.map((home, idx) => {
            const totalPhotos = 1 + (home.carouselImages ? home.carouselImages.length : 0);
            const shortLabel = home.specs?.addressText || home.title;
            return `<a href="#${home.id}" class="jump-pill${idx === 0 ? " active" : ""}" data-jump-target="${home.id}">${shortLabel} <span class="jump-pill-count">(${totalPhotos} photos)</span></a>`;
          }).join("")}
          <a href="#crafted-legacy" class="jump-pill" data-jump-target="crafted-legacy">Sold Legacy</a>
        </div>
        <a href="index.html#gallery-contact" class="jump-bar-cta">Schedule a Tour &rarr;</a>
      </div>
    </nav>
  `;

  // 1. Active Residences (Warm Limestone Gallery Canvas)
  activeHomes.forEach(home => {
    const isAvailable = home.id.includes("now-available") || home.tagline === "Now Available";
    const statusDotClass = isAvailable ? "available-dot" : "construction-dot";
    const statusText = isAvailable ? "Move-In Ready · Falcon's Cove" : "Under Construction (Q4 2026) · Falcon's Cove";
    const totalPhotos = 1 + (home.carouselImages ? home.carouselImages.length : 0);
    const highlights = pickBentoHighlights(home.carouselImages);

    htmlContent += `
    <section class="portfolio-home-section" id="${home.id}">
      <div class="home-section-header reveal-on-scroll">
        <span class="section-tag">${home.tagline} &middot; Falcon's Cove</span>
        <h2>${home.title}</h2>
        <p>${home.description}</p>
      </div>

      <!-- Luxury Bento Photo Mosaic Card -->
      <div class="bento-gallery-card reveal-on-scroll">
        <div class="bento-grid">
          <div class="bento-hero-tile portfolio-lightbox-trigger"
               data-home-id="${home.id}"
               data-img-index="0"
               data-img="${home.elevationImage.src}"
               data-alt="${home.elevationImage.alt}"
               data-caption="${home.elevationImage.caption}"
               data-map-url="${home.mapUrl || ""}">
            <img src="${home.elevationImage.src}" alt="${home.elevationImage.alt}" style="${home.elevationImage.style || ""}">
            <span class="bento-tile-label">Front Elevation</span>
          </div>

          <div class="bento-sub-grid">
            ${highlights.map((item, idx) => {
              const isLast = idx === highlights.length - 1;
              if (isLast) {
                return `
                <div class="bento-sub-tile">
                  <img src="${item.img.src}" alt="${item.img.alt}" loading="lazy">
                  <button type="button" class="bento-more-overlay" data-open-sheet="${home.id}">
                    <span class="bento-more-count">+${totalPhotos - 4}</span>
                    <span class="bento-more-text">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
                      View All ${totalPhotos} Photos
                    </span>
                  </button>
                </div>`;
              }
              return `
              <div class="bento-sub-tile portfolio-lightbox-trigger"
                   data-home-id="${home.id}"
                   data-img-index="${item.galleryIndex}"
                   data-img="${item.img.src}"
                   data-alt="${item.img.alt}"
                   data-caption="${item.img.caption}">
                <img src="${item.img.src}" alt="${item.img.alt}" loading="lazy">
                <span class="bento-tile-label">${item.img.label}</span>
              </div>`;
            }).join("")}
          </div>
        </div>

        <div class="portfolio-elevation-details">
          <div class="card-meta-top">
            <span class="card-status-label"><span class="status-dot ${statusDotClass}">●</span> ${statusText}</span>
            ${home.specs.price ? `<span class="card-price">${home.specs.price}</span>` : ""}
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
              <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
              View on Google Maps
            </a>` : ""}
            <a href="index.html?interest=${encodeURIComponent(`${home.title} (Available)`)}#gallery-contact" class="portfolio-inquire-link link-hover">Inquire About This Home &rarr;</a>
          </div>
        </div>
      </div>

      <!-- Specifications & Features Grid -->
      <div class="portfolio-specs-grid">
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
                  <svg class="map-icon" style="margin-left: 2px;" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
                </a>
              </td>
            </tr>` : ""}
          </table>
        </div>
        ` : ""}

        ${home.features ? home.features.map(feat => `
        <div class="build-specs-card reveal-on-scroll">
          <span class="section-tag">${feat.tagline}</span>
          <h4>${feat.title}</h4>
          <ul class="features-list" style="margin-top: 0;">
            ${feat.items.map(item => `<li>${item}</li>`).join("")}
          </ul>
        </div>
        `).join("") : ""}
      </div>
    </section>

    <!-- Full-Screen Photo Contact Sheet Dialog -->
    <dialog class="gallery-sheet-dialog" id="sheet-${home.id}" closedby="any" aria-labelledby="sheet-title-${home.id}">
      <div class="gallery-sheet-header">
        <div class="gallery-sheet-title-wrap">
          <span class="gallery-sheet-tag">Complete Photo Tour &middot; ${totalPhotos} Photos</span>
          <h3 class="gallery-sheet-title" id="sheet-title-${home.id}">${home.title}</h3>
        </div>
        <button type="button" class="gallery-sheet-close" data-close-sheet="sheet-${home.id}">
          Close &times;
        </button>
      </div>
      <div class="gallery-sheet-grid">
        <div class="gallery-sheet-item is-featured sheet-lightbox-item" data-home-id="${home.id}" data-img-index="0">
          <div class="gallery-sheet-thumb">
            <img src="${home.elevationImage.src}" alt="${home.elevationImage.alt}" style="${home.elevationImage.style || ""}">
          </div>
          <div class="gallery-sheet-caption">
            <strong>Front Elevation</strong>
            <span>1 of ${totalPhotos}</span>
          </div>
        </div>
        ${(home.carouselImages || []).map((img, i) => `
        <div class="gallery-sheet-item sheet-lightbox-item" data-home-id="${home.id}" data-img-index="${i + 1}">
          <div class="gallery-sheet-thumb">
            <img src="${img.src}" alt="${img.alt}" loading="lazy">
          </div>
          <div class="gallery-sheet-caption">
            <strong>${img.label}</strong>
            <span>${i + 2} of ${totalPhotos}</span>
          </div>
        </div>`).join("")}
      </div>
    </dialog>
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
          `).join("")}
        </div>
      </div>
      `).join("")}
    </div>
  </section>
  `;

  // 3. Bottom CTA Block linking back to main contact inquiry section
  htmlContent += `
  <section class="portfolio-bottom-cta reveal-on-scroll">
    <div class="portfolio-bottom-cta-inner">
      <span class="section-tag">Let's Talk</span>
      <h2>See a home in person.</h2>
      <p>Tell us which home you'd like to see or what you'd like to build. Prefer to talk? Call or text&nbsp;us.</p>
      <a href="index.html#gallery-contact" class="cta-button link-hover" style="white-space: nowrap;">
        Schedule a Tour
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
 * Keeps the sticky property jump bar pills highlighted as the user scrolls
 */
function initJumpBarScrollSpy() {
  const pills = Array.from(document.querySelectorAll(".jump-pill[data-jump-target]"));
  if (!pills.length) return;

  const sections = pills
    .map(pill => document.getElementById(pill.getAttribute("data-jump-target")))
    .filter(Boolean);

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        pills.forEach(p => p.classList.toggle("active", p.getAttribute("data-jump-target") === id));
      }
    });
  }, { rootMargin: "-25% 0px -60% 0px", threshold: 0.01 });

  sections.forEach(sec => observer.observe(sec));
}

/**
 * Handles native <dialog closedby="any"> full-screen photo sheets + Safari fallback
 */
function initGallerySheets(openLightbox) {
  document.querySelectorAll("[data-open-sheet]").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const homeId = btn.getAttribute("data-open-sheet");
      const dialog = document.getElementById(`sheet-${homeId}`);
      if (dialog && typeof dialog.showModal === "function") {
        dialog.showModal();
      }
    });
  });

  document.querySelectorAll("[data-close-sheet]").forEach(btn => {
    btn.addEventListener("click", () => {
      const dialog = document.getElementById(btn.getAttribute("data-close-sheet"));
      if (dialog) dialog.close();
    });
  });

  // Fallback light-dismiss for browsers without <dialog closedby="any"> (e.g. Safari)
  document.querySelectorAll("dialog.gallery-sheet-dialog").forEach(dialog => {
    if (!("closedBy" in HTMLDialogElement.prototype)) {
      dialog.addEventListener("click", (event) => {
        if (event.target !== dialog) return;
        const rect = dialog.getBoundingClientRect();
        const isInside =
          rect.top <= event.clientY &&
          event.clientY <= rect.top + rect.height &&
          rect.left <= event.clientX &&
          event.clientX <= rect.left + rect.width;
        if (!isInside) dialog.close();
      });
    }
  });

  // Clicking a photo inside the contact sheet closes the sheet & opens full-screen Lightbox
  document.querySelectorAll(".sheet-lightbox-item").forEach(item => {
    item.addEventListener("click", () => {
      const homeId = item.getAttribute("data-home-id");
      const idx = parseInt(item.getAttribute("data-img-index") || "0", 10);
      const dialog = item.closest("dialog");
      if (dialog) dialog.close();
      if (homeGalleries[homeId]) {
        openLightbox(homeGalleries[homeId], idx);
      }
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

  document.querySelectorAll(".card-map-link, .specs-map-link, .portfolio-inquire-link, .cta-button").forEach(link => {
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
