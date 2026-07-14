const CLIENT_NAME = "Client name";

const TESTIMONIALS = [
  {
    id: 1,
    short: "SRA completely changed how I move. After three weeks of reformer classes, my back pain is gone and I feel stronger than ever.",
    full: "SRA completely changed how I move. After three weeks of reformer classes, my back pain is gone and I feel stronger than ever. The instructors are incredibly attentive and tailor every session to what your body needs. I started with mat classes and gradually moved to reformer — the progression felt natural and never overwhelming. This studio has become an essential part of my weekly routine.",
  },
  {
    id: 2,
    short: "The morning group classes are the perfect start to my day. Energising, focused, and always in a warm, welcoming atmosphere.",
    full: "The morning group classes are the perfect start to my day. Energising, focused, and always in a warm, welcoming atmosphere. I've tried many fitness studios in Mumbai, but SRA stands out for its attention to detail and genuine care for each client. The Chembur studio is beautiful, and the community here is wonderful. I leave every session feeling centred and ready for anything.",
  },
  {
    id: 3,
    short: "Gyrotonic at SRA opened up a range of motion I didn't know I had. Fluid, graceful, and deeply therapeutic.",
    full: "Gyrotonic at SRA opened up a range of motion I didn't know I had. Fluid, graceful, and deeply therapeutic. I came in with stiff shoulders and limited flexibility from years at a desk job. Within a month, the difference was remarkable. The equipment and method are unlike anything else, and the instructors guide you through every spiral and extension with patience and expertise.",
  },
  {
    id: 4,
    short: "Private sessions at SRA Bandra are worth every minute. Personalised, precise, and perfectly paced for my goals.",
    full: "Private sessions at SRA Bandra are worth every minute. Personalised, precise, and perfectly paced for my goals. My instructor understood my postpartum recovery needs from day one and built a programme that rebuilt my core safely. I appreciate how they explain the why behind every movement — it makes you more mindful and connected to your body. Highly recommend for anyone seeking one-on-one attention.",
  },
  {
    id: 5,
    short: "I've seen real improvements in my posture and breathing. The focus on core and alignment is exactly what I needed.",
    full: "I've seen real improvements in my posture and breathing. The focus on core and alignment is exactly what I needed. As someone who spends long hours sitting, Pilates at SRA has been transformative. The ladder barrel and cadillac sessions especially helped open up my spine. The studio environment is calm and unhurried — you never feel rushed or judged.",
  },
  {
    id: 6,
    short: "The Bodhi suspension classes challenged me in the best way. Stronger, more balanced, and genuinely enjoying every session.",
    full: "The Bodhi suspension classes challenged me in the best way. Stronger, more balanced, and genuinely enjoying every session. I was hesitant to try suspension training but the team made me feel completely at ease. It's a full-body workout that feels more like mindful movement than exercise. My coordination and core stability have improved dramatically in just six weeks.",
  },
  {
    id: 7,
    short: "SRA feels like a sanctuary. The combination of Pilates and recovery techniques has helped me manage stress beautifully.",
    full: "SRA feels like a sanctuary. The combination of Pilates and recovery techniques has helped me manage stress beautifully. Between work pressure and family life, this is my hour to reset. The instructors remember your progress, adjust when you're having an off day, and celebrate your wins. Both Chembur and Bandra locations are impeccably maintained with a serene, premium feel.",
  },
  {
    id: 8,
    short: "Reformer classes here are exceptional. Challenging but accessible — I feel the results in my everyday movement.",
    full: "Reformer classes here are exceptional. Challenging but accessible — I feel the results in my everyday movement. Climbing stairs, carrying groceries, even sleeping better — it all improved. The spring settings are adjusted perfectly for your level, and you're never pushed beyond what your body can handle. I started as a complete beginner and now look forward to every class.",
  },
  {
    id: 9,
    short: "Gyrokinesis sessions are meditative and powerful. My flexibility and mental clarity have both improved so much.",
    full: "Gyrokinesis sessions are meditative and powerful. My flexibility and mental clarity have both improved so much. The rhythmic, flowing movements on the stool and mat create a moving meditation. It's gentle yet incredibly effective. SRA's approach to women's fitness — understanding our bodies holistically — is what keeps me coming back month after month.",
  },
  {
    id: 10,
    short: "From my first visit, I felt at home. The team at SRA truly cares about helping women feel and move better.",
    full: "From my first visit, I felt at home. The team at SRA truly cares about helping women feel and move better. I joined for fitness but stayed for the community and the genuine expertise. Whether it's mat, MOTR, or a private cadillac session, every class is thoughtfully designed. SRA isn't just a studio — it's a place where you invest in yourself and see real, lasting results.",
  },
];

