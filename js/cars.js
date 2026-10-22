(() => {
  const grid = document.querySelector("#cars-grid");
  if (!grid) return;
  const search = document.querySelector("#car-search");
  const transmission = document.querySelector("#car-transmission");
  const sort = document.querySelector("#car-sort");
  const count = document.querySelector("#results-count");
  const fallback = [
    {id:"CAR001",name:"Executive Sedan",price_per_day:"6000",image_url:"https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1000&q=80",transmission:"Automatic",seats:"5",description:"Comfortable everyday executive travel.",status:"Active"},
    {id:"CAR002",name:"Luxury Performance Coupe",price_per_day:"15000",image_url:"https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1000&q=80",transmission:"Automatic",seats:"2",description:"A premium drive for special occasions.",status:"Active"},
    {id:"CAR003",name:"Premium SUV",price_per_day:"12000",image_url:"https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=1000&q=80",transmission:"Automatic",seats:"7",description:"Spacious travel for family and business.",status:"Active"}
  ];
  let items = fallback;
  const e = window.SK_ENTERPRISES.escapeHTML;
  const render = () => {
    const term = (search?.value || "").trim().toLowerCase();
    let list = items.filter(c => `${c.name} ${c.description} ${c.transmission}`.toLowerCase().includes(term));
    if (transmission?.value) list = list.filter(c => (c.transmission || "").toLowerCase() === transmission.value.toLowerCase());
    if (sort?.value === "low") list.sort((a,b) => Number(a.price_per_day)-Number(b.price_per_day));
    if (sort?.value === "high") list.sort((a,b) => Number(b.price_per_day)-Number(a.price_per_day));
    count.textContent = `${list.length} vehicle${list.length === 1 ? "" : "s"} found`;
    grid.innerHTML = list.length ? list.map(c => {
      const id = encodeURIComponent(c.id || c.name);
      const image = window.SK_ENTERPRISES.safeImage(c.image_url, fallback[0].image_url);
      return `<article class="card"><div class="card__image"><img src="${e(image)}" alt="${e(c.name)}" loading="lazy"></div><div class="card__body"><div class="card__topline"><span class="pill">RENTAL</span><span class="price">${window.SK_ENTERPRISES.money(c.price_per_day)}<small>/day</small></span></div><h3>${e(c.name)}</h3><div class="card__specs"><span>⚙ ${e(c.transmission || "Details on request")}</span><span>♙ ${e(c.seats || "—")} seats</span></div><div class="card__actions"><a class="btn btn--gold btn--small" href="car-details.html?id=${id}">View Details</a><button class="btn btn--outline btn--small" data-whatsapp data-message="${e(`Hello SK Enterprises, I am interested in ${c.name}. Please share availability.`)}">WhatsApp</button></div></div></article>`;
    }).join("") : `<div class="empty-state" style="grid-column:1/-1"><h3>No vehicles found</h3><p>Try another search or clear your filters.</p></div>`;
  };
  [search, transmission, sort].filter(Boolean).forEach(el => el.addEventListener("input", render));
  async function init() {
    try {
      const live = await window.SK_ENTERPRISES.loadListings("cars");
      if (live) items = live;
    } catch (err) { console.warn(err); }
    render();
    document.querySelectorAll("[data-whatsapp]").forEach(el => {
      el.addEventListener("click", () => {
        const n = window.SK_ENTERPRISES_CONFIG.whatsappNumber;
        if (!n || n.includes("*")) return alert("Add your real WhatsApp number in js/config.js first.");
        window.open(`https://wa.me/${n.replace(/\D/g,"")}?text=${encodeURIComponent(el.dataset.message)}`, "_blank", "noopener,noreferrer");
      });
    });
  }
  init();
})();
