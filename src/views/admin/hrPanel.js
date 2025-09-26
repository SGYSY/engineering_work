export function renderAdminHrPanel({ state, navigate, toaster }) {
  const hr = state.hr;
  const container = document.createElement("div");
  const header = document.createElement("div");
  header.className = "page-header";
  header.innerHTML = `
    <div>
      <h2 class="section-title" style="margin-bottom:6px;">HR Portal Management</h2>
      <p style="color: var(--text-light); font-size: 13px;">Track job postings, candidate pipelines, and campus recruiting progress.</p>
    </div>
    <div class="table-actions">
      <button class="button button--outline" data-action="open">Open HR portal</button>
      <button class="button" data-action="sync">Sync enterprise access</button>
    </div>
  `;
  container.appendChild(header);

  const grid = document.createElement("div");
  grid.className = "grid grid-3";
  container.appendChild(grid);

  const jobCard = document.createElement("section");
  jobCard.className = "card";
  jobCard.innerHTML = `
    <h3 class="section-title">Job overview</h3>
    <div class="data-list">
      ${hr.jobs
        .map(
          (job) => `
            <div class="data-row">
              <div>
                <div style="font-weight:600;">${job.title}</div>
                <div style="color: var(--text-light); font-size:12px;">Exposure ${job.exposure} · Views ${job.views} · Applicants ${job.applicants}</div>
              </div>
              <span class="badge ${job.status === "Published" ? "badge--success" : "badge--ghost"}">${job.status}</span>
            </div>
          `
        )
        .join("")}
    </div>
  `;
  grid.appendChild(jobCard);

  const candidateCard = document.createElement("section");
  candidateCard.className = "card";
  candidateCard.innerHTML = `
    <h3 class="section-title">Candidate status</h3>
    <div class="data-list">
      ${hr.candidates.list
        .map(
          (cand) => `
            <div class="data-row">
              <div>
                <div style="font-weight:600;">${cand.name}</div>
                <div style="color: var(--text-light); font-size:12px;">${cand.job} · Updated ${cand.updatedAt}</div>
              </div>
              <span class="badge">${getStageLabel(cand.stage, hr.candidates.stages)}</span>
            </div>
          `
        )
        .join("")}
    </div>
  `;
  grid.appendChild(candidateCard);

  const eventCard = document.createElement("section");
  eventCard.className = "card";
  eventCard.innerHTML = `
    <h3 class="section-title">Campus events</h3>
    <div class="data-list">
      ${hr.campusEvents.calendar
        .map(
          (event) => `
            <div class="data-row">
              <div>
                <div style="font-weight:600;">${event.title}</div>
                <div style="color: var(--text-light); font-size:12px;">${event.date}</div>
              </div>
              <span class="badge">${event.status}</span>
            </div>
          `
        )
        .join("")}
    </div>
    <button class="button button--ghost" style="margin-top:16px;" data-action="view-rules">View rules</button>
  `;
  grid.appendChild(eventCard);

  header.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;
    const action = target.dataset.action;
    if (action === "open") {
      navigate("hr", "job-management");
      toaster.show("Opened HR job management", { type: "info" });
    }
    if (action === "sync") {
      toaster.show("Enterprise access sync task dispatched (mock)", { type: "success" });
    }
  });

  eventCard.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;
    if (target.dataset.action === "view-rules") {
      const rulesMessage = hr.campusEvents.rules
        .map((rule, index) => `${index + 1}. ${rule}`)
        .join(" | ");
      toaster.show(`Campus event guidelines: ${rulesMessage}`, { type: "info", duration: 3600 });
    }
  });

  return container;
}

function getStageLabel(id, stages) {
  return stages.find((stage) => stage.id === id)?.label || id;
}
