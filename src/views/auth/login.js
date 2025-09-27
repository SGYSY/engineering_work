import { roles } from "../../data/mockData.js";

function getRoleLabel(roleId) {
  return roles.find((role) => role.id === roleId)?.label || roleId;
}

export function renderLogin({ state, actions, toaster }) {
  const accounts = state.accounts || [];
  const visibleRoles = Array.from(
    new Set(accounts.map((account) => account.role).filter(Boolean))
  ).map((roleId) => ({ id: roleId, label: getRoleLabel(roleId) }));

  const container = document.createElement("div");
  container.style.display = "flex";
  container.style.justifyContent = "center";
  container.style.alignItems = "center";
  container.style.minHeight = "calc(100vh - 120px)";
  container.style.padding = "24px";

  const card = document.createElement("section");
  card.className = "card";
  card.style.maxWidth = "420px";
  card.style.width = "100%";
  card.style.padding = "32px";
  card.style.boxShadow = "0 16px 40px rgba(45, 68, 134, 0.12)";

  const title = document.createElement("h2");
  title.className = "section-title";
  title.textContent = "Sign in to continue";
  title.style.marginBottom = "12px";
  card.appendChild(title);

  const subtitle = document.createElement("p");
  subtitle.style.color = "var(--text-light)";
  subtitle.style.fontSize = "13px";
  subtitle.style.marginBottom = "24px";
  subtitle.textContent = "Choose your role and enter the credentials provided by the platform admin.";
  card.appendChild(subtitle);

  const form = document.createElement("form");
  form.style.display = "grid";
  form.style.gap = "16px";

  const roleField = document.createElement("label");
  roleField.style.display = "flex";
  roleField.style.flexDirection = "column";
  roleField.style.gap = "6px";
  roleField.style.fontSize = "12px";
  roleField.style.color = "var(--text-light)";
  roleField.textContent = "Login role";

  const roleSelect = document.createElement("select");
  roleSelect.className = "input";
  roleSelect.style.fontSize = "14px";

  visibleRoles.forEach((role) => {
    const option = document.createElement("option");
    option.value = role.id;
    option.textContent = role.label;
    roleSelect.appendChild(option);
  });

  roleField.appendChild(roleSelect);
  form.appendChild(roleField);

  const usernameField = document.createElement("label");
  usernameField.style.display = "flex";
  usernameField.style.flexDirection = "column";
  usernameField.style.gap = "6px";
  usernameField.style.fontSize = "12px";
  usernameField.style.color = "var(--text-light)";
  usernameField.textContent = "Username";

  const usernameInput = document.createElement("input");
  usernameInput.className = "input";
  usernameInput.placeholder = "Enter username";
  usernameInput.required = true;
  usernameField.appendChild(usernameInput);
  form.appendChild(usernameField);

  const passwordField = document.createElement("label");
  passwordField.style.display = "flex";
  passwordField.style.flexDirection = "column";
  passwordField.style.gap = "6px";
  passwordField.style.fontSize = "12px";
  passwordField.style.color = "var(--text-light)";
  passwordField.textContent = "Password";

  const passwordInput = document.createElement("input");
  passwordInput.className = "input";
  passwordInput.type = "password";
  passwordInput.placeholder = "Enter password";
  passwordInput.required = true;
  passwordField.appendChild(passwordInput);
  form.appendChild(passwordField);

  const helper = document.createElement("div");
  helper.style.background = "#f7f9ff";
  helper.style.borderRadius = "10px";
  helper.style.padding = "12px";
  helper.style.fontSize = "12px";
  helper.style.color = "#3a4f72";

  const helperTitle = document.createElement("div");
  helperTitle.style.fontWeight = "600";
  helperTitle.style.marginBottom = "6px";
  helperTitle.textContent = "Available accounts";
  helper.appendChild(helperTitle);

  const helperList = document.createElement("div");
  helperList.style.display = "grid";
  helperList.style.gap = "8px";
  helper.appendChild(helperList);
  form.appendChild(helper);

  const submit = document.createElement("button");
  submit.type = "submit";
  submit.className = "button";
  submit.textContent = "Sign in";
  form.appendChild(submit);

  card.appendChild(form);
  container.appendChild(card);

  function renderHelper(roleId) {
    helperList.innerHTML = "";
    const filtered = accounts.filter((account) => account.role === roleId);
    if (!filtered.length) {
      const empty = document.createElement("div");
      empty.style.color = "var(--text-light)";
      empty.textContent = "No accounts provided for this role.";
      helperList.appendChild(empty);
      return;
    }
    filtered.forEach((account) => {
      const row = document.createElement("div");
      row.style.display = "flex";
      row.style.justifyContent = "space-between";
      row.style.alignItems = "center";

      const info = document.createElement("div");
      info.innerHTML = `<strong>${account.displayName}</strong><br/><span style="color: var(--text-light);">${account.username} / ${account.password}</span>`;
      row.appendChild(info);

      const autofill = document.createElement("button");
      autofill.type = "button";
      autofill.className = "button button--ghost button--sm";
      autofill.textContent = "Use";
      autofill.addEventListener("click", () => {
        usernameInput.value = account.username;
        passwordInput.value = account.password;
        usernameInput.focus();
      });
      row.appendChild(autofill);

      helperList.appendChild(row);
    });
  }

  if (visibleRoles.length) {
    const initialRole = roleSelect.options[0]?.value || roleSelect.value;
    if (initialRole) {
      roleSelect.value = initialRole;
      renderHelper(initialRole);
      const firstAccount = accounts.find((account) => account.role === initialRole);
      if (firstAccount) {
        usernameInput.value = firstAccount.username;
        passwordInput.value = firstAccount.password || "";
      }
    }
  } else {
    roleSelect.disabled = true;
    helperList.innerHTML = "";
    const empty = document.createElement("div");
    empty.style.color = "var(--text-light)";
    empty.textContent = "No demo accounts available.";
    helperList.appendChild(empty);
  }

  roleSelect.addEventListener("change", () => {
    const roleId = roleSelect.value;
    const firstAccount = accounts.find((account) => account.role === roleId);
    usernameInput.value = firstAccount?.username || "";
    passwordInput.value = firstAccount?.password || "";
    renderHelper(roleId);
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    try {
      actions.login({ username: usernameInput.value, password: passwordInput.value });
      toaster.show(`Welcome back, ${usernameInput.value}`, { type: "success" });
    } catch (error) {
      toaster.show(error.message || "Unable to sign in", { type: "error" });
    }
  });

  return container;
}
