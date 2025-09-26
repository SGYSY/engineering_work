export function renderAdminUserRole({ state, actions, toaster }) {
  const users = state.admin.users;
  let roles = [...state.admin.roles];
  let isCreatingRole = false;

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

  function renderUserCard() {
    userCard.innerHTML = `
      <h3 class="section-title">User list</h3>
      <table class="table table--striped">
        <thead>
          <tr>
            <th>Name</th>
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
                  <td>${user.name}</td>
                  <td>
                    <select data-id="${user.id}" class="input" style="padding:6px 10px;">
                      ${roles
                        .map((role) => `<option value="${role.name}" ${role.name === user.role ? "selected" : ""}>${role.name}</option>`)
                        .join("")}
                    </select>
                  </td>
                  <td>${user.department}</td>
                  <td>${user.email}</td>
                  <td><span class="badge ${user.status === "Enabled" ? "badge--success" : "badge--ghost"}">${user.status}</span></td>
                  <td>
                    <div class="table-actions">
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
    `;

    userCard.querySelectorAll("select").forEach((select) => {
      select.addEventListener("change", () => {
        actions.updateUserRole(select.dataset.id, select.value);
        toaster.show("Role updated", { type: "success" });
      });
    });

    userCard.querySelectorAll("[data-action]").forEach((button) => {
      button.addEventListener("click", () => {
        const id = button.dataset.id;
        const action = button.dataset.action;
        if (action === "toggle") {
          actions.toggleUserStatus(id);
          toaster.show("User status updated", { type: "info" });
        }
        if (action === "reset") {
          actions.addLog({ actor: "System", action: "Reset password", target: id });
          toaster.show("Password reset email sent", { type: "success" });
        }
      });
    });
  }

  function renderRoleCard() {
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

  return container;
}
