(() => {
  // Testimonials slider
  const testimonials = [
    { quote: "They came fast and fixed my AC same day. Very professional.", name: "Chinonso A. — 5★" },
    { quote: "Cleaners were detailed. My apartment looked brand new.", name: "Damilola K. — 5★" },
    { quote: "Pricing was clear. No extra charges after arrival.", name: "Ifeanyi U. — 4★" }
  ];

  const tQuote = document.getElementById("tQuote");
  const tName = document.getElementById("tName");
  const tPrev = document.getElementById("tPrev");
  const tNext = document.getElementById("tNext");

  let idx = 0;
  function renderTestimonial() {
    if (!tQuote || !tName) return;
    tQuote.textContent = `“${testimonials[idx].quote}”`;
    tName.textContent = testimonials[idx].name;
  }
  function next() { idx = (idx + 1) % testimonials.length; renderTestimonial(); }
  function prev() { idx = (idx - 1 + testimonials.length) % testimonials.length; renderTestimonial(); }

  if (tPrev && tNext) {
    tPrev.addEventListener("click", prev);
    tNext.addEventListener("click", next);
    renderTestimonial();
  }

  // FAQ accordion (ARIA)
  const qs = document.querySelectorAll(".faq-q");
  qs.forEach((btn) => {
    btn.addEventListener("click", () => {
      const expanded = btn.getAttribute("aria-expanded") === "true";
      // close all
      qs.forEach((b) => {
        b.setAttribute("aria-expanded", "false");
        const panel = b.nextElementSibling;
        if (panel) panel.hidden = true;
      });
      // open clicked if was closed
      if (!expanded) {
        btn.setAttribute("aria-expanded", "true");
        const panel = btn.nextElementSibling;
        if (panel) panel.hidden = false;
      }
    });
  });
})();
