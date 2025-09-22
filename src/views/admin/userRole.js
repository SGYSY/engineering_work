export function renderAdminUserRole({ state, actions, toaster }) {
  const users = state.admin.users;
  const roles = state.admin.roles;

  const container = document.createElement("div");
  const header = document.createElement("div");
  header.className = "page-header";
  header.innerHTML = `
    <div>
      <h2 class="section-title" style="margin-bottom:6px;">用户与角色管理</h2>
      <p style="color: var(--text-light); font-size: 13px;">维护平台账号、分配角色权限，支持启用停用。</p>
    </div>
    <div class="table-actions">
      <button class="button button--outline">新增用户</button>
      <button class="button">角色模版</button>
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
      <h3 class="section-title">用户列表</h3>
      <table class="table table--striped">
        <thead>
          <tr>
            <th>姓名</th>
            <th>角色</th>
            <th>部门/企业</th>
            <th>邮箱</th>
            <th>状态</th>
            <th>操作</th>
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
                  <td><span class="badge ${user.status === "启用" ? "badge--success" : "badge--ghost"}">${user.status}</span></td>
                  <td>
                    <div class="table-actions">
                      <button data-action="toggle" data-id="${user.id}">${user.status === "启用" ? "停用" : "启用"}</button>
                      <button data-action="reset" data-id="${user.id}">重置密码</button>
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
        toaster.show("角色已更新", { type: "success" });
      });
    });

    userCard.querySelectorAll("[data-action]").forEach((button) => {
      button.addEventListener("click", () => {
        const id = button.dataset.id;
        const action = button.dataset.action;
        if (action === "toggle") {
          actions.toggleUserStatus(id);
          toaster.show("用户状态已更新", { type: "info" });
        }
        if (action === "reset") {
          actions.addLog({ actor: "系统", action: "重置密码", target: id });
          toaster.show("已发送密码重置邮件", { type: "success" });
        }
      });
    });
  }

  function renderRoleCard() {
    roleCard.innerHTML = `
      <h3 class="section-title">角色权限</h3>
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
                  <button class="button button--ghost button--sm">编辑</button>
                  <button class="button button--ghost button--sm">授权</button>
                </div>
              </div>
            `
          )
          .join("")}
      </div>
      <button class="button button--outline" style="margin-top:18px;">新增角色</button>
    `;
  }

  renderUserCard();
  renderRoleCard();

  return container;
}