function renderTestimonialCards() {
  const track = document.getElementById("testimonial-track");
  if (!track) return;

  track.innerHTML = TESTIMONIALS.map(
    (t, i) => `
    <article class="testimonial-card" data-index="${i}" tabindex="0" role="button" aria-label="Read testimonial">
      <div class="testimonial-card-body">
        <p class="testimonial-card-text">${t.short}</p>
      </div>
      <div class="testimonial-card-name">${CLIENT_NAME}</div>
    </article>`
  ).join("");

  track.querySelectorAll(".testimonial-card").forEach((card) => {
    card.addEventListener("click", () => openExpanded(Number(card.dataset.index)));
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openExpanded(Number(card.dataset.index));
      }
    });
  });
}

let currentIndex = 0;
let testimonialsLenis = null;

function openExpanded(index) {
  currentIndex = index;
  const overlay = document.getElementById("testimonial-expanded");
  if (!overlay) return;

  updateExpandedContent();
  overlay.classList.add("open");
  overlay.setAttribute("aria-hidden", "false");
  testimonialsLenis?.stop();
}

function closeExpanded() {
  const overlay = document.getElementById("testimonial-expanded");
  overlay?.classList.remove("open");
  overlay?.setAttribute("aria-hidden", "true");
  testimonialsLenis?.start();
}

function updateExpandedContent() {
  const t = TESTIMONIALS[currentIndex];
  const overlay = document.getElementById("testimonial-expanded");
  if (!t || !overlay) return;

  overlay.querySelector(".testimonial-expanded-name").textContent = CLIENT_NAME;
  overlay.querySelector(".testimonial-expanded-text").textContent = t.full;

  const prev = overlay.querySelector(".testimonial-nav-prev");
  const next = overlay.querySelector(".testimonial-nav-next");
  prev.hidden = currentIndex === 0;
  next.hidden = currentIndex === TESTIMONIALS.length - 1;
}

function navigate(direction) {
  const nextIndex = currentIndex + direction;
  if (nextIndex < 0 || nextIndex >= TESTIMONIALS.length) return;
  currentIndex = nextIndex;
  updateExpandedContent();
}

function initTestimonialHorizontalScroll() {
  const section = document.querySelector(".testimonials-section");
  const sticky = document.querySelector(".testimonials-sticky");
  const panel = document.querySelector(".testimonials-panel");
  const track = document.getElementById("testimonial-track");

  if (!section || !sticky || !panel || !track || typeof gsap === "undefined") return;

  gsap.registerPlugin(ScrollTrigger);

  testimonialsLenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
  });

  testimonialsLenis.on("scroll", ScrollTrigger.update);

  gsap.ticker.add((time) => {
    testimonialsLenis.raf(time * 1000);
  });
  gsap.ticker.lagSmoothing(0);

  const mm = gsap.matchMedia();

  mm.add("(min-width: 769px)", () => {
    const getScrollDistance = () =>
      Math.max(track.scrollWidth - panel.clientWidth, 0);

    const tween = gsap.to(track, {
      x: () => -getScrollDistance(),
      ease: "none",
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: () => `+=${getScrollDistance()}`,
        pin: sticky,
        scrub: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      },
    });

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
      gsap.set(track, { x: 0 });
    };
  });

  mm.add("(max-width: 768px)", () => {
    panel.style.overflowX = "auto";
    panel.style.webkitOverflowScrolling = "touch";
    gsap.set(track, { x: 0 });

    return () => {
      panel.style.overflowX = "";
      panel.style.webkitOverflowScrolling = "";
    };
  });

  window.addEventListener("resize", () => ScrollTrigger.refresh());

  requestAnimationFrame(() => ScrollTrigger.refresh());
}

function initTestimonials() {
  renderTestimonialCards();
  initTestimonialHorizontalScroll();

  const overlay = document.getElementById("testimonial-expanded");
  if (!overlay) return;

  overlay.querySelector(".testimonial-nav-prev")?.addEventListener("click", (e) => {
    e.stopPropagation();
    navigate(-1);
  });
  overlay.querySelector(".testimonial-nav-next")?.addEventListener("click", (e) => {
    e.stopPropagation();
    navigate(1);
  });

  overlay.addEventListener("click", (e) => {
    if (e.target.closest(".testimonial-expanded-panel")) return;
    if (e.target.closest(".testimonial-nav")) return;
    closeExpanded();
  });

  document.addEventListener("keydown", (e) => {
    if (!overlay.classList.contains("open")) return;
    if (e.key === "Escape") closeExpanded();
    if (e.key === "ArrowLeft" && currentIndex > 0) navigate(-1);
    if (e.key === "ArrowRight" && currentIndex < TESTIMONIALS.length - 1) navigate(+1);
  });
}

document.addEventListener("DOMContentLoaded", initTestimonials);
