(() => {
  const grid = document.querySelector("#properties-grid");
  if (!grid) return;
  const search = document.querySelector("#property-search");
  const purpose = document.querySelector("#property-purpose");
  const sort = document.querySelector("#property-sort");
  const count = document.querySelector("#results-count");
  const fallback = [
    {id:"PROP001",title:"Contemporary Family Residence",price:"25000000",purpose:"Sale",location:"Sample location — update this",bedrooms:"4",image_url:"https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80",status:"Active"},
    {id:"PROP002",title:"Modern City Apartment",price:"85000",purpose:"Rent",location:"Sample location — update this",bedrooms:"2",image_url:"https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1000&q=80",status:"Active"},
    {id:"PROP003",title:"Elegant Garden House",price:"32000000",purpose:"Sale",location:"Sample location — update this",bedrooms:"5",image_url:"https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1000&q=80",status:"Active"}
  ];
  let items = fallback;
  const e = window.SULAL.escapeHTML;
  const render = () => {
    const term = (search?.value || "").trim().toLowerCase();
    let list = items.filter(p => `${p.title} ${p.location} ${p.purpose}`.toLowerCase().includes(term));
    if (purpose?.value) list = list.filter(p => (p.purpose || "").toLowerCase() === purpose.value.toLowerCase());
    if (sort?.value === "low") list.sort((a,b) => Number(a.price)-Number(b.price));
    if (sort?.value === "high") list.sort((a,b) => Number(b.price)-Number(a.price));
    count.textContent = `${list.length} propert${list.length === 1 ? "y" : "ies"} found`;
    grid.innerHTML = list.length ? list.map(p => {
      const id = encodeURIComponent(p.id || p.title);
      const image = window.SULAL.safeImage(p.image_url, fallback[0].image_url);
      const monthly = (p.purpose || "").toLowerCase() === "rent" ? "/month*" : "";
      return `<article class="card"><div class="card__image"><img src="${e(image)}" alt="${e(p.title)}" loading="lazy"></div><div class="card__body"><div class="card__topline"><span class="pill">${e(p.purpose || "PROPERTY")}</span><span class="price">${window.SULAL.money(p.price)}<small>${monthly}</small></span></div><h3>${e(p.title)}</h3><div class="card__specs"><span>⌖ ${e(p.location || "Location on request")}</span><span>▦ ${e(p.bedrooms || "—")} bedrooms</span></div><div class="card__actions"><a class="btn btn--gold btn--small" href="property-details.html?id=${id}">View Details</a><button class="btn btn--outline btn--small" data-property-wa="${e(p.title)}">WhatsApp</button></div></div></article>`;
    }).join("") : `<div class="empty-state" style="grid-column:1/-1"><h3>No properties found</h3><p>Try changing your filters.</p></div>`;
    grid.querySelectorAll("[data-property-wa]").forEach(btn => btn.addEventListener("click", () => {
      const n = window.SULAL_CONFIG.whatsappNumber;
      if (!n || n.includes("*")) return alert("Add your real WhatsApp number in js/config.js first.");
      const msg = `Hello SULAL Entrepreneur UK, I am interested in ${btn.dataset.propertyWa}. Please share more details.`;
      window.open(`https://wa.me/${n.replace(/\D/g,"")}?text=${encodeURIComponent(msg)}`, "_blank", "noopener,noreferrer");
    }));
  };
  [search, purpose, sort].filter(Boolean).forEach(el => el.addEventListener("input", render));
  (async () => {
    try { const live = await window.SULAL.loadListings("properties"); if (live) items = live; }
    catch (err) { console.warn(err); }
    render();
  })();
})();
