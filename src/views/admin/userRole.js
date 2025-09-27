import { roles as platformRoles } from "../../data/mockData.js";

export function renderAdminUserRole({ state, actions, toaster }) {
  let roles = [...state.admin.roles];
  let isCreatingRole = false;
  let userFormMode = null;
  let editingUserId = null;

  const container = document.createElement("div");
  const header = document.createElement("div");
  header.className = "page-header";
  header.innerHTML = `
    <div>
      <h2 class="section-title" style="margin-bottom:6px;">User & role management</h2>
      <p style="color: var(--text-light); font-size: 13px;">Maintain platform accounts, assign permissions, and toggle access.</p>
    </div>
    <div class="table-actions">
      <button class="button button--outline">Add user</button>
      <button class="button">Role templates</button>
    </div>
  `;
  container.appendChild(header);

  const grid = document.createElement("div");
  grid.className = "grid grid-2";
  container.appendChild(grid);

  const userCard = document.createElement("section");
  userCard.className = "card";
  grid.appendChild(userCard);

  const roleCard = document.createElement("section");
  roleCard.className = "card";
  grid.appendChild(roleCard);

  function escapeHtml(value) {
    return (value ?? "")
      .toString()
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function guessPlatformRole(roleName) {
    const normalized = (roleName || "").toLowerCase();
    if (normalized.includes("student")) return "student";
    if (normalized.includes("teacher")) return "teacher";
    if (normalized.includes("hr")) return "hr";
    if (normalized.includes("counselor")) return "teacher";
    if (normalized.includes("admin")) return "admin";
    return "admin";
  }

  function getPlatformRoleLabel(id) {
    return platformRoles.find((item) => item.id === id)?.label || id || "-";
  }

  function openUserForm(mode, userId = null) {
    userFormMode = mode;
    editingUserId = userId;
    renderUserCard();
  }

  function renderUserFormSection(users) {
    if (!userFormMode) return "";
    const editingTarget = userFormMode === "edit" ? users.find((item) => item.id === editingUserId) : null;
    const defaults = editingTarget
      ? {
          name: editingTarget.name,
          username: editingTarget.username,
          department: editingTarget.department,
          email: editingTarget.email,
          role: editingTarget.role,
          platformRole: editingTarget.platformRole,
          status: editingTarget.status
        }
      : {
          name: "",
          username: "",
          department: "",
          email: "",
          role: roles[0]?.name || "System User",
          platformRole: platformRoles[0]?.id || "admin",
          status: "Enabled"
        };

    return `
      <form data-role="user-form" data-mode="${userFormMode}" style="margin-top:18px; display:grid; gap:16px;">
        <div class="form-grid" style="grid-template-columns:1fr 1fr;">
          <label style="display:flex; flex-direction:column; gap:6px; font-size:12px; color: var(--text-light);">
            Name
            <input class="input" name="name" value="${escapeHtml(defaults.name)}" placeholder="E.g. Alex" required />
          </label>
          <label style="display:flex; flex-direction:column; gap:6px; font-size:12px; color: var(--text-light);">
            Username
            <input class="input" name="username" value="${escapeHtml(defaults.username || "")}" placeholder="Login username" ${
              userFormMode === "edit" ? "required" : "required"
            } />
          </label>
          ${
            userFormMode === "create"
              ? `
          <label style="display:flex; flex-direction:column; gap:6px; font-size:12px; color: var(--text-light);">
            Password
            <input class="input" type="password" name="password" placeholder="Temporary password" required />
          </label>
          `
              : ""
          }
          <label style="display:flex; flex-direction:column; gap:6px; font-size:12px; color: var(--text-light);">
            Status
            <select class="input" name="status">
              <option value="Enabled" ${defaults.status === "Enabled" ? "selected" : ""}>Enabled</option>
              <option value="Disabled" ${defaults.status === "Disabled" ? "selected" : ""}>Disabled</option>
            </select>
          </label>
        </div>
        <div class="form-grid" style="grid-template-columns:1fr 1fr;">
          <label style="display:flex; flex-direction:column; gap:6px; font-size:12px; color: var(--text-light);">
            Department / Company
            <input class="input" name="department" value="${escapeHtml(defaults.department || "")}" placeholder="Career Center" />
          </label>
          <label style="display:flex; flex-direction:column; gap:6px; font-size:12px; color: var(--text-light);">
            Email
            <input class="input" name="email" value="${escapeHtml(defaults.email || "")}" placeholder="user@example.com" />
          </label>
        </div>
        <div class="form-grid" style="grid-template-columns:1fr 1fr;">
          <label style="display:flex; flex-direction:column; gap:6px; font-size:12px; color: var(--text-light);">
            Display role
            <select class="input" name="role">
              ${roles
                .map(
                  (role) => `<option value="${escapeHtml(role.name)}" ${role.name === defaults.role ? "selected" : ""}>${escapeHtml(role.name)}</option>`
                )
                .join("")}
            </select>
          </label>
          <label style="display:flex; flex-direction:column; gap:6px; font-size:12px; color: var(--text-light);">
            Platform access
            <select class="input" name="platformRole">
              ${platformRoles
                .map(
                  (role) => `<option value="${role.id}" ${role.id === defaults.platformRole ? "selected" : ""}>${escapeHtml(role.label)}</option>`
                )
                .join("")}
            </select>
          </label>
        </div>
        <div class="form-actions" style="justify-content:flex-end;">
          <button type="button" class="button button--ghost button--sm" data-action="cancel-user-form">Cancel</button>
          <button type="submit" class="button button--sm">${userFormMode === "create" ? "Create user" : "Save changes"}</button>
        </div>
      </form>
    `;
  }

  function renderUserCard() {
    const latestState = window.__careerStore?.getState?.() || state;
    const users = latestState.admin?.users || state.admin.users;
    roles = latestState.admin?.roles ? [...latestState.admin.roles] : roles;
    userCard.innerHTML = `
      <h3 class="section-title">User list</h3>
      <div class="table-wrapper">
      <table class="table table--striped">
        <thead>
          <tr>
            <th>Name</th>
            <th>Login</th>
            <th>Role</th>
            <th>Department / Company</th>
            <th>Email</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          ${users
            .map(
              (user) => `
                <tr data-id="${user.id}">
                  <td>
                    <div style="font-weight:600;">${escapeHtml(user.name)}</div>
                    <div style="color: var(--text-light); font-size:12px;">${getPlatformRoleLabel(user.platformRole)}</div>
                  </td>
                  <td style="font-size:13px;">
                    <div style="font-weight:500;">${escapeHtml(user.username || "-")}</div>
                    <div style="color: var(--text-light);">${user.platformRole ? `Role: ${escapeHtml(user.platformRole)}` : "-"}</div>
                  </td>
                  <td>
                    <select data-id="${user.id}" class="input" style="padding:6px 10px;">
                      ${roles
                        .map(
                          (role) =>
                            `<option value="${escapeHtml(role.name)}" ${role.name === user.role ? "selected" : ""}>${escapeHtml(role.name)}</option>`
                        )
                        .join("")}
                    </select>
                  </td>
                  <td>${escapeHtml(user.department || "-")}</td>
                  <td>${escapeHtml(user.email || "-")}</td>
                  <td><span class="badge ${user.status === "Enabled" ? "badge--success" : "badge--ghost"}">${user.status}</span></td>
                  <td>
                    <div class="table-actions">
                      <button data-action="edit" data-id="${user.id}">Edit</button>
                      <button data-action="toggle" data-id="${user.id}">${user.status === "Enabled" ? "Disable" : "Enable"}</button>
                      <button data-action="reset" data-id="${user.id}">Reset password</button>
                    </div>
                  </td>
                </tr>
              `
            )
            .join("")}
        </tbody>
      </table>
      </div>
      ${renderUserFormSection(users)}
    `;

    attachUserRowHandlers();
    attachUserFormHandlers();
  }

  function renderRoleCard() {
    const latestState = window.__careerStore?.getState?.() || state;
    roles = latestState.admin?.roles ? [...latestState.admin.roles] : roles;
    roleCard.innerHTML = `
      <h3 class="section-title">Role permissions</h3>
      <div class="list">
        ${roles
          .map(
            (role) => `
              <div class="data-row">
                <div>
                  <div style="font-weight:600;">${role.name}</div>
                  <div style="color: var(--text-light); font-size:12px;">${role.desc}</div>
                </div>
                <div class="table-actions">
                  <button class="button button--ghost button--sm">Edit</button>
                  <button class="button button--ghost button--sm">Authorize</button>
                </div>
              </div>
            `
          )
          .join("")}
      </div>
      ${
        isCreatingRole
          ? `
        <form data-form="create-role" style="margin-top:18px; display:grid; gap:16px;">
          <div class="form-grid" style="grid-template-columns:1fr;">
            <label style="display:flex; flex-direction:column; gap:6px; font-size:12px; color: var(--text-light);">
              Role name
              <input class="input" name="name" placeholder="E.g. Recruiter" required />
            </label>
            <label style="display:flex; flex-direction:column; gap:6px; font-size:12px; color: var(--text-light);">
              Description
              <textarea class="input" name="desc" rows="3" placeholder="Describe permissions"></textarea>
            </label>
          </div>
          <div class="form-actions" style="justify-content:flex-end;">
            <button type="button" class="button button--ghost button--sm" data-action="cancel-create">Cancel</button>
            <button type="submit" class="button button--sm">Save role</button>
          </div>
        </form>
      `
          : `<button class="button button--outline" style="margin-top:18px;" data-action="start-create">Create role</button>`
      }
    `;
  }

  renderUserCard();
  renderRoleCard();

  header.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;
    if (target.textContent?.includes("Add user")) {
      openUserForm("create");
    }
    if (target.textContent?.includes("Role templates")) {
      toaster.show("Role templates are preloaded, customize them as needed.", { type: "info" });
    }
  });

  roleCard.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;
    const action = target.dataset.action;
    if (action === "start-create") {
      isCreatingRole = true;
      renderRoleCard();
    }
    if (action === "cancel-create") {
      isCreatingRole = false;
      renderRoleCard();
    }
  });

  roleCard.addEventListener("submit", (event) => {
    const form = event.target;
    if (!(form instanceof HTMLFormElement)) return;
    if (form.dataset.form !== "create-role") return;
    event.preventDefault();
    const data = new FormData(form);
    const name = (data.get("name") || "").toString().trim();
    const desc = (data.get("desc") || "").toString().trim();
    if (!name) {
      toaster.show("Role name is required", { type: "warn" });
      return;
    }
    const nameTaken = roles.some((role) => role.name.toLowerCase() === name.toLowerCase());
    if (nameTaken) {
      toaster.show("Role name already exists", { type: "warn" });
      return;
    }

    const newRole = {
      id: `role-${Date.now()}`,
      name,
      desc: desc || "Custom permissions"
    };

    actions.addAdminRole(newRole);
    roles.push(newRole);
    isCreatingRole = false;
    renderRoleCard();
    renderUserCard();
    toaster.show("Role created", { type: "success" });
  });

  function attachUserRowHandlers() {
    userCard.querySelectorAll("select[data-id]").forEach((select) => {
      select.addEventListener("change", () => {
        const userId = select.dataset.id;
        const roleName = select.value;
        const platformRole = guessPlatformRole(roleName);
        try {
          actions.updateAdminUser(userId, { role: roleName, platformRole });
          toaster.show("Role updated", { type: "success" });
        } catch (error) {
          toaster.show(error.message || "Unable to update role", { type: "error" });
        }
      });
    });

    userCard.querySelectorAll("[data-action]").forEach((button) => {
      button.addEventListener("click", () => {
        const id = button.dataset.id;
        const action = button.dataset.action;
        if (!id || !action) return;
        if (action === "toggle") {
          actions.toggleUserStatus(id);
          toaster.show("User status updated", { type: "info" });
          return;
        }
        if (action === "reset") {
          const newPwd = actions.resetUserPassword(id);
          if (newPwd) {
            toaster.show(`Temporary password: ${newPwd}`, { type: "info", duration: 6000 });
          } else {
            toaster.show("Account not found for password reset", { type: "warn" });
          }
          return;
        }
        if (action === "edit") {
          openUserForm("edit", id);
        }
      });
    });
  }

  function attachUserFormHandlers() {
    const form = userCard.querySelector("form[data-role='user-form']");
    if (!(form instanceof HTMLFormElement)) return;
    const mode = form.dataset.mode;

    const cancel = form.querySelector("[data-action='cancel-user-form']");
    if (cancel instanceof HTMLElement) {
      cancel.addEventListener("click", () => {
        userFormMode = null;
        editingUserId = null;
        renderUserCard();
      });
    }

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const data = new FormData(form);
      const payload = {
        name: (data.get("name") || "").toString().trim(),
        username: (data.get("username") || "").toString().trim(),
        password: (data.get("password") || "").toString().trim(),
        department: (data.get("department") || "").toString().trim(),
        email: (data.get("email") || "").toString().trim(),
        role: (data.get("role") || "").toString().trim(),
        platformRole: (data.get("platformRole") || "").toString().trim(),
        status: (data.get("status") || "Enabled").toString()
      };

      if (!payload.name) {
        toaster.show("Name is required", { type: "warn" });
        return;
      }
      if (!payload.username) {
        toaster.show("Username is required", { type: "warn" });
        return;
      }

      try {
        if (mode === "create") {
          if (!payload.password) {
            toaster.show("Password is required", { type: "warn" });
            return;
          }
          actions.createPlatformUser(payload);
          toaster.show("User created", { type: "success" });
        } else if (mode === "edit" && editingUserId) {
          const updatePayload = { ...payload };
          delete updatePayload.password;
          actions.updateAdminUser(editingUserId, updatePayload);
          toaster.show("User updated", { type: "success" });
        }
        userFormMode = null;
        editingUserId = null;
        renderUserCard();
      } catch (error) {
        toaster.show(error.message || "Operation failed", { type: "error" });
      }
    });
  }

  return container;
}
