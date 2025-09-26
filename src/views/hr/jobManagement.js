export function renderHrJobManagement({ state, actions, toaster }) {
  const jobs = state.hr.jobs;
  const selected = new Set();

  const container = document.createElement("div");
  const header = document.createElement("div");
  header.className = "page-header";
  header.innerHTML = `
    <div>
      <h2 class="section-title" style="margin-bottom:6px;">Job publishing & management</h2>
      <p style="color: var(--text-light); font-size: 13px;">Monitor performance, publish or unpublish roles, duplicate postings, and run bulk actions.</p>
    </div>
    <div class="table-actions">
      <button class="button button--outline" data-action="create">Create job</button>
      <button class="button" data-action="sync">Sync to campus platform</button>
    </div>
  `;
  container.appendChild(header);

  const toolbar = document.createElement("div");
  toolbar.className = "filter-bar";
  toolbar.innerHTML = `
    <button class="button button--ghost" data-action="bulk-online">Publish selected</button>
    <button class="button button--ghost" data-action="bulk-offline">Unpublish selected</button>
    <button class="button button--ghost" data-action="bulk-copy">Duplicate selected</button>
    <span style="color: var(--text-light); font-size: 12px;">Selected <strong id="selected-count">0</strong> jobs</span>
  `;
  container.appendChild(toolbar);

  const tableCard = document.createElement("section");
  tableCard.className = "card";
  tableCard.innerHTML = `
    <table class="table table--striped">
      <thead>
        <tr>
          <th style="width:40px;"><input type="checkbox" data-role="select-all" /></th>
          <th>Job title</th>
          <th>Type</th>
          <th>Status</th>
          <th>Exposure</th>
          <th>Views</th>
          <th>Applicants</th>
          <th>Published at</th>
          <th style="width:200px;">Actions</th>
        </tr>
      </thead>
      <tbody></tbody>
    </table>
  `;
  container.appendChild(tableCard);

  const tbody = tableCard.querySelector("tbody");
  const selectAll = tableCard.querySelector("[data-role='select-all']");
  const selectedCount = toolbar.querySelector("#selected-count");

  function renderTable() {
    tbody.innerHTML = "";
    jobs.forEach((job) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td><input type="checkbox" data-id="${job.id}" ${selected.has(job.id) ? "checked" : ""} /></td>
        <td contenteditable="true" data-id="${job.id}" data-field="title">${job.title}</td>
        <td>${job.type}</td>
        <td><span class="badge ${job.status === "Published" ? "badge--success" : "badge--ghost"}">${job.status}</span></td>
        <td>${job.exposure}</td>
        <td>${job.views}</td>
        <td>${job.applicants}</td>
        <td>${job.publishDate}</td>
        <td>
          <div class="table-actions">
            <button data-action="toggle" data-id="${job.id}">${job.status === "Published" ? "Unpublish" : "Publish"}</button>
            <button data-action="duplicate" data-id="${job.id}">Duplicate</button>
            <button data-action="boost" data-id="${job.id}">Boost metrics</button>
          </div>
        </td>
      `;
      tbody.appendChild(tr);
    });
  }

  function updateSelectedCount() {
    selectedCount.textContent = selected.size;
    selectAll.checked = selected.size && selected.size === jobs.length;
  }

  tbody.addEventListener("change", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLInputElement)) return;
    const id = target.dataset.id;
    if (!id) return;
    if (target.checked) {
      selected.add(id);
    } else {
      selected.delete(id);
    }
    updateSelectedCount();
  });

  selectAll.addEventListener("change", () => {
    if (selectAll.checked) {
      jobs.forEach((job) => selected.add(job.id));
    } else {
      selected.clear();
    }
    renderTable();
    updateSelectedCount();
  });

  tbody.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;
    const action = target.dataset.action;
    const id = target.dataset.id;
    if (!action || !id) return;

    if (action === "toggle") {
      const job = jobs.find((item) => item.id === id);
      const nextStatus = job?.status === "Published" ? "Pending" : "Published";
      actions.updateJob(id, { status: nextStatus });
      toaster.show(`Job status updated to ${nextStatus}`, { type: "success" });
    }
    if (action === "duplicate") {
      actions.duplicateJob(id);
      toaster.show("Job duplicated with status Pending", { type: "info" });
    }
    if (action === "boost") {
      actions.updateJob(id, {
        exposure: (jobs.find((item) => item.id === id)?.exposure || 0) + 200,
        views: (jobs.find((item) => item.id === id)?.views || 0) + 60
      });
      toaster.show("Exposure and views boosted (simulated)", { type: "success" });
    }
  });

  tbody.addEventListener("blur", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;
    const field = target.dataset.field;
    const id = target.dataset.id;
    if (!field || !id) return;
    actions.updateJob(id, { [field]: target.textContent.trim() });
    toaster.show("Job title saved", { type: "success" });
  }, true);

  toolbar.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;
    const action = target.dataset.action;
    if (!action) return;

    if (!selected.size) {
      toaster.show("Select at least one job first", { type: "warn" });
      return;
    }

    if (action === "bulk-online") {
      selected.forEach((id) => actions.updateJob(id, { status: "Published" }));
      toaster.show("Selected jobs published", { type: "success" });
    }
    if (action === "bulk-offline") {
      selected.forEach((id) => actions.updateJob(id, { status: "Pending" }));
      toaster.show("Selected jobs unpublished", { type: "info" });
    }
    if (action === "bulk-copy") {
      selected.forEach((id) => actions.duplicateJob(id, "Bulk copy"));
      toaster.show("Job copies created", { type: "success" });
    }
    selected.clear();
    updateSelectedCount();
  });

  header.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;
    const action = target.dataset.action;
    if (action === "create") {
      const title = prompt("Enter job title:");
      if (!title) return;
      actions.createJob({ title, type: "Campus hiring", status: "Pending" });
      toaster.show("Job draft created", { type: "success" });
    }
    if (action === "sync") {
      toaster.show("Sync task submitted; allow 10 minutes to complete", { type: "info" });
    }
  });

  renderTable();
  updateSelectedCount();
  return container;
}
