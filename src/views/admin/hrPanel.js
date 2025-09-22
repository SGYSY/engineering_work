export function renderAdminHrPanel({ state, navigate, toaster }) {
  const hr = state.hr;
  const container = document.createElement("div");
  const header = document.createElement("div");
  header.className = "page-header";
  header.innerHTML = `
    <div>
      <h2 class="section-title" style="margin-bottom:6px;">HR端管理</h2>
      <p style="color: var(--text-light); font-size: 13px;">掌握企业职位投放、候选人处理与校招活动进度。</p>
    </div>
    <div class="table-actions">
      <button class="button button--outline" data-action="open">进入HR端</button>
      <button class="button">同步企业权限</button>
    </div>
  `;
  container.appendChild(header);

  const grid = document.createElement("div");
  grid.className = "grid grid-3";
  container.appendChild(grid);

  const jobCard = document.createElement("section");
  jobCard.className = "card";
  jobCard.innerHTML = `
    <h3 class="section-title">职位概览</h3>
    <div class="data-list">
      ${hr.jobs
        .map(
          (job) => `
            <div class="data-row">
              <div>
                <div style="font-weight:600;">${job.title}</div>
                <div style="color: var(--text-light); font-size:12px;">曝光 ${job.exposure} · 浏览 ${job.views} · 投递 ${job.applicants}</div>
              </div>
              <span class="badge ${job.status === "已上线" ? "badge--success" : "badge--ghost"}">${job.status}</span>
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
    <h3 class="section-title">候选人状态</h3>
    <div class="data-list">
      ${hr.candidates.list
        .map(
          (cand) => `
            <div class="data-row">
              <div>
                <div style="font-weight:600;">${cand.name}</div>
                <div style="color: var(--text-light); font-size:12px;">${cand.job} · 更新 ${cand.updatedAt}</div>
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
    <h3 class="section-title">校招活动</h3>
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
    <button class="button button--ghost" style="margin-top:16px;">查看规则</button>
  `;
  grid.appendChild(eventCard);

  header.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;
    if (target.dataset.action === "open") {
      navigate("hr", "job-management");
      toaster.show("已跳转到 HR 职位管理", { type: "info" });
    }
  });

  return container;
}

function getStageLabel(id, stages) {
  return stages.find((stage) => stage.id === id)?.label || id;
}
