const story = {
  qualities: [
    "Tu mirada.",
    "La forma en que nos entendemos.",
    "Hablar de la vida contigo.",
    "Tu carta hecha a mano.",
    "Las noches que se quedan en fotos.",
    "Que contigo la historia no parece terminada."
  ],
  timeline: [
    { title: "Una fiesta", text: "Amigos en común, una primera conversación y una mirada que se quedó." },
    { title: "Hablar de la vida", text: "Porque algunas conversaciones hacen que una persona se sienta distinta." },
    { title: "Día del cine", text: "La primera salida y también la primera foto juntos." },
    { title: "Una carta hecha a mano", text: "Un detalle pequeño que se volvió recuerdo." },
    { title: "Luna", text: "Un lugar que ya tiene un poquito de historia." }
  ],
  gallery: [
    { file: "carro-sonrisa.webp", alt: "Mafer y Edison sonriendo juntos de noche", caption: "Una noche juntos." },
    { file: "carro-menton.webp", alt: "Mafer y Edison en un auto de noche", caption: "Un momento tranquilo." },
    { file: "carro-angulo.webp", alt: "Mafer y Edison miran a la cámara de noche", caption: "Una foto de esas que guardan el momento." },
    { file: "palmeras-juntos.webp", alt: "Edison y Mafer abrazados de noche entre palmeras", caption: "Entre palmeras y cerquita." },
    { file: "palmeras-cerca.webp", alt: "Mafer abraza a Edison entre palmeras", caption: "Una forma bonita de estar juntos." },
    { file: "hombros.webp", alt: "Mafer sobre los hombros de Edison de noche", caption: "Otro instante para recordar." },
    { file: "sillon-juntos.webp", alt: "Mafer y Edison juntos en interior", caption: "Una foto sin prisa." }
  ],
  gardenMessages: [
    "Por tu mirada.",
    "Por cómo nos entendemos.",
    "Por hablar de la vida.",
    "Por la primera salida al cine.",
    "Por nuestra primera foto juntos.",
    "Por tu carta hecha a mano.",
    "Por las noches que se quedan en fotos.",
    "Por ser parte de mis días.",
    "Por los 2 loquitos.",
    "Por todo lo que todavía falta escribir."
  ],
  missingMessages: [
    "Si llegaste hasta aquí, recuerda: este jardín sigue encendido para ti.",
    "Mafi, vuelve a mirar una foto. A veces basta una para volver a sentir cerca.",
    "Los 2 loquitos todavía tienen mucho jardín por llenar.",
    "Tu mirada fue una primera pista. Este jardín es otra.",
    "La carta hecha a mano todavía cuenta una historia bonita.",
    "Aquí hay un lugar para volver cuando quieras."
  ],
  soundtrack: {
    ojitos: {
      title: "Ojitos Lindos",
      artist: "Bad Bunny & Bomba Estéreo",
      url: "https://soundcloud.com/badbunny15/bad-bunny-bomba-estereo-ojitos"
    },
    mai: {
      title: "MAI",
      artist: "Milo J",
      url: "https://soundcloud.com/drme-603987709/milo-j-mai-111"
    },
    morfina: {
      title: "Morfina",
      artist: "Humbe",
      url: "https://soundcloud.com/humbe-sc/morfina"
    }
  }
};

const byId = (id) => document.getElementById(id);
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
let startSoundtrack = () => {};

function renderStory() {
  byId("qualities").innerHTML = story.qualities.map((item, index) => `
    <article class="quality-card reveal" style="--delay:${index * 80}ms">
      <span>0${index + 1}</span><p>${item}</p>
    </article>`).join("");

  byId("timeline").innerHTML = story.timeline.map((item, index) => `
    <li class="timeline__item reveal">
      <span class="timeline__dot">${index + 1}</span>
      <div><h3>${item.title}</h3><p>${item.text}</p></div>
    </li>`).join("");

  byId("gallery").innerHTML = story.gallery.map((item, index) => `
    <button class="gallery__item reveal" type="button" data-index="${index}" aria-label="Abrir foto: ${item.caption}">
      <img src="media/${item.file}" alt="${item.alt}" loading="lazy" />
      <span>${item.caption}</span>
    </button>`).join("");
}

function setupReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll(".reveal").forEach((item) => observer.observe(item));
}

function setupModal(dialog) {
  dialog.querySelector(".modal__close").addEventListener("click", () => dialog.close());
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) dialog.close();
  });
}

function setupGallery() {
  const dialog = byId("photo-modal");
  const image = byId("modal-image");
  const caption = byId("modal-caption");
  setupModal(dialog);
  byId("gallery").addEventListener("click", (event) => {
    const item = event.target.closest("[data-index]");
    if (!item) return;
    const photo = story.gallery[Number(item.dataset.index)];
    image.src = `media/${photo.file}`;
    image.alt = photo.alt;
    caption.textContent = photo.caption;
    dialog.showModal();
  });
}

