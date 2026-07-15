const MACHINES = {
  pilates: [
    {
      id: "mat",
      name: "Mat",
      image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600&q=80",
      description:
        "Foundation Pilates on the mat — building core strength, flexibility, and body awareness through controlled, flowing movements using your own body weight.",
    },
    {
      id: "reformer",
      name: "Reformer",
      image: "https://images.unsplash.com/photo-1574680096145-05c9bab8af90?w=600&q=80",
      description:
        "The iconic Pilates apparatus with a sliding carriage and spring resistance. Ideal for full-body conditioning, rehabilitation, and precision movement training.",
    },
    {
      id: "exo-chair",
      name: "Exo Chair",
      image: "https://images.unsplash.com/photo-1576678927484-cc907957088c?w=600&q=80",
      description:
        "A compact, versatile chair with a pedal system that challenges balance, stability, and strength — perfect for targeted lower-body and core work.",
    },
    {
      id: "bodhi",
      name: "Bodhi Suspension System",
      image: "https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=600&q=80",
      description:
        "Suspension training that combines Pilates principles with bodyweight resistance, enhancing functional strength, mobility, and deep core engagement.",
    },
    {
      id: "cadillac",
      name: "Cadillac",
      image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&q=80",
      description:
        "A versatile tower apparatus with bars, springs, and straps — excellent for stretching, strengthening, and rehabilitation with full support and range of motion.",
    },
    {
      id: "motr",
      name: "MOTR",
      image: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600&q=80",
      description:
        "A foam roller combined with resistance cables — a dynamic tool for balance, coordination, and functional fitness in a space-efficient format.",
    },
    {
      id: "ladder-barrel",
      name: "Ladder Barrel",
      image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=600&q=80",
      description:
        "Designed for deep stretching and spinal articulation. The curved surface supports extension, flexibility, and postural alignment work.",
    },
    {
      id: "core-align",
      name: "Core Align",
      image: "https://images.unsplash.com/photo-1599901860904-17e06ed70836?w=600&q=80",
      description:
        "A unique system that mimics natural gait patterns, ideal for improving hip mobility, functional movement, and lower-body strength.",
    },
  ],
  gyrotonics: [
    {
      id: "leg-extension",
      name: "Leg Extension",
      image: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=600&q=80",
      description:
        "A specialised unit for lower-body work that builds strength, flexibility, and coordination through circular, three-dimensional leg movements.",
    },
    {
      id: "gyrotonic",
      name: "Gyrotonic",
      image: "https://images.unsplash.com/photo-1518310383802-640c2ed31194?w=600&q=80",
      description:
        "The Pulley Tower — the heart of the Gyrotonic Method. Fluid, spiralling movements that articulate the spine and open the joints through a full range of motion.",
    },
    {
      id: "gyrokinesis",
      name: "Gyrokinesis",
      image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&q=80",
      description:
        "A mat-based method using rhythmic, undulating movements and breath. Performed on a stool and mat, it builds strength, flexibility, and body awareness without equipment.",
    },
    {
      id: "jump-stretch",
      name: "Jump Stretch Board",
      image: "https://images.unsplash.com/photo-1574680096145-05c9bab8af90?w=600&q=80",
      description:
        "Combines cardiovascular training with Gyrotonic principles. The inclined board supports jumping, stretching, and rhythmic movement for a full-body workout.",
    },
  ],
};

const CHEVRON_SVG = `<svg class="machine-chevron" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M6 9l6 6 6-6"/></svg>`;

function easeOutQuart(t) {
  return 1 - Math.pow(1 - t, 4);
}

function getScrollParentY() {
  return document.scrollingElement || document.documentElement;
}

function setNativeScrollTop(y) {
  const top = Math.max(0, y);
  const root = getScrollParentY();
  // Override CSS scroll-behavior: smooth (breaks instant chase on Safari/GitHub Pages)
  const prev = root.style.scrollBehavior;
  root.style.scrollBehavior = "auto";
  root.scrollTop = top;
  window.scrollTo(0, top);
  root.style.scrollBehavior = prev;
}

function waitForItemImages(item) {
  const images = [...item.querySelectorAll("img")];
  if (!images.length) return Promise.resolve();

  return Promise.all(
    images.map(
      (img) =>
        new Promise((resolve) => {
          if (img.complete && img.naturalHeight > 0) {
            resolve();
            return;
          }
          const done = () => resolve();
          img.addEventListener("load", done, { once: true });
          img.addEventListener("error", done, { once: true });
          // Decode if possible so layout height is final
          if (typeof img.decode === "function") {
            img.decode().then(done).catch(done);
          }
        })
    )
  );
}

