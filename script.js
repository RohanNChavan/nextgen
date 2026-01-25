const GOOGLE_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbzMeHAD_PWS_g5nZjAZXcFgfeTO2idQkqVtshdusvRpHp6UgOWRgdWiUQL07onWywLQ-g/exec";

/* Footer year */
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* Mobile menu */
const hamburger = document.getElementById("hamburger");
const mobileNav = document.getElementById("mobileNav");
hamburger?.addEventListener("click", () => {
  const isOpen = mobileNav.style.display === "block";
  mobileNav.style.display = isOpen ? "none" : "block";
});

/* Active nav link */
document.querySelectorAll(".nav a, .mobile-nav a").forEach(a => {
  const href = a.getAttribute("href");
  if (!href) return;
  const current = window.location.pathname.split("/").pop() || "index.html";
  if ((current === "" || current === "index.html") && href.includes("index.html")) a.classList.add("active");
  if (href.endsWith(current)) a.classList.add("active");
});

/* Form handling (only runs if form exists on page) */
const form = document.getElementById("leadForm");
if (form) {
  const submitBtn = document.getElementById("submitBtn");
  const statusMsg = document.getElementById("statusMsg");

  const errors = {
    fullName: document.getElementById("errFullName"),
    email: document.getElementById("errEmail"),
    phone: document.getElementById("errPhone"),
    pan: document.getElementById("errPan"),
    employmentStatus: document.getElementById("errEmployment"),
    pincode: document.getElementById("errPincode"),
    monthlyIncome: document.getElementById("errIncome"),
    loanAmount: document.getElementById("errLoan"),
    agree: document.getElementById("errAgree")
  };

  function setStatus(msg, type = "info") {
    if (!statusMsg) return;
    statusMsg.textContent = msg || "";
    statusMsg.style.color =
      type === "success" ? "#16a34a" :
      type === "error" ? "#dc2626" :
      "rgba(15,23,42,0.72)";
  }

  function clearErrors() {
    Object.values(errors).forEach(el => { if (el) el.textContent = ""; });
  }

  function sanitizeDigits(val, maxLen) {
    return (val || "").toString().replace(/\D/g, "").slice(0, maxLen);
  }

  function normalizePan(pan) {
    return (pan || "").toUpperCase().replace(/\s/g, "");
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function isValidPAN(pan) {
    return /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(pan);
  }

  function showError(field, msg) {
    if (errors[field]) errors[field].textContent = msg;
  }

  async function submitLead(payload) {
    await fetch(GOOGLE_SCRIPT_URL, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    return true;
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    clearErrors();
    setStatus("");

    const fullName = document.getElementById("fullName").value.trim();
    const email = document.getElementById("email").value.trim();
    const phone = sanitizeDigits(document.getElementById("phone").value, 10);
    const pan = normalizePan(document.getElementById("pan").value);
    const employmentStatus = document.getElementById("employmentStatus").value;
    const pincode = sanitizeDigits(document.getElementById("pincode").value, 6);
    const monthlyIncome = document.getElementById("monthlyIncome").value.trim();
    const loanAmount = document.getElementById("loanAmount").value.trim();
    const agree = document.getElementById("agree").checked;

    let ok = true;
    if (!fullName) { ok = false; showError("fullName", "Please enter full name."); }
    if (!email || !isValidEmail(email)) { ok = false; showError("email", "Enter a valid email address."); }
    if (phone.length !== 10) { ok = false; showError("phone", "Enter valid 10-digit phone number."); }
    if (!isValidPAN(pan)) { ok = false; showError("pan", "Enter PAN like ABCDE1234F."); }
    if (!employmentStatus) { ok = false; showError("employmentStatus", "Select employment status."); }
    if (pincode.length !== 6) { ok = false; showError("pincode", "Enter 6-digit PIN code."); }
    if (!monthlyIncome || Number(monthlyIncome) <= 0) { ok = false; showError("monthlyIncome", "Enter monthly income."); }
    if (!loanAmount || Number(loanAmount) <= 0) { ok = false; showError("loanAmount", "Enter required loan amount."); }
    if (!agree) { ok = false; showError("agree", "Please accept Terms & Privacy Policy."); }

    if (!ok) {
      setStatus("Please fix errors and try again.", "error");
      return;
    }

    const payload = {
      fullName, email, phone, pan,
      employmentStatus, pincode,
      monthlyIncome, loanAmount,
      page: window.location.href,
      source: "nextgen_finance"
    };

    try {
      submitBtn.disabled = true;
      submitBtn.textContent = "Submitting...";
      setStatus("Submitting your application...", "info");

      await submitLead(payload);

      setStatus("✅ Submitted successfully! We will contact you within 24 hours.", "success");
      form.reset();
    } catch (err) {
      console.error(err);
      setStatus("❌ Submission failed. Please try again.", "error");
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = "Submit Application";
    }
  });
}
