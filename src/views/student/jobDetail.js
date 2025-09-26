import { t } from "../../utils/i18n.js";
export function renderStudentJobDetail({ state, actions, param, navigate, toaster }) {
  const job = state.student.jobs.find((item) => item.id === param) || state.student.jobs[0];

  const container = document.createElement("div");
  const backButton = document.createElement("button");
  backButton.className = "button button--ghost";
  backButton.textContent = t("返回职位列表");
  backButton.addEventListener("click", () => navigate("student", "job-list"));
  container.appendChild(backButton);

  if (!job) {
    const empty = document.createElement("div");
    empty.className = "empty-state";
    empty.style.marginTop = "24px";
  empty.textContent = t("职位不存在或已下线");
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
          <span>${t("薪资")}: ${job.salary}</span>
          <span>${t("学历要求")}: ${job.education}${t("及以上")}</span>
          <span>${t("截止")}: ${job.deadline}</span>
        </div>
      </div>
      <div style="display:flex; gap:12px;">
  <button class="button button--outline" data-action="favorite">${t(job.favorite ? "已收藏" : "收藏")}</button>
  <button class="button" data-action="apply">${t("立即投递")}</button>
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
  <h3 class="section-title">${t("职位描述")}</h3>
    <p style="line-height:1.7; color:#3a4f72;">${job.description}</p>
  `;

  const reqSection = document.createElement("section");
  reqSection.className = "card";
  reqSection.innerHTML = `
  <h3 class="section-title">${t("任职要求")}</h3>
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
  <h3 class="section-title">${t("投递流程提醒")}</h3>
    <div class="timeline">
      <div class="timeline-item">
        <div class="timeline-item__time">${job.publishDate}</div>
        <div class="timeline-item__content">
          <div style="font-weight:500;">${t("岗位发布")}</div>
          <div style="color: var(--text-light);">${t("官方发布职位信息，开放投递入口。")}</div>
        </div>
      </div>
      <div class="timeline-item">
        <div class="timeline-item__time">${job.deadline}</div>
        <div class="timeline-item__content">
          <div style="font-weight:500;">${t("投递截止")}</div>
          <div style="color: var(--text-light);">${t("建议提前准备面试材料，避免高峰期投递失败。")}</div>
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
  toaster.show(t("收藏状态已更新"), { type: "info" });
    }
    if (action === "apply") {
      actions.applyForJob(job.id);
  toaster.show(t("投递成功，已同步到我的投递"), { type: "success" });
    }
  });

  return container;
}
