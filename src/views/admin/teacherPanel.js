export function renderAdminTeacherPanel({ state, navigate, toaster }) {
  const teacher = state.teacher;
  const container = document.createElement("div");
  const header = document.createElement("div");
  header.className = "page-header";
  header.innerHTML = `
    <div>
      <h2 class="section-title" style="margin-bottom:6px;">教师端管理</h2>
      <p style="color: var(--text-light); font-size: 13px;">查看教师端关键数据，可一键跳转教师端界面进行配置。</p>
    </div>
    <div class="table-actions">
      <button class="button button--outline" data-action="open">进入教师端</button>
      <button class="button">授权教师账号</button>
    </div>
  `;
  container.appendChild(header);

  const grid = document.createElement("div");
  grid.className = "grid grid-2";
  container.appendChild(grid);

  const activityCard = document.createElement("section");
  activityCard.className = "card";
  activityCard.innerHTML = `
    <h3 class="section-title">活动运行概览</h3>
    <table class="table table--striped">
      <thead>
        <tr>
          <th>活动名称</th>
          <th>时间</th>
          <th>名额</th>
          <th>报名数</th>
          <th>状态</th>
        </tr>
      </thead>
      <tbody>
        ${teacher.activities
          .map(
            (item) => `
              <tr>
                <td>${item.title}</td>
                <td>${item.date}</td>
                <td>${item.capacity}</td>
                <td>${item.registered}</td>
                <td><span class="badge">${item.status}</span></td>
              </tr>
            `
          )
          .join("")}
      </tbody>
    </table>
  `;
  grid.appendChild(activityCard);

  const checklistCard = document.createElement("section");
  checklistCard.className = "card";
  checklistCard.innerHTML = `
    <h3 class="section-title">审核事项</h3>
    <div class="list">
      ${teacher.approvals
        .map(
          (item) => `
            <div class="data-row">
              <div>
                <div style="font-weight:600;">${item.company}</div>
                <div style="color: var(--text-light); font-size:12px;">${item.type} · 提交于 ${item.requestAt}</div>
              </div>
              <div class="table-actions">
                <button class="button button--ghost button--sm">提醒教师审批</button>
              </div>
            </div>
          `
        )
        .join("")}
    </div>
    <div style="margin-top:16px;">
      <div style="font-weight:600; margin-bottom:6px;">签到二维码</div>
      <div style="display:flex; gap:12px; align-items:center;">
        <div style="width:96px; height:96px; border-radius:12px; background:#f4f7ff; display:flex; align-items:center; justify-content:center; color: var(--text-light); font-size:12px;">${teacher.checkin.qrPlaceholder}</div>
        <button class="button button--outline button--sm">下载</button>
      </div>
    </div>
  `;
  grid.appendChild(checklistCard);

  header.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;
    if (target.dataset.action === "open") {
      navigate("teacher", "activity-review");
      toaster.show("已跳转到教师端活动管理", { type: "info" });
    }
  });

  return container;
}
