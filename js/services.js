(() => {
  const SERVICES = [
    { id:"cleaning", name:"Deep Cleaning", desc:"Full apartment deep clean.", price:45000, duration:"4 hrs", category:"Cleaning", rating:4.8, img:"assets/images/cleaning.jpg", popular:1 },
    { id:"electrical", name:"Electrical Repairs", desc:"Sockets, wiring & fault fixing.", price:25000, duration:"2 hrs", category:"Electrical", rating:4.6, img:"assets/images/electrical.jpg", popular:2 },
    { id:"plumbing", name:"Plumbing Repairs", desc:"Leaks, under-sink pipe fixes.", price:15000, duration:"1 hr", category:"Plumbing", rating:4.6, img:"assets/images/plumbing.jpg", popular:4 },
    { id:"ac", name:"AC Servicing", desc:"Cleaning & performance checks.", price:22000, duration:"1.5 hrs", category:"AC", rating:4.7, img:"assets/images/ac.jpg", popular:3 },
    { id:"generator", name:"Generator Maintenance", desc:"Tune-up, oil check, test run.", price:30000, duration:"2 hrs", category:"Generator", rating:4.7, img:"assets/images/generator.jpg", popular:5 },
  ];

  const grid = document.getElementById("servicesGrid");
  const searchEl = document.getElementById("search");
  const catEl = document.getElementById("category");
  const sortEl = document.getElementById("sort");
  const cartHint = document.getElementById("cartHint");

  const CART_KEY = "fixnest_cart";

  function loadCart() {
    try { return JSON.parse(localStorage.getItem(CART_KEY)) || []; }
    catch { return []; }
  }
  function saveCart(cart) { localStorage.setItem(CART_KEY, JSON.stringify(cart)); }
  function cartCount() { return loadCart().length; }

  function renderHint() {
    if (!cartHint) return;
    const n = cartCount();
    cartHint.textContent = n ? `Booking cart: ${n} service(s) saved. Go to Booking to submit.` : "Booking cart is empty.";
  }

  function addToCart(serviceId) {
    const cart = loadCart();
    if (!cart.includes(serviceId)) cart.push(serviceId);
    saveCart(cart);
    renderHint();
    render();
  }

  function removeFromCart(serviceId) {
    const cart = loadCart().filter(id => id !== serviceId);
    saveCart(cart);
    renderHint();
    render();
  }

  function getFiltered() {
    let list = [...SERVICES];

    const q = (searchEl?.value || "").trim().toLowerCase();
    const cat = catEl?.value || "all";
    const sort = sortEl?.value || "popular";

    if (q) list = list.filter(s => (s.name + " " + s.desc + " " + s.category).toLowerCase().includes(q));
    if (cat !== "all") list = list.filter(s => s.category === cat);

    if (sort === "popular") list.sort((a,b) => a.popular - b.popular);
    if (sort === "priceAsc") list.sort((a,b) => a.price - b.price);
    if (sort === "priceDesc") list.sort((a,b) => b.price - a.price);
    if (sort === "ratingDesc") list.sort((a,b) => b.rating - a.rating);

    return list;
  }

  function formatNaira(n) {
    return "₦" + n.toLocaleString("en-NG");
  }

  function render() {
    if (!grid) return;
    const cart = loadCart();
    const list = getFiltered();

    grid.innerHTML = list.map(s => {
      const inCart = cart.includes(s.id);
      return `
        <article class="card service-card">
          <img class="service-img" src="${s.img}" alt="${s.name}">
          <strong>${s.name}</strong>
          <p class="small">${s.desc}</p>
          <p class="small">${formatNaira(s.price)} • ${s.duration} • ★ ${s.rating}</p>
          <div style="margin-top:10px; display:flex; gap:10px; flex-wrap:wrap;">
            ${
              inCart
              ? `<button class="btn btn-outline" data-remove="${s.id}" type="button">Remove</button>`
              : `<button class="btn btn-primary" data-add="${s.id}" type="button">Add to booking</button>`
            }
          </div>
        </article>
      `;
    }).join("");

    // Bind buttons
    grid.querySelectorAll("[data-add]").forEach(btn => {
      btn.addEventListener("click", () => addToCart(btn.getAttribute("data-add")));
    });
    grid.querySelectorAll("[data-remove]").forEach(btn => {
      btn.addEventListener("click", () => removeFromCart(btn.getAttribute("data-remove")));
    });
  }

  // init
  [searchEl, catEl, sortEl].forEach(el => el && el.addEventListener("input", render));
  renderHint();
  render();
})();
