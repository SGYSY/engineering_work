import { t } from "../../utils/i18n.js";

export function renderStudentActivities({ state, actions, toaster }) {
  const container = document.createElement("div");
  const activities = state.student.activities;

  const header = document.createElement("div");
  header.className = "page-header";
  header.innerHTML = `
    <div>
      <h2 class="section-title" style="margin-bottom:6px;">${t("活动列表")}</h2>
      <p style="color: var(--text-light); font-size: 13px;">${t("关注宣讲与双选会日程，在线报名并查看入场指引。")}</p>
    </div>
    <div class="table-actions">
      <button class="button button--outline" data-action="my">${t("我的报名")}</button>
      <button class="button" data-action="download">${t("下载日程表")}</button>
    </div>
  `;
  container.appendChild(header);

  const filterBar = document.createElement("div");
  filterBar.className = "filter-bar";

  const typeSelect = document.createElement("select");
  typeSelect.innerHTML = `<option value="">${t("全部类型")}</option>` +
    [...new Set(activities.map((item) => item.type))]
      .map((type) => `<option value="${type}">${type}</option>`)
      .join("");
  filterBar.appendChild(typeSelect);

  const searchInput = document.createElement("input");
  searchInput.placeholder = t("搜索活动或企业");
  searchInput.className = "input";
  searchInput.style.flex = "1";
  filterBar.appendChild(searchInput);

  const guideInput = document.createElement("input");
  guideInput.placeholder = t("更新入场指引（选中活动有效）");
  guideInput.className = "input";
  filterBar.appendChild(guideInput);

  const updateGuideButton = document.createElement("button");
  updateGuideButton.className = "button button--ghost";
  updateGuideButton.textContent = t("更新指引");
  filterBar.appendChild(updateGuideButton);

  const resetButton = document.createElement("button");
  resetButton.className = "button button--ghost";
  resetButton.textContent = t("重置");
  filterBar.appendChild(resetButton);

  container.appendChild(filterBar);

  const list = document.createElement("div");
  list.className = "list";
  container.appendChild(list);

  let activeId = activities[0]?.id || null;

  function renderList() {
    const keyword = searchInput.value.trim();
    const type = typeSelect.value;
    const results = activities.filter((item) => {
      const matchKeyword = keyword ? item.title.includes(keyword) : true;
      const matchType = type ? item.type === type : true;
      return matchKeyword && matchType;
    });
    list.innerHTML = "";
    if (!results.length) {
      const empty = document.createElement("div");
      empty.className = "empty-state";
      empty.textContent = t("暂无相关活动");
      list.appendChild(empty);
      return;
    }

    results.forEach((activity) => {
      const card = document.createElement("article");
      card.className = "activity-card";
      card.dataset.id = activity.id;
      if (activity.id === activeId) {
        card.style.border = "1px solid var(--brand-blue)";
      }
      card.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:flex-start;">
          <div>
            <div style="font-size:18px; font-weight:600; margin-bottom:6px;">${activity.title}</div>
            <div class="activity-card__meta">
              <span>${activity.type}</span>
              <span>${activity.date}</span>
              <span>${activity.location}</span>
            </div>
          </div>
          <span class="badge ${activity.status === "Registered" ? "badge--success" : ""}">${t(activity.status)}</span>
        </div>
        <div style="color:#3a4f72;">${t("入场指引")}: ${activity.guide}</div>
        <div class="table-actions" style="justify-content:flex-end;">
          <button class="button button--ghost" data-action="detail" data-id="${activity.id}">${t("详情")}</button>
          <button class="button" data-action="toggle" data-id="${activity.id}">${
        t(activity.status === "Open" ? "Register Now" : "Cancel Registration")
      }</button>
        </div>
      `;
      list.appendChild(card);
    });
  }

  list.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;
    const action = target.dataset.action;
    const id = target.dataset.id;
    if (!action || !id) return;

    activeId = id;

    if (action === "detail") {
      toaster.show(t("已记录该活动，可在页面右上角查看报名清单"), { type: "info" });
    }
    if (action === "toggle") {
      actions.toggleActivityRegistration(id);
      toaster.show(t("活动状态已更新"), { type: "success" });
    }
  });

  typeSelect.addEventListener("change", renderList);
  searchInput.addEventListener("input", renderList);
  resetButton.addEventListener("click", () => {
    typeSelect.value = "";
    searchInput.value = "";
    guideInput.value = "";
    renderList();
  });
  updateGuideButton.addEventListener("click", () => {
    if (!activeId) {
      toaster.show(t("请先选择活动卡片"), { type: "warn" });
      return;
    }
    if (!guideInput.value.trim()) {
      toaster.show(t("请输入新的入场指引"), { type: "warn" });
      return;
    }
    actions.addStudentActivityFeedback(activeId, guideInput.value.trim());
    toaster.show(t("入场指引已更新"), { type: "success" });
    guideInput.value = "";
  });

  header.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;
    if (target.dataset.action === "my") {
      typeSelect.value = "";
      searchInput.value = "";
      const registered = activities.filter((item) => item.status === "Registered");
      if (!registered.length) {
        toaster.show(t("你还没有报名任何活动"), { type: "info" });
        return;
      }
      list.innerHTML = "";
      registered.forEach((activity) => {
        const card = document.createElement("article");
        card.className = "activity-card";
        card.innerHTML = `<div style="font-size:18px; font-weight:600; margin-bottom:6px;">${activity.title}</div><div style="color:#3a4f72;">${activity.date} · ${activity.location}</div>`;
        list.appendChild(card);
      });
    }
    if (target.dataset.action === "download") {
      toaster.show(t("日程表已发送至邮箱"), { type: "success" });
    }
  });

  renderList();
  return container;
}
