const TYPES = {
  info: "toast--info",
  success: "toast--success",
  warn: "toast--warn",
  error: "toast--error"
};

export function mountToaster() {
  let container = document.querySelector(".toast-container");
  if (!container) {
    container = document.createElement("div");
    container.className = "toast-container";
    document.body.appendChild(container);
  }

  return {
    show(message, { type = "info", duration = 2800 } = {}) {
      const toast = document.createElement("div");
      toast.className = `toast ${TYPES[type] || TYPES.info}`;
      toast.textContent = message;
      container.appendChild(toast);
      setTimeout(() => {
        toast.classList.add("toast--hide");
        setTimeout(() => toast.remove(), 300);
      }, duration);
    }
  };
}
