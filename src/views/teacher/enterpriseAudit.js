export function renderTeacherEnterpriseAudit({ state, actions, toaster }) {
  const enterprises = state.teacher.enterpriseAudit;

  const container = document.createElement("div");
  const header = document.createElement("div");
  header.className = "page-header";
  header.innerHTML = `
    <div>
      <h2 class="section-title" style="margin-bottom:6px;">企业入校考核</h2>
      <p style="color: var(--text-light); font-size: 13px;">审核企业资质材料，查看历史记录与黑白名单标记。</p>
    </div>
    <div class="table-actions">
      <button class="button button--outline">导出审核记录</button>
      <button class="button">批量审批</button>
    </div>
  `;
  container.appendChild(header);

  const list = document.createElement("div");
  list.className = "list";
  container.appendChild(list);

  function renderList() {
    list.innerHTML = "";
    enterprises.forEach((company) => {
      const card = document.createElement("section");
      card.className = "card";
      card.dataset.id = company.id;
      card.innerHTML = `
        <div class="page-header" style="margin-bottom:12px;">
          <div>
            <h3 class="section-title" style="margin-bottom:4px;">${company.company}</h3>
            <div style="color: var(--text-light); font-size:12px;">提交于 ${company.submitAt}</div>
          </div>
          <div class="table-actions">
            <button class="button button--ghost button--sm" data-action="mark">${company.blacklist ? "移出黑名单" : "加入黑名单"}</button>
            <button class="button button--outline button--sm" data-action="reject">驳回</button>
            <button class="button button--sm" data-action="approve">通过</button>
          </div>
        </div>
        <div style="display:flex; gap:24px; flex-wrap:wrap;">
          <div style="flex:1; min-width:240px;">
            <div style="font-weight:600; margin-bottom:8px;">提交材料</div>
            <ul style="color:#3a4f72; display:grid; gap:6px;">
              ${company.materials.map((file) => `<li>• ${file}</li>`).join("")}
            </ul>
          </div>
          <div style="flex:1; min-width:220px;">
            <div style="font-weight:600; margin-bottom:8px;">历史记录</div>
            <ul style="color:#3a4f72; display:grid; gap:6px;">
              ${company.history.map((record) => `<li>${record.date} · ${record.result}</li>`).join("")}
            </ul>
          </div>
          <div style="min-width:160px;">
            <div style="font-weight:600; margin-bottom:8px;">名单标记</div>
            <span class="badge ${company.blacklist ? "" : "badge--success"}">${company.blacklist ? "黑名单" : "白名单"}</span>
            <div style="color: var(--text-light); font-size:12px; margin-top:10px;">审核状态：${company.status}</div>
          </div>
        </div>
      `;
      list.appendChild(card);
    });
  }

  list.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;
    const action = target.dataset.action;
    if (!action) return;
    const card = target.closest("section.card");
    if (!card) return;
    const id = card.dataset.id;

    if (action === "approve") {
      actions.updateEnterpriseStatus(id, "已通过");
      toaster.show("企业审核已通过", { type: "success" });
    }
    if (action === "reject") {
      actions.updateEnterpriseStatus(id, "驳回");
      toaster.show("企业审核已驳回", { type: "warn" });
    }
    if (action === "mark") {
      actions.toggleEnterpriseBlacklist(id);
      toaster.show("名单标记已更新", { type: "info" });
    }
  });

  header.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;
    if (target.textContent?.includes("导出")) {
      toaster.show("审核记录已导出", { type: "success" });
    }
    if (target.textContent?.includes("批量")) {
      toaster.show("批量审批任务已创建", { type: "info" });
    }
  });

  renderList();
  return container;
}
