export function renderHrCampusEvents({ state, actions, toaster }) {
  const { calendar, rules, registrationForm } = state.hr.campusEvents;

  const container = document.createElement("div");
  const header = document.createElement("div");
  header.className = "page-header";
  header.innerHTML = `
    <div>
      <h2 class="section-title" style="margin-bottom:6px;">Campus recruiting panel</h2>
      <p style="color: var(--text-light); font-size: 13px;">Review the event calendar, participation rules, and enterprise registration form.</p>
    </div>
    <div class="table-actions">
      <button class="button button--outline" data-action="download">Download calendar</button>
      <button class="button" data-action="submit">Submit registration</button>
    </div>
  `;
  container.appendChild(header);

  const grid = document.createElement("div");
  grid.className = "grid grid-2";
  container.appendChild(grid);

  const calendarCard = document.createElement("section");
  calendarCard.className = "card";
  calendarCard.innerHTML = `
    <h3 class="section-title">Event calendar</h3>
    <div class="calendar-grid">
      ${calendar
        .map(
          (item) => `
            <div class="calendar-item">
              <div style="font-weight:600;">${item.date}</div>
              <div style="margin:6px 0;">${item.title}</div>
              <span class="badge ${item.status === "Registered" ? "badge--success" : ""}">${item.status}</span>
            </div>
          `
        )
        .join("")}
    </div>
  `;
  grid.appendChild(calendarCard);

  const ruleCard = document.createElement("section");
  ruleCard.className = "card";
  ruleCard.innerHTML = `
    <h3 class="section-title">Participation rules</h3>
    <ul style="display:grid; gap:12px; color:#3a4f72;">
      ${rules.map((rule) => `<li>• ${rule}</li>`).join("")}
    </ul>
  `;
  grid.appendChild(ruleCard);

  const formCard = document.createElement("section");
  formCard.className = "card";
  formCard.innerHTML = `
    <div class="page-header" style="margin-bottom:16px;">
      <h3 class="section-title" style="margin-bottom:0;">Enterprise registration form</h3>
      <span class="badge">Status: ${registrationForm.status}</span>
    </div>
    <div class="form-grid">
      ${Object.entries(registrationForm)
        .filter(([key]) => key !== "status")
        .map(
          ([key, value]) => `
            <label style="display:flex; flex-direction:column; gap:6px; font-size:12px; color: var(--text-light);">
              ${labelMap[key] || key}
              <input class="input" name="${key}" value="${value}" />
            </label>
          `
        )
        .join("")}
    </div>
    <label style="display:flex; flex-direction:column; gap:6px; font-size:12px; color: var(--text-light); margin-top:16px;">
      Notes
      <textarea class="input" name="remark">${registrationForm.remark || ""}</textarea>
    </label>
    <div class="form-actions">
      <button class="button button--outline" data-action="save">Save draft</button>
      <button class="button" data-action="submit">Submit for review</button>
    </div>
  `;
  container.appendChild(formCard);

  formCard.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;
    const action = target.dataset.action;
    if (!action) return;

    const inputs = formCard.querySelectorAll("input, textarea");
    const payload = {};
    inputs.forEach((input) => {
      payload[input.name] = input.value;
    });

    actions.updateCampusRegistration(payload);
    if (action === "save") {
      toaster.show("Registration draft saved", { type: "success" });
    }
    if (action === "save") {
      actions.updateCampusRegistration(payload);
      toaster.show("Registration draft saved", { type: "success" });
    }
    if (action === "submit") {
      actions.submitCampusRegistration(payload);
      toaster.show("Registration submitted for review", { type: "success" });
    }
  });

  header.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;
    if (target.dataset.action === "download") {
      toaster.show("Event calendar downloaded", { type: "success" });
    }
    if (target.dataset.action === "submit") {
      toaster.show("Registration request sent", { type: "info" });
    }
  });

  return container;
}

const labelMap = {
  company: "Company",
  contact: "Contact",
  phone: "Phone",
  boothType: "Booth type",
  participants: "Participants"
};
