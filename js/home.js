document.addEventListener("DOMContentLoaded", () => {
  initIntroSplash();
  initHero();
  initSphereRing();
  initScrollAnimations();
  initQuadrantHover();
});

function initIntroSplash() {
  const track = document.querySelector(".intro-track");
  const intro = document.querySelector(".intro-splash");
  const stage = document.querySelector(".intro-splash-stage");
  const logo = document.querySelector(".intro-logo");
  const cue = document.querySelector(".intro-scroll-cue");
  const home = document.querySelector("#home") || document.querySelector(".hero");
  if (!track || !intro || !logo || !home) return;

  document.body.classList.add("has-intro");
  document.body.classList.remove("intro-passed");

  // Clean default state before any scroll drives animation
  intro.style.opacity = "1";
  intro.style.visibility = "visible";
  logo.style.transform = "translate3d(0,0,0) scale(1)";
  logo.style.opacity = "1";
  if (stage) {
    stage.style.transform = "translate3d(0,0,0) scale(1)";
    stage.style.opacity = "1";
  }
  home.style.transform = "";

  // Let CSS control the cue fade-in; don't lock it to opacity 0 via inline styles
  if (cue) {
    cue.style.opacity = "";
    cue.style.pointerEvents = "auto";
  }

  const LOGO_START_SCALE = 1;
  const LOGO_END_SCALE = 1.8;
  const STAGE_END_SCALE = 4.5;

  const clamp = (v, min = 0, max = 1) => Math.min(max, Math.max(min, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);
  const easeInOutCubic = (t) =>
    t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  const smoothstep = (edge0, edge1, x) => {
    const t = clamp((x - edge0) / (edge1 - edge0));
    return t * t * (3 - 2 * t);
  };

  let lastApplied = -1;
  let passed = false;
  let rafId = 0;
  let scrollable = 1;

  function measure() {
    scrollable = Math.max(1, track.offsetHeight - window.innerHeight);
  }

  function getProgress() {
    return clamp(window.scrollY / scrollable);
  }

  function applyProgress(progress) {
    if (Math.abs(progress - lastApplied) < 0.0008) return;
    lastApplied = progress;

    // Instant zoom with scroll; fade starts later
    const zoomT = easeOutCubic(smoothstep(0, 0.8, progress));
    const fadeT = smoothstep(0.5, 0.78, progress);
    const revealT = smoothstep(0.66, 0.96, progress);
    const cueT = 1 - smoothstep(0, 0.1, progress);
    const stageZoom = easeInOutCubic(smoothstep(0.3, 0.95, progress));
    const heroZoom = smoothstep(0.55, 0.96, progress);

    const logoScale = lerp(LOGO_START_SCALE, LOGO_END_SCALE, zoomT);
    const logoOpacity = 1 - fadeT;
    const splashOpacity = 1 - revealT;
    const stageScale = lerp(1, STAGE_END_SCALE, stageZoom);
    const heroScale = lerp(1.1, 1, easeOutCubic(heroZoom));

    logo.style.transform = `translate3d(0,0,0) scale(${logoScale})`;
    logo.style.opacity = String(logoOpacity);

    if (stage) {
      stage.style.transform = `translate3d(0,0,0) scale(${stageScale})`;
      stage.style.opacity = String(1 - revealT * 0.85);
    }

    intro.style.opacity = String(Math.max(splashOpacity, 0.001));

    // Only scale hero once the reveal begins — keeps default view clean
    if (heroZoom > 0.01 && progress < 0.98) {
      home.style.transform = `translate3d(0,0,0) scale(${heroScale})`;
    } else {
      home.style.transform = "";
    }

    if (cue) {
      if (progress <= 0.001) {
        // Default view: clear inline so CSS `.is-ready` fade-in shows the cue
        cue.style.opacity = "";
        cue.style.pointerEvents = "auto";
      } else {
        cue.style.opacity = String(cueT);
        cue.style.pointerEvents = cueT > 0.2 ? "auto" : "none";
      }
    }

    const nowPassed = progress >= 0.9;
    if (nowPassed !== passed) {
      passed = nowPassed;
      document.body.classList.toggle("intro-passed", passed);
      if (passed) {
        home.style.transform = "";
        intro.style.opacity = "0";
        logo.style.opacity = "0";
      } else {
        intro.style.visibility = "visible";
      }
    }
  }

  function onScroll() {
    cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(() => applyProgress(getProgress()));
  }

  function scrollThroughIntro(duration = 1400) {
    const startY = window.scrollY;
    const targetY = scrollable;
    const distance = targetY - startY;
    if (distance <= 1) return;

    const startTime = performance.now();

    function frame(now) {
      const t = Math.min((now - startTime) / duration, 1);
      window.scrollTo(0, startY + distance * easeInOutCubic(t));
      if (t < 1) requestAnimationFrame(frame);
    }

    requestAnimationFrame(frame);
  }

  cue?.addEventListener("click", (e) => {
    e.preventDefault();
    scrollThroughIntro(1400);
  });

  if ("scrollRestoration" in history) {
    history.scrollRestoration = "manual";
  }

  measure();
  window.scrollTo(0, 0);
  applyProgress(0);

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener(
    "resize",
    () => {
      measure();
      onScroll();
    },
    { passive: true }
  );

  requestAnimationFrame(() => {
    window.scrollTo(0, 0);
    intro.classList.add("is-ready");
    lastApplied = -1;
    applyProgress(0);
  });
}

function initHero() {
  const hero = document.querySelector(".hero");
  if (hero) requestAnimationFrame(() => hero.classList.add("loaded"));
}

const SPHERE_CX = 200;
const SPHERE_CY = 200;
const SPHERE_OUTER_R = 174;
const SPHERE_INNER_R = 116;
const SPHERE_HOVER_EXPAND = 16;
const SPHERE_HOVER_SHIFT = 12;

const SPHERE_QUADRANTS = [
  { id: "top-left", start: Math.PI, end: 1.5 * Math.PI, openAngle: (5 * Math.PI) / 4 },
  { id: "top-right", start: 1.5 * Math.PI, end: 2 * Math.PI, openAngle: (7 * Math.PI) / 4 },
  { id: "bottom-right", start: 0, end: 0.5 * Math.PI, openAngle: Math.PI / 4 },
  { id: "bottom-left", start: 0.5 * Math.PI, end: Math.PI, openAngle: (3 * Math.PI) / 4 },
];

function arcPath(
  startAngle,
  endAngle,
  outerR = SPHERE_OUTER_R,
  innerR = SPHERE_INNER_R,
  shiftX = 0,
  shiftY = 0
) {
  const cx = SPHERE_CX + shiftX;
  const cy = SPHERE_CY + shiftY;
  const x1o = cx + outerR * Math.cos(startAngle);
  const y1o = cy + outerR * Math.sin(startAngle);
  const x2o = cx + outerR * Math.cos(endAngle);
  const y2o = cy + outerR * Math.sin(endAngle);
  const x2i = cx + innerR * Math.cos(endAngle);
  const y2i = cy + innerR * Math.sin(endAngle);
  const x1i = cx + innerR * Math.cos(startAngle);
  const y1i = cy + innerR * Math.sin(startAngle);
  const largeArc = endAngle - startAngle > Math.PI ? 1 : 0;

  return [
    `M ${x1i} ${y1i}`,
    `L ${x1o} ${y1o}`,
    `A ${outerR} ${outerR} 0 ${largeArc} 1 ${x2o} ${y2o}`,
    `L ${x2i} ${y2i}`,
    `A ${innerR} ${innerR} 0 ${largeArc} 0 ${x1i} ${y1i}`,
    "Z",
  ].join(" ");
}

function openOffset(angle, distance = SPHERE_HOVER_SHIFT) {
  return {
    x: Math.cos(angle) * distance,
    y: Math.sin(angle) * distance,
  };
}

function initSphereRing() {
  const container = document.querySelector(".sphere-ring");
  if (!container) return;

  const images = {
    "top-left": "https://images.unsplash.com/photo-1615485503744-9d0e1b0e0b0e?w=400&q=80",
    "top-right": "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&q=80",
    "bottom-left": "https://images.unsplash.com/photo-1599901860904-17e06ed70836?w=400&q=80",
    "bottom-right": "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400&q=80",
  };

  const svgNS = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(svgNS, "svg");
  svg.setAttribute("viewBox", "0 0 400 400");
  svg.setAttribute("aria-hidden", "true");
  svg.setAttribute("overflow", "visible");

  const defs = document.createElementNS(svgNS, "defs");

  SPHERE_QUADRANTS.forEach((q) => {
    const clip = document.createElementNS(svgNS, "clipPath");
    clip.setAttribute("id", `clip-${q.id}`);
    const clipShape = document.createElementNS(svgNS, "path");
    clipShape.setAttribute("class", "quadrant-clip");
    clipShape.setAttribute("d", arcPath(q.start, q.end));
    clip.appendChild(clipShape);
    defs.appendChild(clip);
  });

  svg.appendChild(defs);

  SPHERE_QUADRANTS.forEach((q) => {
    const group = document.createElementNS(svgNS, "g");
    group.setAttribute("class", "quadrant-group");
    group.setAttribute("data-quadrant", q.id);

    const visual = document.createElementNS(svgNS, "g");
    visual.setAttribute("class", "quadrant-visual");

    const image = document.createElementNS(svgNS, "image");
    image.setAttribute("href", images[q.id]);
    image.setAttribute("x", "0");
    image.setAttribute("y", "0");
    image.setAttribute("width", "400");
    image.setAttribute("height", "400");
    image.setAttribute("preserveAspectRatio", "xMidYMid slice");
    image.setAttribute("clip-path", `url(#clip-${q.id})`);
    image.setAttribute("pointer-events", "none");

    visual.appendChild(image);

    const hit = document.createElementNS(svgNS, "path");
    hit.setAttribute("class", "quadrant-hit");
    const shift = openOffset(q.openAngle);
    hit.setAttribute(
      "d",
      arcPath(
        q.start,
        q.end,
        SPHERE_OUTER_R + SPHERE_HOVER_EXPAND + 4,
        SPHERE_INNER_R - 4,
        shift.x * 0.35,
        shift.y * 0.35
      )
    );
    hit.setAttribute("fill", "transparent");

    group.appendChild(visual);
    group.appendChild(hit);
    svg.appendChild(group);
  });

  container.insertBefore(svg, container.firstChild);
}

function initScrollAnimations() {
  const targets = [
    ...document.querySelectorAll(".section-intro"),
    ...document.querySelectorAll(".pilates-section .section-heading"),
    document.querySelector(".sphere-container"),
    ...document.querySelectorAll(".feature-item"),
  ].filter(Boolean);

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add("visible");
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
  );

  targets.forEach((el, i) => {
    if (el.classList.contains("feature-item")) {
      el.style.transitionDelay = `${0.1 + (i % 6) * 0.08}s`;
    }
    observer.observe(el);
  });
}

