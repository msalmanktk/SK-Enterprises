/* ==========================================================================
   SK ENTERPRISES — theme.js  (Dark / Light mode)
   --------------------------------------------------------------------------
   Save as:  js/theme.js
   Har page ke <head> mein (defer ke BAGHAIR) lagayein:
     <script src="js/theme.js"></script>
   Defer is liye nahi, taake page dikhne se pehle theme lag jaye
   (warna dark se light mein "flash" hota hai).

   STEP 1  Settings
   STEP 2  Saved theme parho (localStorage)  -> <html data-theme="..."> lagao
   STEP 3  Toggle button banao (header ke .nav-actions mein)
   STEP 4  Click par theme badlo + save karo
   ========================================================================== */
(() => {
  /* ---------- STEP 1: SETTINGS ---------- */
  const STORAGE_KEY = "sk-theme";
  // Pehli visit par kaunsi theme? "dark" | "light" | "system"
  // "system" = visitor ke phone/laptop ki setting follow kare.
  const DEFAULT_THEME = "dark";
  const META_COLORS = { dark: "#0a0a0a", light: "#faf7f0" }; // browser bar ka rang

  const root = document.documentElement;

  /* ---------- STEP 2: THEME PARHO AUR LAGAO ---------- */
  const readSaved = () => {
    try {
      const v = localStorage.getItem(STORAGE_KEY);
      return v === "dark" || v === "light" ? v : null;
    } catch (_) {
      return null; // private mode mein storage band ho sakta hai
    }
  };
  const save = (theme) => {
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch (_) {}
  };
  const systemTheme = () =>
    window.matchMedia("(prefers-color-scheme: light)").matches
      ? "light"
      : "dark";
  const initialTheme = () =>
    readSaved() || (DEFAULT_THEME === "system" ? systemTheme() : DEFAULT_THEME);

  let current = initialTheme();

  const paint = (theme) => {
    current = theme;
    root.setAttribute("data-theme", theme);
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", META_COLORS[theme]);
    document.querySelectorAll(".theme-toggle").forEach(syncButton);
  };

  // Page paint hone se pehle hi chal jata hai (flash nahi hota)
  root.setAttribute("data-theme", current);

  /* ---------- STEP 3: TOGGLE BUTTON ---------- */
  const SUN =
    '<svg class="icon-sun" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>';
  const MOON =
    '<svg class="icon-moon" viewBox="0 0 24 24" aria-hidden="true"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>';

  function syncButton(btn) {
    const isLight = current === "light";
    btn.setAttribute("aria-pressed", String(isLight));
    btn.setAttribute(
      "aria-label",
      isLight ? "Switch to dark mode" : "Switch to light mode",
    );
    btn.title = isLight ? "Dark mode" : "Light mode";
  }

  function buildButton() {
    // Agar aap ne HTML mein khud <button class="theme-toggle"> likha hai to wahi use hoga
    let btn = document.querySelector(".theme-toggle");
    if (!btn) {
      const actions = document.querySelector(".nav-actions");
      if (!actions) return;
      btn = document.createElement("button");
      btn.type = "button";
      btn.className = "theme-toggle";
      btn.innerHTML = SUN + MOON;
      const menu = actions.querySelector(".menu-toggle");
      actions.insertBefore(btn, menu || null); // hamburger se pehle
    }
    syncButton(btn);
    btn.addEventListener("click", toggle);
  }

  /* ---------- STEP 4: CLICK PAR BADLO + SAVE ---------- */
  function toggle() {
    const next = current === "dark" ? "light" : "dark";
    root.classList.add("theme-transition"); // smooth fade
    paint(next);
    save(next);
    setTimeout(() => root.classList.remove("theme-transition"), 400);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      buildButton();
      paint(current);
    });
  } else {
    buildButton();
    paint(current);
  }

  // Ek tab mein badlein to dusre khule tabs bhi badal jayen
  window.addEventListener("storage", (e) => {
    if (e.key === STORAGE_KEY && (e.newValue === "dark" || e.newValue === "light"))
      paint(e.newValue);
  });

  // "system" mode mein: agar user ne kabhi toggle nahi kiya to OS ki setting follow karo
  if (DEFAULT_THEME === "system" && window.matchMedia) {
    window
      .matchMedia("(prefers-color-scheme: light)")
      .addEventListener("change", () => {
        if (!readSaved()) paint(systemTheme());
      });
  }
})();
