// Header state + scroll progress
const header = document.getElementById("site-header");
const progress = document.getElementById("scroll-progress");

const onScroll = () => {
  header.classList.toggle("is-scrolled", window.scrollY > 12);

  if (progress) {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const ratio = scrollable > 0 ? window.scrollY / scrollable : 0;
    progress.style.transform = `scaleX(${Math.min(ratio, 1)})`;
  }
};

onScroll();
window.addEventListener("scroll", onScroll, { passive: true });
window.addEventListener("resize", onScroll);

// Mobile navigation
const menuToggle = document.getElementById("menu-toggle");
const navLinks = document.getElementById("nav-links");
const navAnchors = [...document.querySelectorAll(".nav-links a")];

const closeMenu = () => {
  navLinks.classList.remove("active");
  menuToggle.setAttribute("aria-expanded", "false");
};

menuToggle.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("active");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});

navAnchors.forEach((link) => link.addEventListener("click", closeMenu));

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeMenu();
});

// Scroll spy: highlight the section currently in view
const sections = [...document.querySelectorAll("main section[id]")];

if ("IntersectionObserver" in window) {
  const spy = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        navAnchors.forEach((link) => {
          link.classList.toggle(
            "active",
            link.getAttribute("href") === `#${entry.target.id}`
          );
        });
      });
    },
    { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
  );

  sections.forEach((section) => spy.observe(section));
}

// Keep the last link highlighted when the page is scrolled to the end
const lastSection = sections[sections.length - 1];

window.addEventListener(
  "scroll",
  () => {
    const atBottom =
      window.innerHeight + window.scrollY >=
      document.documentElement.scrollHeight - 4;

    if (atBottom && lastSection) {
      navAnchors.forEach((link) => {
        link.classList.toggle(
          "active",
          link.getAttribute("href") === `#${lastSection.id}`
        );
      });
    }
  },
  { passive: true }
);

// Reveal on scroll
const revealItems = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
  const revealer = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { rootMargin: "0px 0px -8% 0px", threshold: 0.1 }
  );

  revealItems.forEach((item) => revealer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

// Typing role line
const typeTarget = document.getElementById("type-text");
const roles = ["Frontend Developer", "Web Designer", "JavaScript Learner"];
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

if (typeTarget && !reduceMotion.matches) {
  let roleIndex = 0;
  let charIndex = roles[0].length;
  let deleting = true;

  typeTarget.textContent = roles[0];

  const tick = () => {
    const word = roles[roleIndex];

    if (deleting) {
      charIndex -= 1;
    } else {
      charIndex += 1;
    }

    typeTarget.textContent = word.slice(0, charIndex);

    let delay = deleting ? 55 : 85;

    if (!deleting && charIndex === word.length) {
      deleting = true;
      delay = 1700;
    } else if (deleting && charIndex === 0) {
      deleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      delay = 350;
    }

    window.setTimeout(tick, delay);
  };

  window.setTimeout(tick, 1900);
}

// Photo fallback when profile.jpg is missing
const portrait = document.querySelector(".portrait-frame img");

if (portrait) {
  const showFallback = () => portrait.remove();

  if (portrait.complete && portrait.naturalWidth === 0) {
    showFallback();
  } else {
    portrait.addEventListener("error", showFallback);
  }
}

// Copy email
const copyButton = document.getElementById("copy-email");
const copyStatus = document.getElementById("copy-status");

if (copyButton && copyStatus) {
  const email = copyButton.dataset.email;
  let resetTimer;

  copyButton.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(email);
      copyStatus.textContent = "Email copied to clipboard.";
    } catch {
      copyStatus.textContent = email;
    }

    window.clearTimeout(resetTimer);
    resetTimer = window.setTimeout(() => {
      copyStatus.textContent = "";
    }, 2600);
  });
}

// Automatic copyright year
document.getElementById("year").textContent = new Date().getFullYear();
