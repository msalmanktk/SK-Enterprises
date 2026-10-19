(() => {
  const form = document.querySelector("#construction-form");
  if (!form) return;
  form.addEventListener("submit", event => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const data = Object.fromEntries(new FormData(form).entries());
    const number = window.SULAL_CONFIG?.whatsappNumber || "";
    if (!number || number.includes("*")) {
      alert("Please add your real WhatsApp number in js/config.js first.");
      return;
    }
    const message = [
      "SULAL Entrepreneur UK — Construction Project Inquiry",
      `Name: ${data.name}`,
      `Phone: ${data.phone}`,
      `Project type: ${data.projectType}`,
      `Project location: ${data.location}`,
      `Estimated budget: ${data.budget || "Not provided"}`,
      `Expected timeline: ${data.timeline || "Not provided"}`,
      `Project details: ${data.description}`,
      "",
      "Please contact me to discuss the project requirements and next steps."
    ].join("\\n");
    window.open(`https://wa.me/${number.replace(/\\D/g, "")}?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
  });
})();
