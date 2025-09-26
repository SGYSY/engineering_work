export function renderStudentResume({ state, actions, toaster }) {
  const resume = state.student.resume;

  const container = document.createElement("div");

  const header = document.createElement("div");
  header.className = "page-header";
  header.innerHTML = `
    <div>
      <h2 class="section-title" style="margin-bottom:6px;">Resume center</h2>
      <p style="color: var(--text-light); font-size: 13px;">Edit resume details, monitor completeness, and manage attachments or PDF exports.</p>
    </div>
    <div class="table-actions">
      <button class="button button--outline" data-action="preview">Preview PDF</button>
      <button class="button" data-action="export">Export resume</button>
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
        <div style="font-weight:600; margin-bottom:10px;">Improvement tips</div>
        <ul style="color:#3a4f72; display:grid; gap:8px; font-size:13px;">
          <li>• Enrich project details to improve matching.</li>
          <li>• Upload recent portfolios or certificates to stand out.</li>
          <li>• Keep contact information current.</li>
        </ul>
      </div>
      <div style="min-width:240px;">
        <div style="font-weight:600; margin-bottom:12px;">Attachments</div>
        <div class="attachment-list">
          ${resume.attachments
            .map(
              (item) => `<div class="attachment-item" data-id="${item.id}"><span>${item.name}</span><button class="button button--ghost button--sm" data-action="remove-att" data-id="${item.id}">Remove</button></div>`
            )
            .join("")}
        </div>
        <button class="button button--ghost" style="margin-top:12px; width:100%;" data-action="add-att">Add attachment</button>
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
          <button class="button button--ghost button--sm" data-action="edit">Edit</button>
          <button class="button button--outline button--sm" data-action="save">Save</button>
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
      const value = prompt("Enter attachment name, e.g., Portfolio.pdf");
      actions.addResumeAttachment(value);
      if (value) toaster.show("Attachment uploaded", { type: "success" });
    }
    if (action === "remove-att") {
      const id = target.dataset.id;
      actions.removeResumeAttachment(id);
      toaster.show("Attachment removed", { type: "warn" });
    }
  });

  container.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;
    const action = target.dataset.action;
    if (!action) return;

    if (action === "preview") {
      toaster.show("Preview generated (mock)", { type: "info" });
    }
    if (action === "export") {
      toaster.show("Resume export task created", { type: "success" });
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
      toaster.show("Resume saved and completeness updated", { type: "success" });
    }
  });

  return container;
}
