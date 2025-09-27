export function renderHrJobManagement({ state, actions, toaster }) {
  let jobs = state.hr.jobs;
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
    <button class="button button--ghost" data-action="bulk-delete">Delete selected</button>
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
          <th>City</th>
          <th>Salary</th>
          <th>Deadline</th>
          <th>Status</th>
          <th>Exposure</th>
          <th>Views</th>
          <th>Applicants</th>
          <th>Published at</th>
          <th style="width:240px;">Actions</th>
        </tr>
      </thead>
      <tbody></tbody>
    </table>
  `;
  container.appendChild(tableCard);

  const tbody = tableCard.querySelector("tbody");
  const selectAll = tableCard.querySelector("[data-role='select-all']");
  const selectedCount = toolbar.querySelector("#selected-count");

  function getJobs() {
    const latestState = window.__careerStore?.getState?.();
    if (latestState?.hr?.jobs) {
      jobs = latestState.hr.jobs;
    }
    return jobs;
  }

  function renderTable() {
    tbody.innerHTML = "";
    const jobList = getJobs();
    jobList.forEach((job) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td><input type="checkbox" data-id="${job.id}" ${selected.has(job.id) ? "checked" : ""} /></td>
        <td contenteditable="true" data-id="${job.id}" data-field="title">${job.title}</td>
        <td contenteditable="true" data-id="${job.id}" data-field="type">${job.type}</td>
        <td contenteditable="true" data-id="${job.id}" data-field="city">${job.city || ""}</td>
        <td contenteditable="true" data-id="${job.id}" data-field="salary">${job.salary || ""}</td>
        <td contenteditable="true" data-id="${job.id}" data-field="deadline">${job.deadline || ""}</td>
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
            <button data-action="details" data-id="${job.id}">Edit details</button>
            <button data-action="delete" data-id="${job.id}">Delete</button>
          </div>
        </td>
      `;
      tbody.appendChild(tr);
    });
  }

  function updateSelectedCount() {
    selectedCount.textContent = selected.size;
    selectAll.checked = selected.size && selected.size === getJobs().length;
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
      getJobs().forEach((job) => selected.add(job.id));
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
      const job = getJobs().find((item) => item.id === id);
      const nextStatus = job?.status === "Published" ? "Pending" : "Published";
      actions.updateJob(id, { status: nextStatus });
      toaster.show(`Job status updated to ${nextStatus}`, { type: "success" });
      renderTable();
    }
    if (action === "duplicate") {
      actions.duplicateJob(id);
      toaster.show("Job duplicated with status Pending", { type: "info" });
      renderTable();
    }
    if (action === "boost") {
      actions.updateJob(id, {
        exposure: (getJobs().find((item) => item.id === id)?.exposure || 0) + 200,
        views: (getJobs().find((item) => item.id === id)?.views || 0) + 60
      });
      toaster.show("Exposure and views boosted (simulated)", { type: "success" });
      renderTable();
    }
    if (action === "details") {
      const job = getJobs().find((item) => item.id === id);
      if (!job) return;
      const description = prompt("Update job description", job.description || "");
      if (description !== null) {
        actions.updateJob(id, { description: description.trim() });
        toaster.show("Job description saved", { type: "success" });
      }
    }
    if (action === "delete") {
      if (confirm("Delete this job posting?")) {
        actions.deleteJob(id);
        selected.delete(id);
        renderTable();
        updateSelectedCount();
        toaster.show("Job deleted", { type: "warn" });
      }
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
      renderTable();
    }
    if (action === "bulk-offline") {
      selected.forEach((id) => actions.updateJob(id, { status: "Pending" }));
      toaster.show("Selected jobs unpublished", { type: "info" });
      renderTable();
    }
    if (action === "bulk-copy") {
      selected.forEach((id) => actions.duplicateJob(id, "Bulk copy"));
      toaster.show("Job copies created", { type: "success" });
      renderTable();
    }
    if (action === "bulk-delete") {
      if (confirm(`Delete ${selected.size} job(s)?`)) {
        selected.forEach((id) => actions.deleteJob(id));
        selected.clear();
        renderTable();
        toaster.show("Selected jobs removed", { type: "warn" });
      }
      updateSelectedCount();
      return;
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
      const city = prompt("Which city is the role located in?", "");
      const salary = prompt("Salary range", "Negotiable");
      const deadline = prompt("Application deadline (YYYY-MM-DD)", "");
      actions.createJob({
        title,
        type: "Campus hiring",
        status: "Pending",
        city: city || "",
        salary: salary || "Negotiable",
        deadline: deadline || ""
      });
      toaster.show("Job draft created", { type: "success" });
      renderTable();
    }
    if (action === "sync") {
      toaster.show("Sync task submitted; allow 10 minutes to complete", { type: "info" });
    }
  });

  renderTable();
  updateSelectedCount();
  return container;
}