function scrollToFitExpandedItem(item) {
  const headerEl = document.getElementById("site-header");
  const headerHeight = headerEl?.offsetHeight || 64;
  const padding = 20;
  const isMobile = window.matchMedia("(max-width: 900px)").matches;
  const duration = isMobile ? 320 : 400;

  let rafId = 0;
  let finished = false;

  function getTargetScroll() {
    const rect = item.getBoundingClientRect();
    const pageTop = (window.scrollY || window.pageYOffset || 0) + rect.top;
    const pageBottom = pageTop + rect.height;
    const viewTop = window.scrollY || window.pageYOffset || 0;
    const viewBottom = viewTop + window.innerHeight;
    const maxVisible = window.innerHeight - headerHeight - padding * 2;

    if (rect.height >= maxVisible) {
      return Math.max(0, pageTop - headerHeight - padding);
    }
    if (pageBottom > viewBottom - padding) {
      return Math.max(0, pageBottom - window.innerHeight + padding);
    }
    if (rect.top < headerHeight + padding) {
      return Math.max(0, pageTop - headerHeight - padding);
    }
    return viewTop;
  }

  function animateTo(target) {
    const startY = window.scrollY || window.pageYOffset || 0;
    if (Math.abs(target - startY) < 2) return;

    const startTime = performance.now();
    cancelAnimationFrame(rafId);

    function tick(now) {
      const progress = Math.min((now - startTime) / duration, 1);
      setNativeScrollTop(startY + (target - startY) * easeOutQuart(progress));
      if (progress < 1) {
        rafId = requestAnimationFrame(tick);
      }
    }

    rafId = requestAnimationFrame(tick);
  }

  function settle() {
    if (finished) return;
    finished = true;
    cancelAnimationFrame(rafId);
    // Final measure after expand + images
    requestAnimationFrame(() => {
      animateTo(getTargetScroll());
    });
  }

  function chaseWhileOpening(ms) {
    const chaseStart = performance.now();

    function chase(now) {
      if (finished) return;
      const liveTarget = getTargetScroll();
      const current = window.scrollY || window.pageYOffset || 0;
      if (Math.abs(liveTarget - current) > 2) {
        setNativeScrollTop(current + (liveTarget - current) * 0.4);
      }
      if (now - chaseStart < ms) {
        rafId = requestAnimationFrame(chase);
      }
    }

    rafId = requestAnimationFrame(chase);
  }

  // Eagerly load images inside this item (lazy images break height on first open in production)
  item.querySelectorAll("img[loading='lazy']").forEach((img) => {
    img.loading = "eager";
  });

  chaseWhileOpening(450);

  waitForItemImages(item).then(() => {
    // Give CSS grid expand a moment, then settle
    window.setTimeout(settle, isMobile ? 380 : 320);
  });

  // Absolute fallback
  window.setTimeout(settle, 900);
}

function bindAccordionEvents(container) {
  const items = container.querySelectorAll(".machine-item");

  function expandItem(item) {
    items.forEach((i) => {
      const isTarget = i === item;
      i.classList.toggle("expanded", isTarget);
      i.querySelector(".machine-header")?.setAttribute("aria-expanded", String(isTarget));
    });

    scrollToFitExpandedItem(item);
  }

  function collapseAll() {
    items.forEach((i) => {
      i.classList.remove("expanded");
      i.querySelector(".machine-header")?.setAttribute("aria-expanded", "false");
    });
  }

  items.forEach((item) => {
    item.querySelector(".machine-header")?.addEventListener("click", () => {
      if (item.classList.contains("expanded")) {
        collapseAll();
      } else {
        expandItem(item);
      }
    });
  });
}

function initMachineAccordion(type) {
  const container = document.getElementById(`accordion-${type}`);
  const machines = MACHINES[type];
  if (!container || !machines) return;

  container.innerHTML = machines
    .map(
      (m) => `
    <article class="machine-item" data-id="${m.id}">
      <button type="button" class="machine-header" aria-expanded="false">
        <span>${m.name}</span>
        ${CHEVRON_SVG}
      </button>
      <div class="machine-body">
        <div class="machine-body-inner">
          <div class="machine-detail">
            <div class="machine-image">
              <img src="${m.image}" alt="${m.name}" loading="eager" decoding="async" />
            </div>
            <div class="machine-text">
              <p>${m.description}</p>
            </div>
          </div>
        </div>
      </div>
    </article>`
    )
    .join("");

  bindAccordionEvents(container);
}
