/* ============================================================
   QUAD SOLUTIONS — site interactions
   ============================================================ */

// ---- year stamps ----
document.querySelectorAll("#year").forEach((el) => {
  el.textContent = new Date().getFullYear();
});

// ============================================================
// MOBILE NAVIGATION
// ============================================================
const hamburger = document.getElementById("hamburger");
const navLinks = document.getElementById("navLinks");
if (hamburger && navLinks) {
  hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("open");
    navLinks.classList.toggle("open");
  });
  navLinks.querySelectorAll("a").forEach((a) => {
    a.addEventListener("click", () => {
      hamburger.classList.remove("open");
      navLinks.classList.remove("open");
    });
  });
}

// ============================================================
// SMOOTH SCROLL FOR ANCHOR LINKS
// ============================================================
document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (e) => {
    const id = link.getAttribute("href");
    if (id === "#" || id.length < 2) return;
    const target = document.querySelector(id);
    if (target) {
      e.preventDefault();
      const navH = document.querySelector(".navbar")?.offsetHeight || 0;
      const top =
        target.getBoundingClientRect().top + window.pageYOffset - navH - 12;
      window.scrollTo({ top, behavior: "smooth" });
    }
  });
});

// ============================================================
// FAQ ACCORDION
// ============================================================
document.querySelectorAll(".faq-item").forEach((item) => {
  const btn = item.querySelector(".faq-q");
  if (!btn) return;
  btn.addEventListener("click", () => {
    const isOpen = item.classList.contains("open");
    document
      .querySelectorAll(".faq-item")
      .forEach((i) => i.classList.remove("open"));
    if (!isOpen) item.classList.add("open");
  });
});

// ============================================================
// CONTACT FORM (home page)
// ============================================================
const contactForm = document.getElementById("contactForm");
const formSuccess = document.getElementById("formSuccess");
if (contactForm) {
  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const data = new FormData(contactForm);
    if (!data.get("name") || !data.get("email") || !data.get("interest")) {
      alert("Please fill in all required fields.");
      return;
    }
    formSuccess.classList.add("show");
    contactForm.reset();
    setTimeout(() => formSuccess.classList.remove("show"), 6000);
  });
}