function setupGarden() {
  const plot = byId("garden-plot");
  const count = byId("garden-count");
  const button = byId("plant-flower");
  const stored = Number(window.sessionStorage.getItem("maferFlowers") || 0);
  let planted = Math.min(Math.max(stored, 0), story.gardenMessages.length);

  const placeFlower = (index) => {
    const flower = document.createElement("button");
    flower.className = "planted-flower";
    flower.type = "button";
    flower.style.setProperty("--x", `${13 + ((index * 29) % 74)}%`);
    flower.style.setProperty("--y", `${19 + ((index * 37) % 64)}%`);
    flower.style.setProperty("--r", `${((index * 19) % 25) - 12}deg`);
    flower.setAttribute("aria-label", story.gardenMessages[index]);
    flower.textContent = "✿";
    flower.addEventListener("click", () => {
      count.textContent = story.gardenMessages[index];
    });
    plot.append(flower);
  };

  const update = () => {
    count.textContent = planted >= story.gardenMessages.length
      ? "Creo que entendiste la idea… podría seguir plantando. Pero necesitaría un jardín mucho más grande."
      : `${planted} flor${planted === 1 ? "" : "es"} plantada${planted === 1 ? "" : "s"}.`;
    button.disabled = planted >= story.gardenMessages.length;
  };

  for (let index = 0; index < planted; index += 1) placeFlower(index);
  update();
  button.addEventListener("click", () => {
    if (planted >= story.gardenMessages.length) return;
    placeFlower(planted);
    count.textContent = story.gardenMessages[planted];
    planted += 1;
    window.sessionStorage.setItem("maferFlowers", String(planted));
    if (navigator.vibrate) navigator.vibrate(10);
    update();
  });
}

function setupMessages() {
  let messageIndex = -1;
  byId("missing-button").addEventListener("click", () => {
    messageIndex = (messageIndex + 1) % story.missingMessages.length;
    byId("missing-message").textContent = story.missingMessages[messageIndex];
  });
}

function setupMusic() {
  const frame = byId("soundcloud-player");
  const toggle = byId("music-toggle");
  const title = byId("music-title");
  const detail = byId("music-detail");
  const dock = byId("music-control");
  const state = { active: "ojitos", ready: false, playing: false, widget: null };

  const updateControl = () => {
    const song = story.soundtrack[state.active];
    title.textContent = state.playing ? song.title : "La música está en pausa.";
    detail.textContent = state.playing ? song.artist : "Toca Sonido para continuar.";
    toggle.textContent = state.playing ? "Pausar" : "Sonido";
    toggle.disabled = !state.ready;
    toggle.setAttribute("aria-pressed", String(state.playing));
    dock.classList.toggle("music-dock--playing", state.playing);
  };

  const playActive = () => {
    if (!state.ready || !state.playing) return;
    const song = story.soundtrack[state.active];
    state.widget.load(song.url, {
      auto_play: true,
      buying: false,
      sharing: false,
      callback: () => state.widget.setVolume(44)
    });
  };

  const loadTrack = (key) => {
    if (!story.soundtrack[key] || key === state.active) return;
    state.active = key;
    if (state.ready) {
      state.widget.pause();
      playActive();
    }
    updateControl();
  };

  if (!window.SC) {
    detail.textContent = "La música no pudo cargarse.";
    return;
  }

  state.widget = window.SC.Widget(frame);
  state.widget.bind(window.SC.Widget.Events.READY, () => {
    state.ready = true;
    state.widget.setVolume(44);
    playActive();
    updateControl();
  });
  state.widget.bind(window.SC.Widget.Events.PLAY, () => {
    state.playing = true;
    updateControl();
  });
  state.widget.bind(window.SC.Widget.Events.PAUSE, () => {
    state.playing = false;
    updateControl();
  });

  startSoundtrack = () => {
    state.playing = true;
    playActive();
    updateControl();
  };

  toggle.addEventListener("click", () => {
    if (!state.ready) return;
    if (state.playing) {
      state.widget.pause();
    } else {
      state.playing = true;
      state.widget.play();
      updateControl();
    }
  });

  const layers = document.querySelectorAll("[data-soundtrack]");
  const layerObserver = new IntersectionObserver((entries) => {
    const visible = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (visible) loadTrack(visible.target.dataset.soundtrack);
  }, { threshold: [0.35, 0.6] });
  layers.forEach((layer) => layerObserver.observe(layer));
  updateControl();
}

function setupOpening() {
  byId("enter-garden").addEventListener("click", () => {
    byId("opening").classList.add("opening--leaving");
    byId("garden").hidden = false;
    startSoundtrack();
    window.setTimeout(() => {
      byId("opening").remove();
      window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
    }, reduceMotion ? 0 : 720);
  });
}

function setupFinale() {
  byId("final-button").addEventListener("click", () => {
    byId("final-flower").classList.add("final-section__flower--open");
    byId("final-reveal").hidden = false;
    byId("final-button").hidden = true;
  });
}

renderStory();
setupMusic();
setupOpening();
setupReveal();
setupGallery();
setupGarden();
setupMessages();
setupFinale();

const letterModal = byId("letter-modal");
const secretModal = byId("secret-modal");
setupModal(letterModal);
setupModal(secretModal);
byId("letter-button").addEventListener("click", () => letterModal.showModal());
byId("secret-button").addEventListener("click", () => secretModal.showModal());
