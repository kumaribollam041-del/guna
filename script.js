"use strict";

const header = document.querySelector(".site-header");
const navLinks = [...document.querySelectorAll(".nav-link")];
const menuToggle = document.querySelector(".menu-toggle");
const navList = document.querySelector(".nav-links");
const sections = [...document.querySelectorAll("main section[id]")];

document.querySelector("#year").textContent = new Date().getFullYear();

function updateHeader() {
  header.classList.toggle("scrolled", window.scrollY > 20);
}

updateHeader();
window.addEventListener("scroll", updateHeader, { passive: true });

menuToggle.addEventListener("click", () => {
  const isExpanded = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!isExpanded));
  menuToggle.setAttribute("aria-label", isExpanded ? "Open navigation menu" : "Close navigation menu");
  navList.classList.toggle("open", !isExpanded);
});

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    navList.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation menu");
  });
});

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll(".reveal").forEach((item) => revealObserver.observe(item));

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        navLinks.forEach((link) => {
          link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`);
        });
      }
    });
  }, { rootMargin: "-35% 0px -55% 0px" });
  sections.forEach((section) => sectionObserver.observe(section));
} else {
  document.querySelectorAll(".reveal").forEach((item) => item.classList.add("visible"));
}

const form = document.querySelector("#contact-form");
const formStatus = document.querySelector("#form-status");
const fields = [...form.querySelectorAll("input, textarea")];

function validateField(field) {
  const errorElement = document.querySelector(`#${field.name}-error`);
  let message = "";
  const value = field.value.trim();

  if (!value) {
    message = "This field is required.";
  } else if (field.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
    message = "Enter a valid email address.";
  } else if (field.name === "name" && value.length < 2) {
    message = "Please enter at least 2 characters.";
  } else if (field.name === "subject" && value.length < 2) {
    message = "Please enter a subject.";
  } else if (field.name === "message" && value.length < 10) {
    message = "Please enter at least 10 characters.";
  }

  field.setAttribute("aria-invalid", String(Boolean(message)));
  errorElement.textContent = message;
  return !message;
}

fields.forEach((field) => {
  field.addEventListener("blur", () => validateField(field));
  field.addEventListener("input", () => {
    if (field.hasAttribute("aria-invalid")) validateField(field);
    formStatus.textContent = "";
    formStatus.classList.remove("error");
  });
});

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const isValid = fields.map(validateField).every(Boolean);

  if (!isValid) {
    formStatus.textContent = "Please fix the highlighted fields and try again.";
    formStatus.classList.add("error");
    form.querySelector('[aria-invalid="true"]').focus();
    return;
  }

  formStatus.classList.remove("error");
  formStatus.textContent = "Thanks for your message! This demo form is validated, but isn’t connected to a mail service yet.";
  form.reset();
  fields.forEach((field) => field.removeAttribute("aria-invalid"));
});
