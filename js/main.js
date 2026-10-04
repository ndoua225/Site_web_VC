(() => {
  // ====== À RENSEIGNER : coordonnées réelles ======
  const CONFIG = {
    email: "contact@exemple.com",
    whatsapp: "https://wa.me/",              // ex. https://wa.me/225XXXXXXXXXX
    linkedin: "https://www.linkedin.com/",   // ex. https://www.linkedin.com/in/ton-profil
    github: "https://github.com/",           // ex. https://github.com/ton-pseudo
  };

  document.documentElement.classList.add("js");

  const navbar = document.getElementById("navbar");
  const burger = document.getElementById("burger");
  const links = document.querySelectorAll(".nav__link");

  // Coordonnées injectées dans tous les liens
  document.querySelectorAll("[data-social]").forEach((a) => {
    const k = a.dataset.social;
    a.href = k === "email" ? `mailto:${CONFIG.email}` : CONFIG[k];
  });

  // Navbar : fond au scroll
  const onScroll = () => navbar.classList.toggle("is-scrolled", window.scrollY > 10);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  // Menu mobile
  const setMenu = (open) => {
    navbar.classList.toggle("is-open", open);
    burger.setAttribute("aria-expanded", String(open));
    burger.setAttribute("aria-label", open ? "Fermer le menu" : "Ouvrir le menu");
  };
  burger.addEventListener("click", () => setMenu(burger.getAttribute("aria-expanded") !== "true"));
  links.forEach((l) => l.addEventListener("click", () => setMenu(false)));
  document.addEventListener("keydown", (e) => e.key === "Escape" && setMenu(false));

  // Lien actif : les sections intermédiaires dépendent de « À propos »
  const map = { accueil: "accueil", apropos: "apropos", competences: "apropos", projets: "apropos", methode: "apropos", contact: "contact" };
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        const target = map[en.target.id];
        links.forEach((l) => l.classList.toggle("is-active", l.dataset.section === target));
      });
    },
    { rootMargin: "-40% 0px -55% 0px" }
  );
  Object.keys(map).forEach((id) => { const s = document.getElementById(id); s && io.observe(s); });

  // Apparition au scroll
  const rio = new IntersectionObserver(
    (entries) => entries.forEach((en) => {
      if (en.isIntersecting) { en.target.classList.add("is-visible"); rio.unobserve(en.target); }
    }),
    { threshold: 0.12 }
  );
  document.querySelectorAll(".reveal").forEach((el) => rio.observe(el));

  // Formulaire : validation + ouverture du client mail (aucun backend en V1)
  const form = document.getElementById("contact-form");
  const status = document.getElementById("form-status");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    let ok = true;
    form.querySelectorAll("input, textarea").forEach((f) => {
      const valid = f.value.trim() && (f.type !== "email" || /^\S+@\S+\.\S+$/.test(f.value));
      f.closest(".field").classList.toggle("has-error", !valid);
      if (!valid) ok = false;
    });
    status.className = "form__status";
    if (!ok) { status.textContent = "Merci de remplir correctement tous les champs."; status.classList.add("is-error"); return; }
    const d = Object.fromEntries(new FormData(form));
    const body = `${d.message}\n\n— ${d.name} (${d.email})`;
    window.location.href = `mailto:${CONFIG.email}?subject=${encodeURIComponent(d.subject)}&body=${encodeURIComponent(body)}`;
    status.textContent = "Votre application mail s'ouvre pour envoyer le message.";
    status.classList.add("is-ok");
    form.reset();
  });
})();
