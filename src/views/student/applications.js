export function renderStudentApplications({ state, actions, toaster }) {
  const container = document.createElement("div");
  const applications = state.student.applications;

  const header = document.createElement("div");
  header.className = "page-header";
  header.innerHTML = `
    <div>
      <h2 class="section-title" style="margin-bottom:6px;">我的投递</h2>
      <p style="color: var(--text-light); font-size: 13px;">查看投递历史与状态时间线，可补充沟通消息与附件。</p>
    </div>
    <div class="table-actions">
      <button class="button button--outline" data-action="export">导出投递记录</button>
      <button class="button" data-action="refresh">同步最新状态</button>
    </div>
  `;
  container.appendChild(header);

  const layout = document.createElement("div");
  layout.className = "grid grid-2";
  layout.style.alignItems = "start";

  const listCard = document.createElement("section");
  listCard.className = "card";
  listCard.innerHTML = `
    <h3 class="section-title">投递列表</h3>
    <table class="table table--striped">
      <thead>
        <tr>
          <th>岗位名称</th>
          <th>企业</th>
          <th>投递时间</th>
          <th>当前状态</th>
        </tr>
      </thead>
      <tbody></tbody>
    </table>
  `;

  const tbody = listCard.querySelector("tbody");
  const detailCard = document.createElement("section");
  detailCard.className = "card";
  layout.appendChild(listCard);
  layout.appendChild(detailCard);
  container.appendChild(layout);

  let activeId = applications[0]?.id || null;

  function renderTable() {
    tbody.innerHTML = "";
    applications.forEach((item) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${item.jobTitle}</td>
        <td>${item.company}</td>
        <td>${item.submitDate}</td>
        <td><span class="badge ${item.status.includes("邀约") ? "badge--success" : ""}">${item.status}</span></td>
      `;
      tr.style.cursor = "pointer";
      if (item.id === activeId) {
        tr.style.background = "#edf3ff";
      }
      tr.addEventListener("click", () => {
        activeId = item.id;
        renderTable();
        renderDetail();
      });
      tbody.appendChild(tr);
    });

    if (!applications.length) {
      const empty = document.createElement("tr");
      empty.innerHTML = `<td colspan="4" style="text-align:center; padding:24px; color: var(--text-light);">暂无投递记录</td>`;
      tbody.appendChild(empty);
    }
  }

  function renderDetail() {
    const current = applications.find((item) => item.id === activeId);
    if (!current) {
      detailCard.innerHTML = `<div class="empty-state">请选择投递记录</div>`;
      return;
    }

    detailCard.innerHTML = `
      <div class="page-header" style="margin-bottom:16px;">
        <div>
          <h3 class="section-title" style="margin-bottom:4px;">${current.jobTitle}</h3>
          <div style="color: var(--text-light); font-size: 13px;">${current.company} · 投递于 ${current.submitDate}</div>
        </div>
        <span class="badge badge--success">${current.status}</span>
      </div>
      <div>
        <h4 style="font-size:15px; font-weight:600; margin-bottom:10px;">状态时间线</h4>
        <div class="timeline">
          ${current.progress
            .map(
              (step) => `
                <div class="timeline-item">
                  <div class="timeline-item__time">${step.time}</div>
                  <div class="timeline-item__content">
                    <div style="font-weight:500; margin-bottom:4px;">${step.label}</div>
                    <div style="color: var(--text-light); font-size:12px;">${step.remark}</div>
                  </div>
                </div>
              `
            )
            .join("")}
        </div>
      </div>
      <div style="margin-top:18px;">
        <div class="page-header" style="margin-bottom:12px;">
          <h4 style="font-size:15px; font-weight:600; margin-bottom:0;">沟通消息</h4>
          <div class="table-actions">
            <button class="button button--ghost button--sm" data-action="append-msg">补充消息</button>
          </div>
        </div>
        ${current.messages.length
          ? current.messages
              .map(
                (msg) => `
                  <div class="message-card">
                    <div style="font-weight:500; margin-bottom:6px;">${msg.sender}</div>
                    <div style="color:#3a4f72;">${msg.content}</div>
                  </div>
                `
              )
              .join("")
          : '<div class="empty-state" style="height:120px;">暂无消息</div>'}
      </div>
      <div style="margin-top:18px;">
        <div class="page-header" style="margin-bottom:12px;">
          <h4 style="font-size:15px; font-weight:600; margin-bottom:0;">附件补充</h4>
          <div class="table-actions">
            <button class="button button--ghost button--sm" data-action="append-attachment">上传附件</button>
          </div>
        </div>
        ${current.attachments.length
          ? `<div class="attachment-list">${current.attachments
              .map((file) => `<div class="attachment-item"><span>${file.name}</span><span>${file.size || ""}</span></div>`)
              .join("")}</div>`
          : '<div class="empty-state" style="height:120px;">暂无附件</div>'}
      </div>
    `;

    detailCard.onclick = (event) => {
      const target = event.target;
      if (!(target instanceof HTMLElement)) return;
      const action = target.dataset.action;
      if (!action) return;
      event.stopPropagation();
      if (action === "append-msg") {
        const value = prompt("请输入要补充的沟通信息：");
        actions.appendApplicationMessage(current.id, value);
        if (value) toaster.show("消息已补充", { type: "success" });
      }
      if (action === "append-attachment") {
        const value = prompt("请输入附件名称，例如：最新简历.pdf");
        actions.addApplicationAttachment(current.id, value);
        if (value) toaster.show("附件已更新", { type: "success" });
      }
    };
  }

  header.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;
    if (target.dataset.action === "export") {
      toaster.show("已生成投递记录导出任务", { type: "info" });
    }
    if (target.dataset.action === "refresh") {
      toaster.show("状态已同步，如有更新将展示在时间线", { type: "success" });
    }
  });

  renderTable();
  renderDetail();

  return container;
}
