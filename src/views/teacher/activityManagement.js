export function renderTeacherActivityManagement({ state, actions, toaster }) {
  const activities = state.teacher.activities;
  const approvals = state.teacher.approvals;
  const exportsList = state.teacher.exports;
  const checkin = state.teacher.checkin;
  let isCreating = false;

  const container = document.createElement("div");

  const header = document.createElement("div");
  header.className = "page-header";
  header.innerHTML = `
    <div>
      <h2 class="section-title" style="margin-bottom:6px;">活动管理与审核</h2>
      <p style="color: var(--text-light); font-size: 13px;">创建活动、审核企业报名、导出名单与生成签到二维码。</p>
    </div>
    <button class="button" data-action="toggle-form">创建活动</button>
  `;
  container.appendChild(header);

  const layout = document.createElement("div");
  layout.className = "grid grid-2";
  layout.style.alignItems = "start";
  container.appendChild(layout);

  const activityCard = document.createElement("section");
  activityCard.className = "card";
  layout.appendChild(activityCard);

  const rightColumn = document.createElement("div");
  rightColumn.className = "grid";
  rightColumn.style.gap = "24px";
  layout.appendChild(rightColumn);

  const approvalCard = document.createElement("section");
  approvalCard.className = "card";
  approvalCard.innerHTML = `
    <h3 class="section-title">企业报名审核</h3>
    <div class="list">
      ${approvals
        .map(
          (item) => `
            <div class="data-row" data-id="${item.id}">
              <div>
                <div style="font-weight:600; margin-bottom:4px;">${item.company}</div>
                <div style="color: var(--text-light); font-size: 12px;">申请 ${item.type} · 提交于 ${item.requestAt}</div>
              </div>
              <div class="table-actions">
                <button class="button button--ghost button--sm" data-action="reject">驳回</button>
                <button class="button button--sm" data-action="approve">通过</button>
              </div>
            </div>
          `
        )
        .join("")}
    </div>
  `;
  rightColumn.appendChild(approvalCard);

  const exportCard = document.createElement("section");
  exportCard.className = "card";
  exportCard.innerHTML = `
    <h3 class="section-title">导出报名名单</h3>
    <div class="data-list">
      ${exportsList
        .map(
          (item) => `
            <div class="data-row">
              <span>${item.label}</span>
              <button class="button button--ghost button--sm" data-file="${item.fileName}">导出</button>
            </div>
          `
        )
        .join("")}
    </div>
  `;
  rightColumn.appendChild(exportCard);

  const qrCard = document.createElement("section");
  qrCard.className = "card";
  qrCard.innerHTML = `
    <h3 class="section-title">签到二维码</h3>
    <div style="display:flex; align-items:center; gap:18px;">
      <div style="width:140px; height:140px; border-radius:16px; background:#f4f7ff; display:flex; align-items:center; justify-content:center; color: var(--text-light); font-size:13px;">${checkin.qrPlaceholder}</div>
      <div>
        <div style="font-weight:600; margin-bottom:8px;">${checkin.qrHint}</div>
        <p style="color:#3a4f72; font-size:13px;">生成二维码供现场签到，支持下载与刷新。</p>
        <div class="table-actions" style="margin-top:12px;">
          <button class="button button--outline button--sm">下载二维码</button>
          <button class="button button--ghost button--sm">刷新</button>
        </div>
      </div>
    </div>
  `;
  rightColumn.appendChild(qrCard);

  function renderActivityCard() {
    activityCard.innerHTML = `
      <h3 class="section-title">活动列表</h3>
      <table class="table table--striped">
        <thead>
          <tr>
            <th>活动名称</th>
            <th>时间</th>
            <th>地点</th>
            <th>名额</th>
            <th>报名数</th>
            <th>状态</th>
          </tr>
        </thead>
        <tbody>
          ${activities
            .map(
              (item) => `
                <tr>
                  <td>${item.title}</td>
                  <td>${item.date}</td>
                  <td>${item.location}</td>
                  <td>${item.capacity}</td>
                  <td>${item.registered}</td>
                  <td><span class="badge">${item.status}</span></td>
                </tr>
              `
            )
            .join("")}
        </tbody>
      </table>
      ${isCreating ? renderForm() : ""}
    `;

    const form = activityCard.querySelector("form");
    if (form) {
      form.addEventListener("submit", (event) => {
        event.preventDefault();
        const data = new FormData(form);
        actions.addTeacherActivity({
          title: data.get("title") || "未命名活动",
          date: data.get("date") || "待定",
          location: data.get("location") || "待定",
          capacity: Number(data.get("capacity")) || 0
        });
        isCreating = false;
        toaster.show("活动草稿已创建", { type: "success" });
        renderActivityCard();
      });
    }
  }

  function renderForm() {
    return `
      <form style="margin-top:24px; display:grid; gap:16px;">
        <div class="form-grid">
          <label style="display:flex; flex-direction:column; gap:6px; font-size:12px; color: var(--text-light);">
            活动名称
            <input class="input" name="title" required />
          </label>
          <label style="display:flex; flex-direction:column; gap:6px; font-size:12px; color: var(--text-light);">
            活动时间
            <input class="input" type="datetime-local" name="date" />
          </label>
          <label style="display:flex; flex-direction:column; gap:6px; font-size:12px; color: var(--text-light);">
            活动地点
            <input class="input" name="location" />
          </label>
          <label style="display:flex; flex-direction:column; gap:6px; font-size:12px; color: var(--text-light);">
            名额限制
            <input class="input" type="number" name="capacity" />
          </label>
        </div>
        <label style="display:flex; flex-direction:column; gap:6px; font-size:12px; color: var(--text-light);">
          活动说明
          <textarea class="input" name="desc" placeholder="输入活动亮点、参会要求等"></textarea>
        </label>
        <div class="form-actions" style="justify-content:flex-end;">
          <button class="button button--ghost" type="button" data-role="cancel">取消</button>
          <button class="button" type="submit">保存</button>
        </div>
      </form>
    `;
  }

  header.querySelector("[data-action='toggle-form']").addEventListener("click", () => {
    isCreating = !isCreating;
    renderActivityCard();
  });

  activityCard.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;
    if (target.dataset.role === "cancel") {
      isCreating = false;
      renderActivityCard();
    }
  });

  approvalCard.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;
    const action = target.dataset.action;
    if (!action) return;
    const row = target.closest(".data-row");
    if (!row) return;
    const id = row.dataset.id;
    if (action === "approve") {
      actions.updateTeacherApproval(id, "已通过");
      toaster.show("已通过报名申请", { type: "success" });
    }
    if (action === "reject") {
      actions.updateTeacherApproval(id, "已驳回");
      toaster.show("已驳回报名申请", { type: "warn" });
    }
  });

  exportCard.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;
    const file = target.dataset.file;
    if (file) {
      toaster.show(`已导出 ${file}`, { type: "success" });
    }
  });

  renderActivityCard();

  return container;
}
