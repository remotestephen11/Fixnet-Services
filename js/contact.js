(() => {
  // Count-up
  const counters = document.querySelectorAll("[data-count]");
  counters.forEach(el => {
    const target = Number(el.getAttribute("data-count"));
    const isFloat = String(target).includes(".");
    let current = 0;
    const step = target / 60; // ~1s animation
    const timer = setInterval(() => {
      current += step;
      if (current >= target) {
        el.textContent = target;
        clearInterval(timer);
      } else {
        el.textContent = isFloat ? current.toFixed(1) : Math.floor(current);
      }
    }, 16);
  });

  function toast(msg) {
    const t = document.createElement("div");
    t.className = "toast";
    t.textContent = msg;
    document.body.appendChild(t);
    setTimeout(() => t.remove(), 2500);
  }

  // Form validation
  const name = document.getElementById("cName");
  const email = document.getElementById("cEmail");
  const msg = document.getElementById("cMsg");
  const btn = document.getElementById("cSend");

  const eName = document.getElementById("cErrName");
  const eEmail = document.getElementById("cErrEmail");
  const eMsg = document.getElementById("cErrMsg");

  function validEmail(v){ return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); }
  function setErr(el, m){
    el.textContent = m || "";
    el.style.color = m ? "crimson" : "var(--muted)";
  }

  btn?.addEventListener("click", () => {
    const n = name.value.trim();
    const em = email.value.trim();
    const m = msg.value.trim();

    let ok = true;
    setErr(eName, n ? "" : "Name is required."); if (!n) ok = false;
    setErr(eEmail, validEmail(em) ? "" : "Enter a valid email."); if (!validEmail(em)) ok = false;
    setErr(eMsg, m ? "" : "Message is required."); if (!m) ok = false;

    if (!ok) return;

    toast("Message sent (demo). We’ll respond shortly.");
    name.value = ""; email.value = ""; msg.value = "";
  });
})();
