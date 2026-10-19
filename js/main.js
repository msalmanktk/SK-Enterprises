(() => {
  const toggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".nav-links");
  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      const open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute(
        "aria-label",
        open ? "Close navigation menu" : "Open navigation menu",
      );
      toggle.textContent = open ? "×" : "☰";
    });
    nav.querySelectorAll("a").forEach((link) =>
      link.addEventListener("click", () => {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.textContent = "☰";
      }),
    );
  }

  const year = document.querySelector("[data-year]");
  if (year) year.textContent = new Date().getFullYear();

  document.querySelectorAll("[data-call]").forEach((el) => {
    el.addEventListener("click", () => {
      const phone = window.SULAL_CONFIG?.phoneNumber || "";
      if (!phone || phone.includes("*")) {
        alert("Please add your real phone number in js/config.js first.");
        return;
      }
      window.location.href = `tel:+${phone.replace(/\D/g, "")}`;
    });
  });

  document.querySelectorAll("[data-whatsapp]").forEach((el) => {
    el.addEventListener("click", () => {
      const number = window.SULAL_CONFIG?.whatsappNumber || "";
      if (!number || number.includes("*")) {
        alert("Please add your real WhatsApp number in js/config.js first.");
        return;
      }
      const message =
        el.dataset.message ||
        "Hello SULAL Entrepreneur UK, I would like to make an inquiry.";
      window.open(
        `https://wa.me/${number.replace(/\D/g, "")}?text=${encodeURIComponent(message)}`,
        "_blank",
        "noopener,noreferrer",
      );
    });
  });
})();

window.SULAL = {
  escapeHTML(value) {
    return String(value ?? "").replace(
      /[&<>"']/g,
      (ch) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        })[ch],
    );
  },
  money(value) {
    const n = Number(String(value ?? "").replace(/[^\d.]/g, ""));
    return Number.isFinite(n)
      ? "PKR " + n.toLocaleString("en-PK")
      : "Price on request";
  },
  csvToObjects(csv) {
    // Small CSV parser supporting quoted fields and escaped quotes.
    const rows = [];
    let row = [],
      field = "",
      quoted = false;
    for (let i = 0; i < csv.length; i++) {
      const ch = csv[i],
        next = csv[i + 1];
      if (ch === '"' && quoted && next === '"') {
        field += '"';
        i++;
      } else if (ch === '"') quoted = !quoted;
      else if (ch === "," && !quoted) {
        row.push(field);
        field = "";
      } else if ((ch === "\n" || ch === "\r") && !quoted) {
        if (ch === "\r" && next === "\n") i++;
        row.push(field);
        field = "";
        if (row.some((v) => v.trim() !== "")) rows.push(row);
        row = [];
      } else field += ch;
    }
    if (field.length || row.length) {
      row.push(field);
      rows.push(row);
    }
    if (!rows.length) return [];
    const headers = rows.shift().map((h) =>
      h
        .trim()
        .replace(/^\uFEFF/, "")
        .toLowerCase(),
    );
    return rows.map((values) =>
      Object.fromEntries(headers.map((h, i) => [h, (values[i] ?? "").trim()])),
    );
  },
  async loadListings(type) {
    const key = type === "cars" ? "carsCsvUrl" : "propertiesCsvUrl";
    const url = window.SULAL_CONFIG?.[key];
    if (!url) return null;
    const response = await fetch(url, { cache: "no-store" });
    if (!response.ok)
      throw new Error("Could not load published Google Sheets data.");
    const text = await response.text();
    return window.SULAL.csvToObjects(text).filter(
      (item) => (item.status || "").toLowerCase() === "active",
    );
  },
  safeImage(url, fallback) {
    try {
      const parsed = new URL(url, window.location.href);
      if (["https:", "http:"].includes(parsed.protocol)) return parsed.href;
    } catch (_) {}
    return fallback;
  },
};

// Homepage hero slider: auto-advance, arrows, dots, and pause on hover/focus.
document.addEventListener("DOMContentLoaded", () => {
  const slider = document.querySelector("#sulalSlider");
  if (!slider) return;
  const slides = [...slider.querySelectorAll(".sulal-slide")];
  const dots = [...slider.querySelectorAll(".sulal-slider__dots button")];
  const prev = slider.querySelector(".sulal-slider__prev");
  const next = slider.querySelector(".sulal-slider__next");
  if (!slides.length) return;
  let current = 0;
  let timer = null;
  const show = (index) => {
    current = (index + slides.length) % slides.length;
    slides.forEach((slide, i) =>
      slide.classList.toggle("is-active", i === current),
    );
    dots.forEach((dot, i) => {
      dot.classList.toggle("is-active", i === current);
      dot.setAttribute("aria-current", i === current ? "true" : "false");
    });
  };
  const stop = () => {
    if (timer) clearInterval(timer);
    timer = null;
  };
  const start = () => {
    stop();
    timer = setInterval(() => show(current + 1), 5000);
  };
  prev.addEventListener("click", () => {
    show(current - 1);
    start();
  });
  next.addEventListener("click", () => {
    show(current + 1);
    start();
  });
  dots.forEach((dot, i) =>
    dot.addEventListener("click", () => {
      show(i);
      start();
    }),
  );
  // slider.addEventListener("mouseenter", stop);
  // slider.addEventListener("mouseleave", start);
  //i stoped it remember it
  slider.addEventListener("focusin", stop);
  slider.addEventListener("focusout", start);
  show(0);
  start();
});
