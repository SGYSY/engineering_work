export function renderAdminTeacherPanel({ state, navigate, toaster }) {
  const teacher = state.teacher;
  const container = document.createElement("div");
  const header = document.createElement("div");
  header.className = "page-header";
  header.innerHTML = `
    <div>
      <h2 class="section-title" style="margin-bottom:6px;">Teacher Portal Management</h2>
      <p style="color: var(--text-light); font-size: 13px;">Review teacher-side metrics and jump directly into the portal for configuration.</p>
    </div>
    <div class="table-actions">
      <button class="button button--outline" data-action="open">Open teacher portal</button>
      <button class="button" data-action="assign">Assign teacher account</button>
    </div>
  `;
  container.appendChild(header);

  const grid = document.createElement("div");
  grid.className = "grid grid-2";
  container.appendChild(grid);

  const activityCard = document.createElement("section");
  activityCard.className = "card";
  activityCard.innerHTML = `
    <h3 class="section-title">Activity overview</h3>
    <table class="table table--striped">
      <thead>
        <tr>
          <th>Activity</th>
          <th>Date</th>
          <th>Capacity</th>
          <th>Registrations</th>
          <th>Status</th>
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
    <h3 class="section-title">Pending reviews</h3>
    <div class="list">
      ${teacher.approvals
        .map(
          (item) => `
            <div class="data-row">
              <div>
                <div style="font-weight:600;">${item.company}</div>
                <div style="color: var(--text-light); font-size:12px;">${item.type} · Submitted on ${item.requestAt}</div>
              </div>
              <div class="table-actions">
                <button class="button button--ghost button--sm" data-action="remind" data-company="${item.company}">Remind teacher</button>
              </div>
            </div>
          `
        )
        .join("")}
    </div>
    <div style="margin-top:16px;">
      <div style="font-weight:600; margin-bottom:6px;">Check-in QR code</div>
      <div style="display:flex; gap:12px; align-items:center;">
        <div style="width:96px; height:96px; border-radius:12px; background:#f4f7ff; display:flex; align-items:center; justify-content:center; color: var(--text-light); font-size:12px;">${teacher.checkin.qrPlaceholder}</div>
        <button class="button button--outline button--sm" data-action="download">Download</button>
      </div>
    </div>
  `;
  grid.appendChild(checklistCard);

  header.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;
    const action = target.dataset.action;
    if (action === "open") {
      navigate("teacher", "activity-review");
      toaster.show("Opened teacher activity management", { type: "info" });
    }
    if (action === "assign") {
      toaster.show("Teacher account assignment wizard launched (mock)", { type: "info" });
    }
  });

  checklistCard.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;
    const action = target.dataset.action;
    if (action === "remind") {
      const company = target.dataset.company || "Teacher";
      toaster.show(`Reminder sent to ${company} reviewer`, { type: "info" });
    }
    if (action === "download") {
      toaster.show("Check-in QR downloaded (mock)", { type: "success" });
    }
  });

  return container;
}
