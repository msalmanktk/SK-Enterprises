(() => {
  const form = document.querySelector("#booking-form");
  if (!form) return;
  const carSelect = form.querySelector('[name="car"]');
  const params = new URLSearchParams(location.search);
  if (params.get("car") && carSelect) carSelect.value = params.get("car");
  const dateMin = new Date().toISOString().slice(0,10);
  form.querySelectorAll('input[type="date"]').forEach(el => el.min = dateMin);
  form.querySelector('[name="pickupDate"]')?.addEventListener("change", ev => {
    const ret = form.querySelector('[name="returnDate"]');
    ret.min = ev.target.value || dateMin;
    if (ret.value && ret.value < ret.min) ret.value = ret.min;
  });
  form.addEventListener("submit", ev => {
    ev.preventDefault();
    if (!form.reportValidity()) return;
    const data = Object.fromEntries(new FormData(form).entries());
    if (data.returnDate < data.pickupDate) return alert("Return date must be the same as or after pickup date.");
    const n = window.SULAL_CONFIG.whatsappNumber;
    if (!n || n.includes("*")) return alert("Please add your real WhatsApp number in js/config.js first.");
    const message = [
      "SULAL Entrepreneur UK — Car Booking Inquiry",
      `Car: ${data.car}`,
      `Name: ${data.name}`,
      `Phone: ${data.phone}`,
      `Pickup date: ${data.pickupDate}`,
      `Return date: ${data.returnDate}`,
      `Pickup location: ${data.location}`,
      `Additional details: ${data.notes || "None"}`,
      "",
      "Please confirm availability, final price, and booking terms."
    ].join("\n");
    window.open(`https://wa.me/${n.replace(/\D/g,"")}?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
  });
})();
