const toggleButton = document.getElementById("theme-toggle");
const body = document.body;

function applyTheme(theme) {
  const isDark = theme === "dark";
  body.classList.toggle("dark-mode", isDark);

  if (toggleButton) {
    toggleButton.textContent = isDark ? "☀️" : "🌙";
  }

  localStorage.setItem("theme", theme);
}

const savedTheme = localStorage.getItem("theme");

if (savedTheme === "dark") {
  applyTheme("dark");
} else if (savedTheme === "light") {
  applyTheme("light");
} else {
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  applyTheme(prefersDark ? "dark" : "light");
}

if (toggleButton) {
  toggleButton.addEventListener("click", () => {
    const nextTheme = body.classList.contains("dark-mode") ? "light" : "dark";
    applyTheme(nextTheme);
  });
}