function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3);
}

const hoverState = new WeakMap();

function setQuadrantOpen(group, quadrant, active) {
  const clip = document.querySelector(`#clip-${quadrant.id} .quadrant-clip`);
  if (!clip) return;

  const prev = hoverState.get(group);
  if (prev?.rafId) cancelAnimationFrame(prev.rafId);

  const duration = 420;
  const startTime = performance.now();
  const from = prev?.progress ?? 0;
  const to = active ? 1 : 0;

  group.classList.toggle("is-hovered", active);

  function frame(now) {
    const raw = Math.min((now - startTime) / duration, 1);
    const progress = from + (to - from) * easeOutCubic(raw);
    const shift = openOffset(quadrant.openAngle, SPHERE_HOVER_SHIFT * progress);
    const outerR = SPHERE_OUTER_R + SPHERE_HOVER_EXPAND * progress;

    clip.setAttribute(
      "d",
      arcPath(quadrant.start, quadrant.end, outerR, SPHERE_INNER_R, shift.x, shift.y)
    );

    if (raw < 1) {
      const rafId = requestAnimationFrame(frame);
      hoverState.set(group, { rafId, progress });
      return;
    }

    hoverState.set(group, { rafId: null, progress: to });
  }

  const rafId = requestAnimationFrame(frame);
  hoverState.set(group, { rafId, progress: from });
}

function initQuadrantHover() {
  const groups = document.querySelectorAll(".quadrant-group");
  const features = document.querySelectorAll(".feature-item");

  groups.forEach((group) => {
    const id = group.dataset.quadrant;
    const quadrant = SPHERE_QUADRANTS.find((q) => q.id === id);
    const hit = group.querySelector(".quadrant-hit");
    if (!quadrant || !hit) return;

    hit.addEventListener("mouseenter", () => {
      setQuadrantOpen(group, quadrant, true);

      groups.forEach((g) => {
        if (g !== group) g.classList.add("dimmed");
      });
      features.forEach((f) => {
        f.classList.toggle("active", f.dataset.quadrant === id);
      });
    });

    hit.addEventListener("mouseleave", () => {
      setQuadrantOpen(group, quadrant, false);

      groups.forEach((g) => g.classList.remove("dimmed"));
      features.forEach((f) => f.classList.remove("active"));
    });
  });
}
