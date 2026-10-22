(() => {
  const form = document.querySelector("#contact-form");
  if (!form) return;
  form.addEventListener("submit", (ev) => {
    ev.preventDefault();
    if (!form.reportValidity()) return;
    const data = Object.fromEntries(new FormData(form).entries());
    const n = window.SK_ENTERPRISES_CONFIG.whatsappNumber;
    if (!n || n.includes("*"))
      return alert(
        "Please add your real WhatsApp number in js/config.js first.",
      );
    const msg = `SK Enterprises — Contact Inquiry\nName: ${data.name}\nEmail: ${data.email}\nPhone: ${data.phone || "Not provided"}\nSubject: ${data.subject}\nMessage: ${data.message}`;
    window.open(
      `https://wa.me/${n.replace(/\D/g, "")}?text=${encodeURIComponent(msg)}`,
      "_blank",
      "noopener,noreferrer",
    );
  });
})();
