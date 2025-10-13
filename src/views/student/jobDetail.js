import { t } from "../../utils/i18n.js";
export function renderStudentJobDetail({ state, actions, param, navigate, toaster }) {
  const job = state.student.jobs.find((item) => item.id === param) || state.student.jobs[0];

  const container = document.createElement("div");
  const backButton = document.createElement("button");
  backButton.className = "button button--ghost";
  backButton.textContent = t("Back to Job List");
  backButton.addEventListener("click", () => navigate("student", "job-list"));
  container.appendChild(backButton);

  if (!job) {
    const empty = document.createElement("div");
    empty.className = "empty-state";
    empty.style.marginTop = "24px";
    empty.textContent = t("Job not found or no longer available");
    container.appendChild(empty);
    return container;
  }

  const jobCard = document.createElement("section");
  jobCard.className = "card";
  jobCard.style.marginTop = "18px";
  jobCard.innerHTML = `
    <div style="display:flex; justify-content:space-between; align-items:flex-start; gap:18px;">
      <div>
        <h2 class="section-title" style="margin-bottom:6px;">${job.title}</h2>
        <div style="display:flex; gap:12px; flex-wrap:wrap; color: var(--text-light); font-size:13px;">
          <span>${job.company}</span>
          <span>${job.city}</span>
          <span>${t("Salary")}: ${job.salary}</span>
          <span>${t("Education Requirement")}: ${job.education} ${t("or above")}</span>
          <span>${t("Deadline")}: ${job.deadline}</span>
        </div>
      </div>
      <div style="display:flex; gap:12px;">
  <button class="button button--outline" data-action="favorite">${t(job.favorite ? "Favorited" : "Favorite")}</button>
  <button class="button" data-action="apply">${t("Apply Now")}</button>
      </div>
    </div>
    <div class="chips" style="margin-top:12px;">
      ${job.tags.map((tag) => `<span class="chip">${tag}</span>`).join("")}
    </div>
  `;
  container.appendChild(jobCard);

  const detailGrid = document.createElement("div");
  detailGrid.className = "grid grid-2";

  const descSection = document.createElement("section");
  descSection.className = "card";
  descSection.innerHTML = `
  <h3 class="section-title">${t("Job Description")}</h3>
    <p style="line-height:1.7; color:#3a4f72;">${job.description}</p>
  `;

  const reqSection = document.createElement("section");
  reqSection.className = "card";
  reqSection.innerHTML = `
  <h3 class="section-title">${t("Requirements")}</h3>
    <ul style="display:grid; gap:12px; color:#3a4f72;">
      ${job.requirements.map((item) => `<li>• ${item}</li>`).join("")}
    </ul>
  `;

  detailGrid.appendChild(descSection);
  detailGrid.appendChild(reqSection);
  container.appendChild(detailGrid);

  const timelineCard = document.createElement("section");
  timelineCard.className = "card";
  timelineCard.innerHTML = `
  <h3 class="section-title">${t("Application Process")}</h3>
    <div class="timeline">
      <div class="timeline-item">
        <div class="timeline-item__time">${job.publishDate}</div>
        <div class="timeline-item__content">
          <div style="font-weight:500;">${t("Job Posted")}</div>
          <div style="color: var(--text-light);">${t("Officially posted, applications open.")}</div>
        </div>
      </div>
      <div class="timeline-item">
        <div class="timeline-item__time">${job.deadline}</div>
        <div class="timeline-item__content">
          <div style="font-weight:500;">${t("Application Deadline")}</div>
          <div style="color: var(--text-light);">${t("Prepare interview materials early to avoid peak times.")}</div>
        </div>
      </div>
    </div>
  `;
  container.appendChild(timelineCard);

  jobCard.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;
    const action = target.dataset.action;
    if (!action) return;

    if (action === "favorite") {
      actions.toggleJobFavorite(job.id);
  toaster.show(t("Favorite status updated"), { type: "info" });
    }
    if (action === "apply") {
      actions.applyForJob(job.id);
  toaster.show(t("Application submitted and synced to My Applications"), { type: "success" });
    }
  });

  return container;
}
