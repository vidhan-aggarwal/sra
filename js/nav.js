function getCurrentPage() {
  return document.body.dataset.page || "home";
}

function renderNav() {
  const current = getCurrentPage();
  const isClassPage = current === "pilates" || current === "gyrotonics";

  const header = document.getElementById("site-header");
  if (!header) return;

  header.innerHTML = `
    <nav class="nav-inner">
      <a href="index.html" class="logo" aria-label="SRA home">
        <img src="assets/brand/logo-mark-128.png" alt="" class="logo-mark" width="36" height="36" />
        <span class="logo-word">SRA</span>
      </a>
      <button
        type="button"
        class="nav-toggle"
        aria-label="Open menu"
        aria-expanded="false"
        aria-controls="primary-nav"
      >
        <span class="nav-toggle-bar" aria-hidden="true"></span>
        <span class="nav-toggle-bar" aria-hidden="true"></span>
        <span class="nav-toggle-bar" aria-hidden="true"></span>
      </button>
      <ul class="nav-links" id="primary-nav">
        <li>
          <a href="index.html" class="nav-link${current === "home" ? " active" : ""}" data-nav="home">Home</a>
        </li>
        <li class="nav-dropdown${isClassPage ? " active-parent" : ""}">
          <button
            type="button"
            class="nav-link nav-dropdown-toggle${isClassPage ? " active" : ""}"
            aria-expanded="false"
            aria-haspopup="true"
          >
            Classes
            <svg class="chevron" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg>
          </button>
          <ul class="nav-dropdown-menu" role="menu">
            <li role="none">
              <a href="pilates.html" role="menuitem" class="class-option${current === "pilates" ? " active" : ""}">Pilates</a>
            </li>
            <li role="none">
              <a href="gyrotonics.html" role="menuitem" class="class-option${current === "gyrotonics" ? " active" : ""}">Gyrotonic</a>
            </li>
          </ul>
        </li>
        <li>
          <a href="testimonials.html" class="nav-link${current === "testimonials" ? " active" : ""}" data-nav="testimonials">Testimonials</a>
        </li>
        <li>
          <a href="events.html" class="nav-link${current === "events" ? " active" : ""}" data-nav="events">Events</a>
        </li>
      </ul>
    </nav>`;
}

function renderFooter() {
  const footer = document.getElementById("site-footer");
  if (!footer) return;

  footer.innerHTML = `
    <div class="footer-inner">
      <a href="index.html" class="footer-brand" aria-label="SRA Pilates Fitness Rehab">
        <img
          src="assets/brand/logo-full-320.png"
          alt="SRA Pilates · Fitness Rehab"
          class="footer-logo-img"
          width="120"
          height="176"
        />
      </a>
      <div class="footer-locations">
        <span>Chembur</span>
        <span class="dot">•</span>
        <span>Bandra</span>
      </div>
      <div class="footer-social">
        <a href="#" aria-label="Instagram">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg>
        </a>
        <a href="#" aria-label="Facebook">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
        </a>
        <a href="#" aria-label="Snapchat">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2c-2.5 0-4.5 1.5-5.5 3.5-.5 1-1 2.5-1 4 0 1 .2 1.8.5 2.5-.8.3-1.5.8-2 1.5-.5.7-.5 1.5 0 2.2.3.4.7.7 1.2.9-.1.5-.1 1 0 1.5.3 1.2 1.5 2 3 2.5 1 .3 2 .5 3 .5s2-.2 3-.5c1.5-.5 2.7-1.3 3-2.5.1-.5.1-1 0-1.5.5-.2.9-.5 1.2-.9.5-.7.5-1.5 0-2.2-.5-.7-1.2-1.2-2-1.5.3-.7.5-1.5.5-2.5 0-1.5-.5-3-1-4C16.5 3.5 14.5 2 12 2z"/></svg>
        </a>
      </div>
    </div>`;
}

function initHeaderScroll() {
  const header = document.getElementById("site-header");
  const hero = document.querySelector(".hero");
  const intro = document.querySelector(".intro-track") || document.querySelector(".intro-splash");

  if (!header) return;

  if (!hero || document.body.classList.contains("inner-page")) {
    header.classList.add("scrolled");
    return;
  }

  const onScroll = () => {
    if (document.body.classList.contains("nav-open")) return;
    const heroTop = intro ? intro.offsetHeight : 0;
    const threshold = heroTop + hero.offsetHeight * 0.15;
    header.classList.toggle("scrolled", window.scrollY > threshold);
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
}

function initNavDropdown() {
  const dropdown = document.querySelector(".nav-dropdown");
  const toggle = dropdown?.querySelector(".nav-dropdown-toggle");
  if (!dropdown || !toggle) return;

  function closeDropdown() {
    dropdown.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");
  }

  toggle.addEventListener("click", (e) => {
    e.stopPropagation();
    const isOpen = dropdown.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(isOpen));
  });

  document.addEventListener("click", closeDropdown);
  dropdown.addEventListener("click", (e) => e.stopPropagation());
}

function initMobileNav() {
  const header = document.getElementById("site-header");
  const toggle = document.querySelector(".nav-toggle");
  const links = document.querySelector(".nav-links");
  if (!header || !toggle || !links) return;

  function setOpen(open) {
    document.body.classList.toggle("nav-open", open);
    header.classList.toggle("nav-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");

    if (open) {
      header.classList.add("scrolled");
    } else if (!document.body.classList.contains("inner-page")) {
      const hero = document.querySelector(".hero");
      const intro = document.querySelector(".intro-track");
      if (hero) {
        const heroTop = intro ? intro.offsetHeight : 0;
        const threshold = heroTop + hero.offsetHeight * 0.15;
        header.classList.toggle("scrolled", window.scrollY > threshold);
      }
    }
  }

  toggle.addEventListener("click", (e) => {
    e.stopPropagation();
    setOpen(!document.body.classList.contains("nav-open"));
  });

  links.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => setOpen(false));
  });

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") setOpen(false);
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 900) setOpen(false);
  });
}

function initSiteChrome() {
  renderNav();
  renderFooter();
  initHeaderScroll();
  initNavDropdown();
  initMobileNav();
}

document.addEventListener("DOMContentLoaded", initSiteChrome);