// ============================================================
// BOOKING FLOW (book-consultation.html)
// ============================================================
(function bookingFlow() {
  const container = document.getElementById("formContainer");
  if (!container) return;

  /* ---------- state ---------- */
  const state = {
    step: 1,
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    role: "",
    practice: "",
    services: [],
    providerCount: "",
    notes: "",
    date: "",
    slot: "",
    consultType: "Phone Call",
    agree: false,
  };

  /* ---------- step handling ---------- */
  const steps = container.querySelectorAll(".form-step");
  const dots = container.querySelectorAll(".step");
  const TOTAL = 4;

  const setStep = (n) => {
    state.step = n;
    steps.forEach((s) => s.classList.toggle("active", +s.dataset.step === n));
    dots.forEach((d) => {
      const i = +d.dataset.step;
      d.classList.toggle("active", i === n);
      d.classList.toggle("done", i < n);
    });
    container.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  /* ---------- dates ---------- */
  const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const MONTH_NAMES = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const dateGrid = document.getElementById("dateGrid");
  if (dateGrid) {
    const today = new Date();
    let added = 0;
    for (let i = 1; i <= 18 && added < 10; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      const dow = d.getDay();
      if (dow === 0 || dow === 6) continue;
      const label = `${DAY_NAMES[dow]}, ${MONTH_NAMES[d.getMonth()]} ${d.getDate()}`;
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "date-btn";
      btn.dataset.label = label;
      btn.innerHTML = `
        <span class="day-name">${DAY_NAMES[dow]}</span>
        <span class="day-num">${d.getDate()}</span>
        <span class="month">${MONTH_NAMES[d.getMonth()]}</span>
      `;
      btn.addEventListener("click", () => {
        dateGrid
          .querySelectorAll(".date-btn")
          .forEach((b) => b.classList.remove("selected"));
        btn.classList.add("selected");
        state.date = label;
      });
      dateGrid.appendChild(btn);
      added++;
    }
  }

  /* ---------- time slots ---------- */
  const SLOTS = [
    { time: "9:00 AM", open: true },
    { time: "9:30 AM", open: true },
    { time: "10:00 AM", open: false },
    { time: "10:30 AM", open: true },
    { time: "11:00 AM", open: true },
    { time: "11:30 AM", open: false },
    { time: "1:00 PM", open: true },
    { time: "2:00 PM", open: true },
    { time: "3:00 PM", open: true },
    { time: "3:30 PM", open: false },
    { time: "4:00 PM", open: true },
    { time: "4:30 PM", open: true },
  ];
  const slotGrid = document.getElementById("slotGrid");
  if (slotGrid) {
    SLOTS.forEach((s) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "slot-btn";
      btn.textContent = s.time;
      if (!s.open) btn.disabled = true;
      btn.addEventListener("click", () => {
        if (!s.open) return;
        slotGrid
          .querySelectorAll(".slot-btn")
          .forEach((b) => b.classList.remove("selected"));
        btn.classList.add("selected");
        state.slot = s.time;
      });
      slotGrid.appendChild(btn);
    });
  }

  /* ---------- services ---------- */
  const serviceOptions = document.getElementById("serviceOptions");
  if (serviceOptions) {
    serviceOptions.querySelectorAll(".opt").forEach((opt) => {
      opt.addEventListener("click", () => {
        const v = opt.dataset.value;
        opt.classList.toggle("checked");
        if (state.services.includes(v)) {
          state.services = state.services.filter((s) => s !== v);
        } else {
          state.services.push(v);
        }
      });
    });
  }

  /* ---------- next / prev buttons ---------- */
  container.querySelectorAll("[data-action]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const action = btn.dataset.action;
      if (action === "prev") {
        setStep(Math.max(1, state.step - 1));
        return;
      }
      // next: validate current step
      if (!validateStep(state.step)) return;
      collectStep(state.step);
      if (state.step === 3) populateReview();
      setStep(state.step + 1);
    });
  });

  /* ---------- per-step validation ---------- */
  function validateStep(step) {
    if (step === 1) {
      const fn = document.getElementById("firstName").value.trim();
      const ln = document.getElementById("lastName").value.trim();
      const em = document.getElementById("email").value.trim();
      const ph = document.getElementById("phone").value.trim();
      const rl = document.getElementById("role").value;
      if (!fn || !ln || !em || !ph || !rl) {
        alert("Please complete every required field.");
        return false;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em)) {
        alert("Please enter a valid email address.");
        return false;
      }
    }
    if (step === 2 && state.services.length === 0) {
      alert("Please select at least one service.");
      return false;
    }
    if (step === 3) {
      if (!state.date) {
        alert("Please pick a date.");
        return false;
      }
      if (!state.slot) {
        alert("Please pick a time slot.");
        return false;
      }
    }
    return true;
  }

  function collectStep(step) {
    if (step === 1) {
      state.firstName = document.getElementById("firstName").value.trim();
      state.lastName = document.getElementById("lastName").value.trim();
      state.email = document.getElementById("email").value.trim();
      state.phone = document.getElementById("phone").value.trim();
      state.role = document.getElementById("role").value;
      state.practice = document.getElementById("practice").value.trim();
    }
    if (step === 2) {
      state.providerCount = document.getElementById("providerCount").value;
      state.notes = document.getElementById("notes").value.trim();
    }
    if (step === 3) {
      state.consultType = document.getElementById("consultType").value;
    }
  }

  /* ---------- review summary ---------- */
  function buildSummary(target) {
    target.innerHTML = "";
    const rows = [
      ["Name", `${state.firstName} ${state.lastName}`],
      ["Email", state.email],
      ["Phone", state.phone],
      ["Role", state.role],
      ["Practice", state.practice || "\u2014"],
      ["Services", state.services.join(", ") || "\u2014"],
      ["Date", state.date],
      ["Time", state.slot],
      ["Format", state.consultType],
    ];
    rows.forEach(([k, v]) => {
      const row = document.createElement("div");
      row.innerHTML = `<span>${k}</span><span>${v}</span>`;
      target.appendChild(row);
    });
  }
  function populateReview() {
    const reviewGrid = document.getElementById("reviewGrid");
    if (reviewGrid) buildSummary(reviewGrid);
  }

  /* ---------- confirm ---------- */
  const confirmBtn = document.getElementById("confirmBtn");
  if (confirmBtn) {
    confirmBtn.addEventListener("click", () => {
      const agree = document.getElementById("agree").checked;
      if (!agree) {
        alert("Please agree to the privacy policy to confirm.");
        return;
      }
      state.agree = true;
      const successGrid = document.getElementById("successGrid");
      if (successGrid) {
        successGrid.innerHTML = "";
        const rows = [
          ["Name", `${state.firstName} ${state.lastName}`],
          ["When", `${state.date} at ${state.slot}`],
          ["Format", state.consultType],
          ["Email", state.email],
        ];
        rows.forEach(([k, v]) => {
          const row = document.createElement("div");
          row.innerHTML = `<span>${k}</span><span>${v}</span>`;
          successGrid.appendChild(row);
        });
      }
      // hide progress, show success
      document.getElementById("progressBar")?.classList.add("hidden");
      setStep(5);
    });
  }
})();
