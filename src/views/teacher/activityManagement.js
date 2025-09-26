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
      <h2 class="section-title" style="margin-bottom:6px;">Activity Management & Review</h2>
      <p style="color: var(--text-light); font-size: 13px;">Create events, review enterprise signups, export lists, and generate check-in QR codes.</p>
    </div>
    <button class="button" data-action="toggle-form">Create activity</button>
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
    <h3 class="section-title">Enterprise signup review</h3>
    <div class="list">
      ${approvals
        .map(
          (item) => `
            <div class="data-row" data-id="${item.id}">
              <div>
                <div style="font-weight:600; margin-bottom:4px;">${item.company}</div>
                <div style="color: var(--text-light); font-size: 12px;">Request ${item.type} · Submitted on ${item.requestAt}</div>
              </div>
              <div class="table-actions">
                <button class="button button--ghost button--sm" data-action="reject">Reject</button>
                <button class="button button--sm" data-action="approve">Approve</button>
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
    <h3 class="section-title">Export signup list</h3>
    <div class="data-list">
      ${exportsList
        .map(
          (item) => `
            <div class="data-row">
              <span>${item.label}</span>
              <button class="button button--ghost button--sm" data-file="${item.fileName}">Export</button>
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
    <h3 class="section-title">Check-in QR code</h3>
    <div style="display:flex; align-items:center; gap:18px;">
      <div style="width:140px; height:140px; border-radius:16px; background:#f4f7ff; display:flex; align-items:center; justify-content:center; color: var(--text-light); font-size:13px;">${checkin.qrPlaceholder}</div>
      <div>
        <div style="font-weight:600; margin-bottom:8px;">${checkin.qrHint}</div>
        <p style="color:#3a4f72; font-size:13px;">Generate a QR code for onsite check-in; download or refresh as needed.</p>
        <div class="table-actions" style="margin-top:12px;">
          <button class="button button--outline button--sm">Download QR</button>
          <button class="button button--ghost button--sm">Refresh</button>
        </div>
      </div>
    </div>
  `;
  rightColumn.appendChild(qrCard);

  function renderActivityCard() {
    activityCard.innerHTML = `
      <h3 class="section-title">Activity list</h3>
      <table class="table table--striped">
        <thead>
          <tr>
            <th>Activity</th>
            <th>Date</th>
            <th>Location</th>
            <th>Capacity</th>
            <th>Registrations</th>
            <th>Status</th>
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
          title: data.get("title") || "Untitled Activity",
          date: data.get("date") || "TBD",
          location: data.get("location") || "TBD",
          capacity: Number(data.get("capacity")) || 0
        });
        isCreating = false;
        toaster.show("Activity draft created", { type: "success" });
        renderActivityCard();
      });
    }
  }

  function renderForm() {
    return `
      <form style="margin-top:24px; display:grid; gap:16px;">
        <div class="form-grid">
          <label style="display:flex; flex-direction:column; gap:6px; font-size:12px; color: var(--text-light);">
            Activity title
            <input class="input" name="title" required />
          </label>
          <label style="display:flex; flex-direction:column; gap:6px; font-size:12px; color: var(--text-light);">
            Date & time
            <input class="input" type="datetime-local" name="date" />
          </label>
          <label style="display:flex; flex-direction:column; gap:6px; font-size:12px; color: var(--text-light);">
            Location
            <input class="input" name="location" />
          </label>
          <label style="display:flex; flex-direction:column; gap:6px; font-size:12px; color: var(--text-light);">
            Capacity limit
            <input class="input" type="number" name="capacity" />
          </label>
        </div>
        <label style="display:flex; flex-direction:column; gap:6px; font-size:12px; color: var(--text-light);">
          Description
          <textarea class="input" name="desc" placeholder="Share highlights, requirements, etc."></textarea>
        </label>
        <div class="form-actions" style="justify-content:flex-end;">
          <button class="button button--ghost" type="button" data-role="cancel">Cancel</button>
          <button class="button" type="submit">Save</button>
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
      actions.updateTeacherApproval(id, "Approved");
      toaster.show("Signup approved", { type: "success" });
    }
    if (action === "reject") {
      actions.updateTeacherApproval(id, "Rejected");
      toaster.show("Signup rejected", { type: "warn" });
    }
  });

  exportCard.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;
    const file = target.dataset.file;
    if (file) {
      toaster.show(`Exported ${file}`, { type: "success" });
    }
  });

  renderActivityCard();

  return container;
}
