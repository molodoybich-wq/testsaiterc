(() => {
  const TG = "vremonte161";

  // Year
  const y = document.getElementById("year");
  if (y) y.textContent = String(new Date().getFullYear());

  // Mobile menu
  const burger = document.getElementById("burger");
  const mnav = document.getElementById("mnav");

  function setMenu(open) {
    if (!burger || !mnav) return;
    mnav.hidden = !open;
    burger.setAttribute("aria-expanded", String(open));
  }

  if (burger && mnav) {
    burger.addEventListener("click", () => setMenu(mnav.hidden));
    mnav.addEventListener("click", (e) => {
      if (e.target.closest(".mnav__link")) setMenu(false);
    });
    window.addEventListener("keydown", (e) => { if (e.key === "Escape") setMenu(false); });
  }

  // Smooth anchors
  document.addEventListener("click", (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    const id = a.getAttribute("href");
    if (!id || id === "#") return;
    const el = document.querySelector(id);
    if (!el) return;
    e.preventDefault();
    el.scrollIntoView({ behavior: "smooth", block: "start" });
    setMenu(false);
  });

  // Reveal animation
  const reveal = document.querySelectorAll(".reveal");
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (en.isIntersecting) en.target.classList.add("in");
    });
  }, { threshold: 0.12 });
  reveal.forEach(el => io.observe(el));

  // FAQ accordion
  const faq = document.getElementById("faqList");
  if (faq) {
    faq.addEventListener("click", (e) => {
      const btn = e.target.closest(".qa__q");
      if (!btn) return;
      const box = btn.closest(".qa");
      if (!box) return;
      box.classList.toggle("open");
    });
  }

  // Photo modal
  const modal = document.getElementById("modal");
  const modalImg = document.getElementById("modalImg");
  const modalClose = document.getElementById("modalClose");

  function openModal(src) {
    if (!modal || !modalImg) return;
    modalImg.src = src;
    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
  }
  function closeModal() {
    if (!modal || !modalImg) return;
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
    modalImg.src = "";
  }

  document.querySelectorAll("[data-photo]").forEach((b) => {
    b.addEventListener("click", () => openModal(b.getAttribute("data-photo")));
  });
  if (modalClose) modalClose.addEventListener("click", closeModal);
  if (modal) modal.addEventListener("click", (e) => { if (e.target === modal) closeModal(); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeModal(); });

  // Telegram templates
  const templates = {
    price: "Здравствуйте! Хочу узнать ориентировочную цену. Модель: ____. Проблема: ____.",
    time: "Здравствуйте! Подскажите по срокам ремонта. Модель: ____. Проблема: ____.",
    pickup: "Здравствуйте! Подскажите по курьеру/доставке. Устройство: ____. Район: ____.",
    water: "Здравствуйте! Техника была после воды. Устройство: ____. Что произошло: ____. Сколько прошло времени: ____."
  };

  document.querySelectorAll("[data-template]").forEach((b) => {
    b.addEventListener("click", () => {
      const key = b.getAttribute("data-template");
      const msg = templates[key] || "Здравствуйте!";
      window.open(`https://t.me/${TG}?text=${encodeURIComponent(msg)}`, "_blank", "noopener,noreferrer");
    });
  });

  // Service templates
  const svcMap = {
    phone: "Здравствуйте! Нужен ремонт телефона. Модель: ____. Проблема: ____.",
    pc: "Здравствуйте! Нужен ремонт/обслуживание ПК или ноутбука. Модель: ____. Проблема: ____.",
    tv: "Здравствуйте! Нужен ремонт телевизора. Модель: ____. Проблема: ____.",
    ps: "Здравствуйте! Нужен ремонт приставки. Модель: ____. Проблема: ____.",
    coffee: "Здравствуйте! Нужен ремонт кофемашины. Модель: ____. Проблема: ____.",
    dyson: "Здравствуйте! Нужен ремонт Dyson/пылесоса. Модель: ____. Проблема: ____."
  };

  document.querySelectorAll("[data-service]").forEach((b) => {
    b.addEventListener("click", () => {
      const key = b.getAttribute("data-service");
      const msg = svcMap[key] || "Здравствуйте! Хочу узнать стоимость ремонта.";
      window.open(`https://t.me/${TG}?text=${encodeURIComponent(msg)}`, "_blank", "noopener,noreferrer");
    });
  });

  // Lead forms -> Telegram
  function bindLeadForm(id) {
    const form = document.getElementById(id);
    if (!form) return;

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const fd = new FormData(form);
      const device = String(fd.get("device") || "").trim();
      const issue = String(fd.get("issue") || "").trim();
      const urgent = String(fd.get("urgent") || "").trim();
      const contact = String(fd.get("contact") || "").trim();

      const lines = [
        "Здравствуйте! Заявка с сайта «В ремонте».",
        `Устройство: ${device}`,
        `Проблема: ${issue}`,
      ];

      if (urgent) lines.push(`Срочность: ${urgent}`);
      lines.push(`Контакт: ${contact || "не указали"}`);
      lines.push("Адреса: Ткачева 22 / Заводская 25");

      const url = `https://t.me/${TG}?text=${encodeURIComponent(lines.join("\n"))}`;
      window.open(url, "_blank", "noopener,noreferrer");
      form.reset();
    });
  }
  bindLeadForm("leadForm");
  bindLeadForm("leadForm2");

  
  // Cookie banner
  const cookieBanner = document.getElementById("cookieBanner");
  const cookieAccept = document.getElementById("cookieAccept");
  const cookieClose = document.getElementById("cookieClose");

  if (cookieBanner && !localStorage.getItem("cookieAccepted")) {
    cookieBanner.hidden = false;
  }

  if (cookieAccept) {
    cookieAccept.addEventListener("click", () => {
      localStorage.setItem("cookieAccepted", "true");
      if (cookieBanner) cookieBanner.hidden = true;
    });
  }

  if (cookieClose) {
    cookieClose.addEventListener("click", () => {
      if (cookieBanner) cookieBanner.hidden = true;
    });
  }

// ToTop button
  const toTop = document.getElementById("toTop");
  if (toTop) {
    const onScroll = () => {
      if (window.scrollY > 600) toTop.classList.add("show");
      else toTop.classList.remove("show");
    };
    window.addEventListener("scroll", onScroll);
    onScroll();
    toTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
  }
})();
