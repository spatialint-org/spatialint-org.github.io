// Theme: persists a choice, otherwise follows the system preference set in <head>.
const root = document.documentElement;
const themeToggle = document.querySelector("[data-theme-toggle]");
const themeColor = document.querySelector('meta[name="theme-color"]');

function applyTheme(theme, persist) {
  root.dataset.theme = theme;
  if (persist) {
    try {
      localStorage.setItem("si-theme", theme);
    } catch (e) {}
  }
  if (themeToggle) {
    themeToggle.setAttribute("aria-label", theme === "dark" ? "Switch to light theme" : "Switch to dark theme");
    themeToggle.setAttribute("title", theme === "dark" ? "Switch to light theme" : "Switch to dark theme");
  }
  if (themeColor) themeColor.setAttribute("content", theme === "dark" ? "#101511" : "#f4f0e6");
}

applyTheme(root.dataset.theme || "light", false);

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    applyTheme(root.dataset.theme === "dark" ? "light" : "dark", true);
  });
}

const media = window.matchMedia("(prefers-color-scheme: dark)");
if (media.addEventListener) {
  media.addEventListener("change", (e) => {
    try {
      if (localStorage.getItem("si-theme")) return;
    } catch (err) {}
    applyTheme(e.matches ? "dark" : "light", false);
  });
}

// Mobile navigation
const nav = document.querySelector(".site-header");
const navToggle = document.querySelector(".nav-toggle");
if (navToggle && nav) {
  navToggle.addEventListener("click", () => {
    const open = nav.classList.toggle("nav-open");
    navToggle.setAttribute("aria-expanded", String(open));
  });
  nav.querySelectorAll(".nav-menu a").forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("nav-open");
      navToggle.setAttribute("aria-expanded", "false");
    });
  });
}

// Docs sidebar on small screens
const docsSidebar = document.querySelector(".docs-sidebar");
const docsMenuBtn = document.querySelector(".docs-menu-btn");
if (docsSidebar && docsMenuBtn) {
  docsMenuBtn.addEventListener("click", () => {
    const open = docsSidebar.classList.toggle("is-open");
    docsMenuBtn.setAttribute("aria-expanded", String(open));
  });
}

// Copy buttons
async function copyText(text, button) {
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    const area = document.createElement("textarea");
    area.value = text;
    area.style.position = "fixed";
    area.style.opacity = "0";
    document.body.appendChild(area);
    area.select();
    document.execCommand("copy");
    area.remove();
  }
  const label = button.textContent;
  button.textContent = "Copied";
  button.classList.add("is-copied");
  setTimeout(() => {
    button.textContent = label;
    button.classList.remove("is-copied");
  }, 1600);
}

document.querySelectorAll("[data-copy]").forEach((button) => {
  button.addEventListener("click", () => copyText(button.dataset.copy, button));
});

document.querySelectorAll(".prose pre:not(.no-copy)").forEach((pre) => {
  const button = document.createElement("button");
  button.className = "code-copy";
  button.type = "button";
  button.textContent = "Copy";
  button.addEventListener("click", () => {
    const clone = pre.cloneNode(true);
    clone.querySelectorAll(".code-copy").forEach((el) => el.remove());
    copyText(clone.innerText, button);
  });
  pre.appendChild(button);
});
