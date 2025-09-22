export function renderStudentResume({ state, actions, toaster }) {
  const resume = state.student.resume;

  const container = document.createElement("div");

  const header = document.createElement("div");
  header.className = "page-header";
  header.innerHTML = `
    <div>
      <h2 class="section-title" style="margin-bottom:6px;">简历中心</h2>
      <p style="color: var(--text-light); font-size: 13px;">在线编辑简历信息，实时计算完整度并支持附件管理、PDF 导出。</p>
    </div>
    <div class="table-actions">
      <button class="button button--outline" data-action="preview">预览PDF</button>
      <button class="button" data-action="export">导出简历</button>
    </div>
  `;
  container.appendChild(header);

  const summaryCard = document.createElement("section");
  summaryCard.className = "card";
  summaryCard.innerHTML = `
    <div style="display:flex; gap:32px; align-items:center;">
      <div class="progress-ring" style="--progress:${resume.completeness};">
        <div class="progress-ring__label">${resume.completeness}%</div>
      </div>
      <div style="flex:1;">
        <div style="font-weight:600; margin-bottom:10px;">完善建议</div>
        <ul style="color:#3a4f72; display:grid; gap:8px; font-size:13px;">
          <li>• 补充关键项目细节，提高匹配度。</li>
          <li>• 上传近期作品集或证书，增加亮点。</li>
          <li>• 定期更新联系方式，保持畅通。</li>
        </ul>
      </div>
      <div style="min-width:240px;">
        <div style="font-weight:600; margin-bottom:12px;">附件资料</div>
        <div class="attachment-list">
          ${resume.attachments
            .map(
              (item) => `<div class="attachment-item" data-id="${item.id}"><span>${item.name}</span><button class="button button--ghost button--sm" data-action="remove-att" data-id="${item.id}">移除</button></div>`
            )
            .join("")}
        </div>
        <button class="button button--ghost" style="margin-top:12px; width:100%;" data-action="add-att">上传附件</button>
      </div>
    </div>
  `;
  container.appendChild(summaryCard);

  resume.steps.forEach((step) => {
    const card = document.createElement("section");
    card.className = "card";
    card.dataset.step = step.id;
    card.innerHTML = `
      <div class="page-header" style="margin-bottom:16px;">
        <h3 class="section-title" style="margin-bottom:0;">${step.title}</h3>
        <div class="table-actions">
          <button class="button button--ghost button--sm" data-action="edit">编辑</button>
          <button class="button button--outline button--sm" data-action="save">保存</button>
        </div>
      </div>
      <div class="form-grid">
        ${step.fields
          .map(
            (field) => `
              <label style="display:flex; flex-direction:column; gap:6px; font-size:12px; color: var(--text-light);">
                ${field.label}
                <input class="input" data-step="${step.id}" data-field="${field.id}" value="${field.value}" disabled />
              </label>
            `
          )
          .join("")}
      </div>
    `;
    container.appendChild(card);
  });

  summaryCard.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;
    const action = target.dataset.action;
    if (action === "add-att") {
      const value = prompt("请输入附件名称，例如：作品集.pdf");
      actions.addResumeAttachment(value);
      if (value) toaster.show("附件上传完成", { type: "success" });
    }
    if (action === "remove-att") {
      const id = target.dataset.id;
      actions.removeResumeAttachment(id);
      toaster.show("附件已移除", { type: "warn" });
    }
  });

  container.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;
    const action = target.dataset.action;
    if (!action) return;

    if (action === "preview") {
      toaster.show("已生成在线预览（模拟）", { type: "info" });
    }
    if (action === "export") {
      toaster.show("简历导出任务已创建", { type: "success" });
    }
    if (action === "edit") {
      const card = target.closest("section[data-step]");
      if (!card) return;
      card.querySelectorAll("input").forEach((input) => {
        input.removeAttribute("disabled");
        input.focus();
      });
    }
    if (action === "save") {
      const card = target.closest("section[data-step]");
      if (!card) return;
      const inputs = card.querySelectorAll("input");
      inputs.forEach((input) => {
        const stepId = input.dataset.step;
        const fieldId = input.dataset.field;
        actions.updateResumeField(stepId, fieldId, input.value);
        input.setAttribute("disabled", "true");
      });
      toaster.show("简历已保存，并更新完整度", { type: "success" });
    }
  });

  return container;
}
