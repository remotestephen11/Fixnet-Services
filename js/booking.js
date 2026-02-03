(() => {
  const CART_KEY = "fixnest_cart";

  const SERVICES = {
    cleaning: { name:"Deep Cleaning", price:45000 },
    electrical: { name:"Electrical Repairs", price:25000 },
    plumbing: { name:"Plumbing Repairs", price:15000 },
    ac: { name:"AC Servicing", price:22000 },
    generator: { name:"Generator Maintenance", price:30000 },
  };

  const cartBox = document.getElementById("cartBox");
  const waBtn = document.getElementById("waBtn");
  const copyBtn = document.getElementById("copyBtn");
  const successBox = document.getElementById("successBox");
  const clearBtn = document.getElementById("clearBtn");
  const submitBtn = document.getElementById("submitBtn");

  const urgent = document.getElementById("urgent");
  const weekend = document.getElementById("weekend");

  const form = {
    name: document.getElementById("name"),
    phone: document.getElementById("phone"),
    email: document.getElementById("email"),
    date: document.getElementById("date"),
    time: document.getElementById("time"),
    address: document.getElementById("address"),
  };

  const errs = {
    name: document.getElementById("errName"),
    phone: document.getElementById("errPhone"),
    email: document.getElementById("errEmail"),
    date: document.getElementById("errDate"),
    time: document.getElementById("errTime"),
    address: document.getElementById("errAddress"),
  };

  function loadCart() {
    try { return JSON.parse(localStorage.getItem(CART_KEY)) || []; }
    catch { return []; }
  }
  function saveCart(cart) { localStorage.setItem(CART_KEY, JSON.stringify(cart)); }
  function formatNaira(n){ return "₦" + n.toLocaleString("en-NG"); }

  function cartItems() {
    return loadCart().map(id => ({ id, ...(SERVICES[id] || { name:"Unknown", price:0 }) }));
  }

  function totals() {
    const items = cartItems();
    const base = items.reduce((sum, it) => sum + it.price, 0);
    const addUrgent = urgent?.checked ? 20000 : 0;
    const addWeekend = weekend?.checked ? 10000 : 0;
    return { items, base, addUrgent, addWeekend, total: base + addUrgent + addWeekend };
  }

  function bookingText() {
    const t = totals();
    const lines = [
      "FixNest Booking Request",
      "----------------------",
      `Name: ${form.name.value.trim()}`,
      `Phone: ${form.phone.value.trim()}`,
      `Email: ${form.email.value.trim()}`,
      `Date/Time: ${form.date.value} ${form.time.value}`,
      `Address: ${form.address.value.trim()}`,
      "",
      "Services:"
    ];

    t.items.forEach(it => lines.push(`- ${it.name} (${formatNaira(it.price)})`));
    lines.push("");
    if (t.addUrgent) lines.push(`Urgent add-on: ${formatNaira(t.addUrgent)}`);
    if (t.addWeekend) lines.push(`Weekend add-on: ${formatNaira(t.addWeekend)}`);
    lines.push(`TOTAL: ${formatNaira(t.total)}`);
    return lines.join("\n");
  }

  function renderCart() {
    const t = totals();
    if (!cartBox) return;

    if (!t.items.length) {
      cartBox.innerHTML = `<p class="small">No services selected. Go to Services and add items.</p>`;
      waBtn.href = "#";
      return;
    }

    cartBox.innerHTML = `
      ${t.items.map(it => `<p class="quote" style="margin:0 0 6px;"><strong>${it.name}</strong> — ${formatNaira(it.price)}</p>`).join("")}
      <hr style="border:none; border-top:1px solid var(--line); margin:12px 0;">
      <p class="small" style="margin:0;">Base: <strong>${formatNaira(t.base)}</strong></p>
      <p class="small" style="margin:0;">Add-ons: <strong>${formatNaira(t.addUrgent + t.addWeekend)}</strong></p>
      <p class="small" style="margin:6px 0 0;">Total: <strong>${formatNaira(t.total)}</strong></p>
    `;

    // WhatsApp share (uses wa.me)
    const msg = encodeURIComponent(bookingText());
    waBtn.href = `https://wa.me/?text=${msg}`;
  }

  function setErr(el, msg){
    if (!el) return;
    el.textContent = msg || "";
    el.style.color = msg ? "crimson" : "var(--muted)";
  }

  function validEmail(v){ return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); }

  function validNGPhone(v){
    const s = v.replace(/\s/g,"");
    // Accept +234xxxxxxxxxx or 0xxxxxxxxxx (basic)
    if (/^\+234\d{10}$/.test(s)) return true;
    if (/^0\d{10}$/.test(s)) return true;
    return false;
  }

  function validate() {
    let ok = true;

    const name = form.name.value.trim();
    const phone = form.phone.value.trim();
    const email = form.email.value.trim();
    const date = form.date.value;
    const time = form.time.value;
    const address = form.address.value.trim();

    setErr(errs.name, name ? "" : "Name is required."); if (!name) ok = false;
    setErr(errs.phone, validNGPhone(phone) ? "" : "Enter a valid Nigeria phone (080... or +234...)."); if (!validNGPhone(phone)) ok = false;
    setErr(errs.email, validEmail(email) ? "" : "Enter a valid email."); if (!validEmail(email)) ok = false;
    setErr(errs.date, date ? "" : "Pick a date."); if (!date) ok = false;
    setErr(errs.time, time ? "" : "Pick a time."); if (!time) ok = false;
    setErr(errs.address, address ? "" : "Address is required."); if (!address) ok = false;

    if (!loadCart().length) {
      ok = false;
      successBox.innerHTML = `<p class="small" style="color:crimson;">Add at least one service from Services page.</p>`;
    }

    return ok;
  }

  function showSuccess() {
    const t = totals();
    successBox.innerHTML = `
      <div class="card block" style="box-shadow:none;">
        <strong>Request saved.</strong>
        <p class="small" style="margin:8px 0 0;">We’ll contact you within 15 minutes to confirm details.</p>
        <p class="small" style="margin:8px 0 0;">Total: <strong>${formatNaira(t.total)}</strong></p>
      </div>
    `;
  }

  // Events
  [urgent, weekend].forEach(el => el && el.addEventListener("change", renderCart));

  copyBtn?.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(bookingText());
      successBox.innerHTML = `<p class="small" style="color:var(--green);">Copied booking details.</p>`;
    } catch {
      successBox.innerHTML = `<p class="small" style="color:crimson;">Copy failed. Your browser blocked clipboard access.</p>`;
    }
  });

  submitBtn?.addEventListener("click", () => {
    if (!validate()) return;
    showSuccess();
  });

  clearBtn?.addEventListener("click", () => {
    saveCart([]);
    successBox.innerHTML = `<p class="small">Booking cleared.</p>`;
    renderCart();
  });

  // Init
  renderCart();
})();
