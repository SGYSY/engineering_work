export function renderTeacherEnterpriseAudit({ state, actions, toaster }) {
  const enterprises = state.teacher.enterpriseAudit;

  const container = document.createElement("div");
  const header = document.createElement("div");
  header.className = "page-header";
  header.innerHTML = `
    <div>
      <h2 class="section-title" style="margin-bottom:6px;">Enterprise Admission Review</h2>
      <p style="color: var(--text-light); font-size: 13px;">Evaluate enterprise credentials, review history, and manage blacklist or whitelist tags.</p>
    </div>
    <div class="table-actions">
      <button class="button button--outline" data-action="export">Export review logs</button>
      <button class="button" data-action="bulk">Bulk approve</button>
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
            <div style="color: var(--text-light); font-size:12px;">Submitted on ${company.submitAt}</div>
          </div>
          <div class="table-actions">
            <button class="button button--ghost button--sm" data-action="mark">${company.blacklist ? "Remove from blacklist" : "Add to blacklist"}</button>
            <button class="button button--outline button--sm" data-action="reject">Reject</button>
            <button class="button button--sm" data-action="approve">Approve</button>
          </div>
        </div>
        <div style="display:flex; gap:24px; flex-wrap:wrap;">
          <div style="flex:1; min-width:240px;">
            <div style="font-weight:600; margin-bottom:8px;">Submitted materials</div>
            <ul style="color:#3a4f72; display:grid; gap:6px;">
              ${company.materials.map((file) => `<li>• ${file}</li>`).join("")}
            </ul>
          </div>
          <div style="flex:1; min-width:220px;">
            <div style="font-weight:600; margin-bottom:8px;">History</div>
            <ul style="color:#3a4f72; display:grid; gap:6px;">
              ${company.history.map((record) => `<li>${record.date} · ${record.result}</li>`).join("")}
            </ul>
          </div>
          <div style="min-width:160px;">
            <div style="font-weight:600; margin-bottom:8px;">List tag</div>
            <span class="badge ${company.blacklist ? "" : "badge--success"}">${company.blacklist ? "Blacklist" : "Whitelist"}</span>
            <div style="color: var(--text-light); font-size:12px; margin-top:10px;">Status: ${company.status}</div>
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
      actions.updateEnterpriseStatus(id, "Approved");
      toaster.show("Enterprise review approved", { type: "success" });
    }
    if (action === "reject") {
      actions.updateEnterpriseStatus(id, "Rejected");
      toaster.show("Enterprise review rejected", { type: "warn" });
    }
    if (action === "mark") {
      actions.toggleEnterpriseBlacklist(id);
      toaster.show("List mark updated", { type: "info" });
    }
  });

  header.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;
    if (target.dataset.action === "export") {
      toaster.show("Review logs exported", { type: "success" });
    }
    if (target.dataset.action === "bulk") {
      toaster.show("Bulk approval task created", { type: "info" });
    }
  });

  renderList();
  return container;
}
