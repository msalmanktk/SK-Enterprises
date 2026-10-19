(async () => {
  const host = document.querySelector("[data-detail-type]");
  if (!host) return;
  const type = host.dataset.detailType;
  const id = new URLSearchParams(location.search).get("id");
  const isCar = type === "car";
  const demo = isCar ? [
    {id:"CAR001",name:"Executive Sedan",price_per_day:"6000",image_url:"https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=85",transmission:"Automatic",seats:"5",description:"A comfortable executive sedan for business trips, family visits, and everyday travel."},
    {id:"CAR002",name:"Luxury Performance Coupe",price_per_day:"15000",image_url:"https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=85",transmission:"Automatic",seats:"2",description:"A premium driving experience for special occasions and memorable journeys."},
    {id:"CAR003",name:"Premium SUV",price_per_day:"12000",image_url:"https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=1200&q=85",transmission:"Automatic",seats:"7",description:"A spacious option for family travel and comfortable longer journeys."}
  ] : [
    {id:"PROP001",title:"Contemporary Family Residence",price:"25000000",purpose:"Sale",location:"Sample location — update this",bedrooms:"4",image_url:"https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=85",description:"A sample property listing. Replace this description and location with verified details before publishing."},
    {id:"PROP002",title:"Modern City Apartment",price:"85000",purpose:"Rent",location:"Sample location — update this",bedrooms:"2",image_url:"https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=85",description:"A sample apartment listing. Contact SULAL to ask about current availability and details."},
    {id:"PROP003",title:"Elegant Garden House",price:"32000000",purpose:"Sale",location:"Sample location — update this",bedrooms:"5",image_url:"https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1200&q=85",description:"A sample home listing. Update the information to reflect the actual property."}
  ];
  let items = demo;
  try { const live = await window.SULAL.loadListings(isCar ? "cars" : "properties"); if (live) items = live; } catch (err) { console.warn(err); }
  const item = items.find(x => String(x.id) === id) || items[0];
  const e = window.SULAL.escapeHTML;
  const name = isCar ? item.name : item.title;
  const price = window.SULAL.money(isCar ? item.price_per_day : item.price);
  const image = window.SULAL.safeImage(item.image_url, demo[0].image_url);
  const specs = isCar
    ? `<div class="spec-item"><span>Transmission</span><strong>${e(item.transmission || "On request")}</strong></div><div class="spec-item"><span>Seats</span><strong>${e(item.seats || "—")}</strong></div><div class="spec-item"><span>Rate</span><strong>Per day</strong></div><div class="spec-item"><span>Availability</span><strong>Confirm via WhatsApp</strong></div>`
    : `<div class="spec-item"><span>Purpose</span><strong>${e(item.purpose || "On request")}</strong></div><div class="spec-item"><span>Bedrooms</span><strong>${e(item.bedrooms || "—")}</strong></div><div class="spec-item"><span>Location</span><strong>${e(item.location || "On request")}</strong></div><div class="spec-item"><span>Price</span><strong>${price}</strong></div>`;
  host.innerHTML = `<div class="details-layout"><div><div class="details-image"><img src="${e(image)}" alt="${e(name)}"></div><div class="section-heading" style="margin-top:28px"><div><span class="eyebrow">Overview</span><h2>About this ${isCar ? "vehicle" : "property"}</h2></div></div><p class="detail-copy">${e(item.description || "Contact SULAL Entrepreneur UK for more information about this listing.")}</p></div><aside class="details-panel"><span class="pill">${e(isCar ? "CAR RENTAL" : item.purpose || "PROPERTY")}</span><h1>${e(name)}</h1><div class="price">${price}<small>${isCar ? "/day" : ((item.purpose || "").toLowerCase() === "rent" ? "/month*" : "")}</small></div><div class="spec-grid">${specs}</div><p class="muted">Please confirm current availability, final pricing, and terms directly with our team.</p><div class="card__actions"><a class="btn btn--gold" href="${isCar ? `booking.html?car=${encodeURIComponent(item.id || "")}` : "contact.html"}">${isCar ? "Book / Enquire" : "Enquire Now"}</a><button class="btn btn--outline" id="detail-wa">WhatsApp</button><button class="btn btn--outline" data-call>Call Now</button></div></aside></div>`;
  document.querySelector("#detail-wa")?.addEventListener("click", () => {
    const n = window.SULAL_CONFIG.whatsappNumber;
    if (!n || n.includes("*")) return alert("Add your real WhatsApp number in js/config.js first.");
    const msg = `Hello SULAL Entrepreneur UK, I am interested in ${name}. Please share availability and details.`;
    window.open(`https://wa.me/${n.replace(/\D/g,"")}?text=${encodeURIComponent(msg)}`, "_blank", "noopener,noreferrer");
  });
  document.querySelectorAll("[data-call]").forEach(el => el.addEventListener("click", () => {
    const n = window.SULAL_CONFIG.phoneNumber;
    if (!n || n.includes("*")) return alert("Add your real phone number in js/config.js first.");
    location.href = `tel:+${n.replace(/\D/g,"")}`;
  }));
})();
