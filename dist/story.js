const flowerGlyphs = ["✿", "✾", "❀", "✽"];

const byId = (id) => document.getElementById(id);
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
let musicWidget = null;
let journeyStarted = false;
const songStartMs = 71_000;

function seedFlowers(container, total, offset = 0) {
  for (let index = 0; index < total; index += 1) {
    const flower = document.createElement("span");
    const seed = index + offset;
    flower.className = "sky-flower";
    flower.textContent = flowerGlyphs[seed % flowerGlyphs.length];
    flower.style.setProperty("left", `${(seed * 37.17) % 100}%`);
    flower.style.setProperty("top", `${(seed * 61.31) % 100}%`);
    flower.style.setProperty("font-size", `${1.05 + ((seed * 17) % 25) / 10}rem`);
    flower.style.setProperty("--turn", `${(seed * 31) % 360}deg`);
    flower.style.setProperty("--duration", `${4.2 + ((seed * 7) % 38) / 10}s`);
    flower.style.setProperty("--delay", `${-((seed * 13) % 46) / 10}s`);
    flower.style.setProperty("--alpha", `${.32 + ((seed * 11) % 48) / 100}`);
    container.append(flower);
  }
}

function setupMusic() {
  const frame = byId("soundcloud-player");
  if (!window.SC) return;
  musicWidget = window.SC.Widget(frame);
  musicWidget.bind(window.SC.Widget.Events.READY, () => {
    musicWidget.setVolume(43);
    musicWidget.seekTo(songStartMs);
    byId("begin-journey").classList.add("sealed-letter--ready");
  });
  musicWidget.bind(window.SC.Widget.Events.PLAY, () => {
    musicWidget.seekTo(songStartMs);
    openJourney();
  });
}

function openJourney() {
  if (journeyStarted) return;
  journeyStarted = true;
  // The iframe is the actual SoundCloud player.  It must stay in the document
  // after the envelope fades away or the browser immediately stops its audio.
  byId("soundcloud-player").classList.add("letter-sound-trigger--playing");
  byId("journey").hidden = false;
  document.body.classList.add("journey-open");
  const entry = byId("letter-entry");
  entry.classList.add("letter-entry--opening");
  window.setTimeout(() => {
    // Keep the envelope in the DOM (visually hidden by CSS) because it owns
    // the SoundCloud iframe that is currently playing.
    entry.classList.add("letter-entry--played");
    byId("carta-inicial").scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
  }, reduceMotion ? 0 : 760);
}

function setupContinueButtons() {
  document.querySelectorAll("[data-next]").forEach((button) => {
    button.addEventListener("click", () => {
      byId(button.dataset.next).scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
    });
  });
}

function setupReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: .16 });
  document.querySelectorAll(".reveal").forEach((item) => observer.observe(item));
}

function setupGarden() {
  const bloom = byId("garden-bloom");
  const response = byId("garden-response");
  byId("grow-garden").addEventListener("click", (event) => {
    for (let index = 0; index < 54; index += 1) {
      const flower = document.createElement("span");
      flower.textContent = flowerGlyphs[index % flowerGlyphs.length];
      flower.style.setProperty("--bloom-delay", `${(index % 18) * 45}ms`);
      flower.style.setProperty("--bloom-rotate", `${((index * 19) % 34) - 17}deg`);
      bloom.append(flower);
    }
    bloom.classList.add("garden-bloom--grown");
    response.textContent = "Ahora sí: flores amarillas por todos lados, para ti.";
    event.currentTarget.hidden = true;
  }, { once: true });
}

seedFlowers(byId("entry-flowers"), 42);
seedFlowers(byId("flower-sky"), 124, 42);
setupMusic();
setupContinueButtons();
setupReveal();
setupGarden();
