export function renderStudentNotifications({ state, actions, toaster }) {
  const notifications = state.student.notifications;
  const container = document.createElement("div");

  const header = document.createElement("div");
  header.className = "page-header";
  header.innerHTML = `
    <div>
      <h2 class="section-title" style="margin-bottom:6px;">通知中心</h2>
      <p style="color: var(--text-light); font-size: 13px;">查看系统消息、投递状态与活动提醒，支持快速已读与筛选。</p>
    </div>
    <div class="table-actions">
      <button class="button button--outline" data-action="mark-read">全部标记已读</button>
      <button class="button" data-action="subscribe">通知订阅</button>
    </div>
  `;
  container.appendChild(header);

  const controls = document.createElement("div");
  controls.className = "filter-bar";

  const categorySelect = document.createElement("select");
  const categories = ["全部", ...new Set(notifications.map((item) => item.category))];
  categorySelect.innerHTML = categories
    .map((category, index) => `<option value="${index === 0 ? "" : category}">${category}</option>`)
    .join("");
  controls.appendChild(categorySelect);

  const unreadToggle = document.createElement("label");
  unreadToggle.style.display = "flex";
  unreadToggle.style.alignItems = "center";
  unreadToggle.style.gap = "8px";
  unreadToggle.style.fontSize = "12px";
  unreadToggle.style.color = "var(--text-light)";
  unreadToggle.innerHTML = `<input type="checkbox" /> 仅显示未读`;
  controls.appendChild(unreadToggle);

  container.appendChild(controls);

  const list = document.createElement("div");
  list.className = "notification-list";
  container.appendChild(list);

  function renderList() {
    const category = categorySelect.value;
    const unreadOnly = unreadToggle.querySelector("input").checked;

    const filtered = notifications.filter((item) => {
      const matchCategory = category ? item.category === category : true;
      const matchUnread = unreadOnly ? !item.read : true;
      return matchCategory && matchUnread;
    });

    list.innerHTML = "";
    if (!filtered.length) {
      const empty = document.createElement("div");
      empty.className = "empty-state";
      empty.textContent = "暂无通知";
      list.appendChild(empty);
      return;
    }

    filtered.forEach((item) => {
      const row = document.createElement("div");
      row.className = `notification-item ${item.read ? "" : "unread"}`;
      row.dataset.id = item.id;
      row.innerHTML = `
        <div>
          <div style="font-weight:600; margin-bottom:6px;">${item.title}</div>
          <div style="color: var(--text-light); font-size: 12px;">${item.category} · ${item.time}</div>
        </div>
        <div class="table-actions">
          <button class="button button--ghost button--sm" data-action="${item.read ? "mark-unread" : "mark-read"}" data-id="${item.id}">${
        item.read ? "标为未读" : "标为已读"
      }</button>
          <button class="button button--outline button--sm" data-action="detail" data-id="${item.id}">查看详情</button>
        </div>
      `;
      list.appendChild(row);
    });
  }

  list.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;
    const action = target.dataset.action;
    const id = target.dataset.id;
    if (!action || !id) return;

    if (action === "mark-read") {
      actions.markNotification(id, true);
      toaster.show("已标记为已读", { type: "success" });
    }
    if (action === "mark-unread") {
      actions.markNotification(id, false);
      toaster.show("已标记为未读", { type: "info" });
    }
    if (action === "detail") {
      toaster.show("通知详情已弹出（模拟）", { type: "info" });
    }
  });

  categorySelect.addEventListener("change", renderList);
  unreadToggle.querySelector("input").addEventListener("change", renderList);
  header.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;
    if (target.dataset.action === "mark-read") {
      actions.markAllNotifications(true);
      toaster.show("全部通知已标记为已读", { type: "success" });
    }
    if (target.dataset.action === "subscribe") {
      toaster.show("已订阅最新投递与活动通知", { type: "success" });
    }
  });

  renderList();
  return container;
}
