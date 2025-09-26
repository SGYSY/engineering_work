export function renderStudentNotifications({ state, actions, toaster }) {
  const notifications = state.student.notifications;
  const container = document.createElement("div");

  const header = document.createElement("div");
  header.className = "page-header";
  header.innerHTML = `
    <div>
      <h2 class="section-title" style="margin-bottom:6px;">Notification center</h2>
      <p style="color: var(--text-light); font-size: 13px;">Review system messages, application updates, and activity alerts with quick filtering.</p>
    </div>
    <div class="table-actions">
      <button class="button button--outline" data-action="mark-read">Mark all read</button>
      <button class="button" data-action="subscribe">Subscribe</button>
    </div>
  `;
  container.appendChild(header);

  const controls = document.createElement("div");
  controls.className = "filter-bar";

  const categorySelect = document.createElement("select");
  const categories = ["All", ...new Set(notifications.map((item) => item.category))];
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
  unreadToggle.innerHTML = `<input type="checkbox" /> Unread only`;
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
      empty.textContent = "No notifications";
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
        item.read ? "Mark unread" : "Mark read"
      }</button>
          <button class="button button--outline button--sm" data-action="detail" data-id="${item.id}">View details</button>
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
      toaster.show("Marked as read", { type: "success" });
    }
    if (action === "mark-unread") {
      actions.markNotification(id, false);
      toaster.show("Marked as unread", { type: "info" });
    }
    if (action === "detail") {
      toaster.show("Notification detail opened (mock)", { type: "info" });
    }
  });

  categorySelect.addEventListener("change", renderList);
  unreadToggle.querySelector("input").addEventListener("change", renderList);
  header.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;
    if (target.dataset.action === "mark-read") {
      actions.markAllNotifications(true);
      toaster.show("All notifications marked as read", { type: "success" });
    }
    if (target.dataset.action === "subscribe") {
      toaster.show("Subscribed to latest updates", { type: "success" });
    }
  });

  renderList();
  return container;
}
