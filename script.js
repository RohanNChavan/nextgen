// ✅ Replace this with your Apps Script Web App URL
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzMeHAD_PWS_g5nZjAZXcFgfeTO2idQkqVtshdusvRpHp6UgOWRgdWiUQL07onWywLQ-g/exec";

document.getElementById("year").textContent = new Date().getFullYear();

const form = document.getElementById("leadForm");
const statusMsg = document.getElementById("statusMsg");
const submitBtn = document.getElementById("submitBtn");

function setStatus(msg, type = "info") {
  statusMsg.textContent = msg;
  statusMsg.style.color =
    type === "success" ? "#22c55e" :
    type === "error" ? "#f87171" :
    "rgba(232,236,255,0.7)";
}

function sanitizeMobile(mobile) {
  return (mobile || "").replace(/\D/g, "").slice(0, 10);
}

async function submitLead(payload) {
  // no-cors = prevents CORS errors on browser side (Apps Script)
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

  const payload = {
    name: document.getElementById("name").value.trim(),
    mobile: sanitizeMobile(document.getElementById("mobile").value),
    email: document.getElementById("email").value.trim(),
    city: document.getElementById("city").value.trim(),
    loanAmount: document.getElementById("loanAmount").value.trim(),
    message: document.getElementById("message").value.trim(),
    page: window.location.href,
    source: "nextgen"
  };

  if (!payload.name) {
    setStatus("Please enter your full name.", "error");
    return;
  }
  if (payload.mobile.length !== 10) {
    setStatus("Please enter a valid 10-digit mobile number.", "error");
    return;
  }

  try {
    submitBtn.disabled = true;
    submitBtn.textContent = "Submitting...";
    setStatus("Submitting your application...", "info");

    await submitLead(payload);

    setStatus("✅ Submitted successfully! We will contact you soon.", "success");
    form.reset();
  } catch (err) {
    console.error(err);
    setStatus("❌ Submission failed. Please try again.", "error");
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = "Submit Application";
  }
});
