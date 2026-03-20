/* ============================================================
   McDermott Letting — script.js

   What this file does:
   1. Initialises EmailJS
   2. Handles contact form validation and submission
   3. Toggles the mobile navigation menu
   4. Sets the current year in the footer
   ============================================================ */


/* ============================================================
   EMAILJS SETUP

   Before this will work you need to:

   1. Create a free account at https://www.emailjs.com
   2. Add an Email Service (Gmail, Outlook, etc.) and note the Service ID
   3. Create an Email Template and note the Template ID
      — Your template should use these variables:
          {{from_name}}    → sender's name
          {{from_email}}   → sender's email
          {{message}}      → their message
          {{to_email}}     → set to letting@mcdermottletting.ie
   4. Go to Account > API Keys and copy your Public Key
   5. Replace the placeholder values below with your real IDs
   ============================================================ */

// -- Replace these three values with your own from EmailJS --
var EMAILJS_PUBLIC_KEY  = "1Ezchnm5fRpOHJYib";   // e.g. "abc123XYZ_abcdefg"
var EMAILJS_SERVICE_ID  = "service_ha2ae6k";   // e.g. "service_xxxxxxx"
var EMAILJS_TEMPLATE_ID = "template_f7iv6ns";  // e.g. "template_xxxxxxx"
// -----------------------------------------------------------

// Initialise EmailJS with your public key
(function () {
  emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
})();


/* ============================================================
   FOOTER — CURRENT YEAR
============================================================ */
document.getElementById("footerYear").textContent = new Date().getFullYear();


/* ============================================================
   MOBILE NAVIGATION TOGGLE
============================================================ */
var navToggle = document.getElementById("navToggle");
var navLinks  = document.getElementById("navLinks");

navToggle.addEventListener("click", function () {
  var isOpen = navLinks.classList.toggle("is-open");
  navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
});

// Close the mobile menu when a nav link is clicked
navLinks.querySelectorAll("a").forEach(function (link) {
  link.addEventListener("click", function () {
    navLinks.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
  });
});


/* ============================================================
   CONTACT FORM — VALIDATION & SUBMISSION
============================================================ */
var form        = document.getElementById("contactForm");
var submitBtn   = document.getElementById("submitBtn");
var successMsg  = document.getElementById("formSuccess");
var errorMsg    = document.getElementById("formError");

// Individual field references
var nameInput    = document.getElementById("name");
var emailInput   = document.getElementById("email");
var messageInput = document.getElementById("message");

// Error display elements
var nameError    = document.getElementById("nameError");
var emailError   = document.getElementById("emailError");
var messageError = document.getElementById("messageError");


// Simple email format check
function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

// Mark a field as invalid and show an error message
function setError(input, errorEl, message) {
  input.classList.add("input-error");
  errorEl.textContent = message;
}

// Clear the error state for a field
function clearError(input, errorEl) {
  input.classList.remove("input-error");
  errorEl.textContent = "";
}

// Validate all fields; returns true if everything is fine
function validateForm() {
  var valid = true;

  var name    = nameInput.value.trim();
  var email   = emailInput.value.trim();
  var message = messageInput.value.trim();

  // Name
  if (name === "") {
    setError(nameInput, nameError, "Please enter your name.");
    valid = false;
  } else {
    clearError(nameInput, nameError);
  }

  // Email
  if (email === "") {
    setError(emailInput, emailError, "Please enter your email address.");
    valid = false;
  } else if (!isValidEmail(email)) {
    setError(emailInput, emailError, "Please enter a valid email address.");
    valid = false;
  } else {
    clearError(emailInput, emailError);
  }

  // Message
  if (message === "") {
    setError(messageInput, messageError, "Please enter a message.");
    valid = false;
  } else {
    clearError(messageInput, messageError);
  }

  return valid;
}

// Reset feedback messages
function hideFeedback() {
  successMsg.style.display = "none";
  errorMsg.style.display   = "none";
}


/* Form submit handler */
form.addEventListener("submit", function (e) {
  e.preventDefault();

  hideFeedback();

  if (!validateForm()) {
    return;
  }

  // Disable the button while sending
  submitBtn.disabled    = true;
  submitBtn.textContent = "Sending…";

  // Parameters that map to your EmailJS template variables
  var templateParams = {
    name:    nameInput.value.trim(),
    email:   emailInput.value.trim(),
    message: messageInput.value.trim(),
    time:    new Date().toLocaleString("en-IE", {
               day:    "2-digit",
               month:  "short",
               year:   "numeric",
               hour:   "2-digit",
               minute: "2-digit"
             })
  };

  emailjs
    .send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams)
    .then(function () {
      // Success
      successMsg.style.display = "block";
      form.reset();
      // Clear any leftover error styling
      [nameInput, emailInput, messageInput].forEach(function (el) {
        el.classList.remove("input-error");
      });
      [nameError, emailError, messageError].forEach(function (el) {
        el.textContent = "";
      });
    })
    .catch(function (err) {
      // Failure — log the raw error to the console for debugging
      console.error("EmailJS error:", err);
      errorMsg.style.display = "block";
    })
    .finally(function () {
      submitBtn.disabled    = false;
      submitBtn.textContent = "Send Message";
    });
});


// Live validation — clear errors as user types
nameInput.addEventListener("input", function () {
  if (nameInput.value.trim() !== "") {
    clearError(nameInput, nameError);
  }
});

emailInput.addEventListener("input", function () {
  if (isValidEmail(emailInput.value)) {
    clearError(emailInput, emailError);
  }
});

messageInput.addEventListener("input", function () {
  if (messageInput.value.trim() !== "") {
    clearError(messageInput, messageError);
  }
});
