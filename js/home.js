document.addEventListener("DOMContentLoaded", () => {
  initHero();
  initSphereRing();
  initScrollAnimations();
  initQuadrantHover();
});

function initHero() {
  const hero = document.querySelector(".hero");
  if (hero) requestAnimationFrame(() => hero.classList.add("loaded"));
}

const SPHERE_CX = 200;
const SPHERE_CY = 200;
const SPHERE_OUTER_R = 182;
const SPHERE_INNER_R = 96;
const SPHERE_HOVER_EXPAND = 14;

const SPHERE_QUADRANTS = [
  { id: "top-left", start: Math.PI, end: 1.5 * Math.PI, openAngle: (5 * Math.PI) / 4 },
  { id: "top-right", start: 1.5 * Math.PI, end: 2 * Math.PI, openAngle: (7 * Math.PI) / 4 },
  { id: "bottom-right", start: 0, end: 0.5 * Math.PI, openAngle: Math.PI / 4 },
  { id: "bottom-left", start: 0.5 * Math.PI, end: Math.PI, openAngle: (3 * Math.PI) / 4 },
];

function arcPath(startAngle, endAngle, outerR = SPHERE_OUTER_R, innerR = SPHERE_INNER_R) {
  const x1o = SPHERE_CX + outerR * Math.cos(startAngle);
  const y1o = SPHERE_CY + outerR * Math.sin(startAngle);
  const x2o = SPHERE_CX + outerR * Math.cos(endAngle);
  const y2o = SPHERE_CY + outerR * Math.sin(endAngle);
  const x2i = SPHERE_CX + innerR * Math.cos(endAngle);
  const y2i = SPHERE_CY + innerR * Math.sin(endAngle);
  const x1i = SPHERE_CX + innerR * Math.cos(startAngle);
  const y1i = SPHERE_CY + innerR * Math.sin(startAngle);
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

  const defs = document.createElementNS(svgNS, "defs");

  SPHERE_QUADRANTS.forEach((q) => {
    const clip = document.createElementNS(svgNS, "clipPath");
    clip.setAttribute("id", `clip-${q.id}`);
    const path = document.createElementNS(svgNS, "path");
    path.setAttribute("d", arcPath(q.start, q.end));
    path.setAttribute("class", "quadrant-clip");
    clip.appendChild(path);
    defs.appendChild(clip);
  });

  svg.appendChild(defs);

  SPHERE_QUADRANTS.forEach((q) => {
    const group = document.createElementNS(svgNS, "g");
    group.setAttribute("class", "quadrant-group");
    group.setAttribute("data-quadrant", q.id);

    const openX = Math.cos(q.openAngle) * 10;
    const openY = Math.sin(q.openAngle) * 10;
    group.style.setProperty("--open-x", `${openX}px`);
    group.style.setProperty("--open-y", `${openY}px`);

    const image = document.createElementNS(svgNS, "image");
    image.setAttribute("href", images[q.id]);
    image.setAttribute("x", "0");
    image.setAttribute("y", "0");
    image.setAttribute("width", "400");
    image.setAttribute("height", "400");
    image.setAttribute("preserveAspectRatio", "xMidYMid slice");
    image.setAttribute("clip-path", `url(#clip-${q.id})`);

    group.appendChild(image);
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

function initQuadrantHover() {
  const groups = document.querySelectorAll(".quadrant-group");
  const features = document.querySelectorAll(".feature-item");

  groups.forEach((group) => {
    const id = group.dataset.quadrant;
    const quadrant = SPHERE_QUADRANTS.find((q) => q.id === id);
    const clipPath = document.querySelector(`#clip-${id} .quadrant-clip`);

    group.addEventListener("mouseenter", () => {
      if (quadrant && clipPath) {
        clipPath.setAttribute(
          "d",
          arcPath(quadrant.start, quadrant.end, SPHERE_OUTER_R + SPHERE_HOVER_EXPAND)
        );
      }

      groups.forEach((g) => {
        if (g !== group) g.classList.add("dimmed");
      });
      features.forEach((f) => {
        f.classList.toggle("active", f.dataset.quadrant === id);
      });
    });

    group.addEventListener("mouseleave", () => {
      if (quadrant && clipPath) {
        clipPath.setAttribute("d", arcPath(quadrant.start, quadrant.end));
      }

      groups.forEach((g) => g.classList.remove("dimmed"));
      features.forEach((f) => f.classList.remove("active"));
    });
  });
}
