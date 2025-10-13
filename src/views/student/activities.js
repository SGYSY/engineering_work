import { t } from "../../utils/i18n.js";

export function renderStudentActivities({ state, actions, toaster }) {
  const container = document.createElement("div");
  const activities = state.student.activities;

  const header = document.createElement("div");
  header.className = "page-header";
  header.innerHTML = `
    <div>
      <h2 class="section-title" style="margin-bottom:6px;">${t("Campus Activities")}</h2>
      <p style="color: var(--text-light); font-size: 13px;">${t("Follow presentations and career fairs, register online, and review entry guidance.")}</p>
    </div>
    <div class="table-actions">
      <button class="button button--outline" data-action="my">${t("My Registrations")}</button>
      <button class="button" data-action="download">${t("Download Schedule")}</button>
    </div>
  `;
  container.appendChild(header);

  const filterBar = document.createElement("div");
  filterBar.className = "filter-bar";

  const typeSelect = document.createElement("select");
  typeSelect.innerHTML = `<option value="">${t("All Types")}</option>` +
    [...new Set(activities.map((item) => item.type))]
      .map((type) => `<option value="${type}">${type}</option>`)
      .join("");
  filterBar.appendChild(typeSelect);

  const searchInput = document.createElement("input");
  searchInput.placeholder = t("Search activities or companies");
  searchInput.className = "input";
  searchInput.style.flex = "1";
  filterBar.appendChild(searchInput);

  const guideInput = document.createElement("input");
  guideInput.placeholder = t("Update the entry guide (select an activity first)");
  guideInput.className = "input";
  filterBar.appendChild(guideInput);

  const updateGuideButton = document.createElement("button");
  updateGuideButton.className = "button button--ghost";
  updateGuideButton.textContent = t("Update Guide");
  filterBar.appendChild(updateGuideButton);

  const resetButton = document.createElement("button");
  resetButton.className = "button button--ghost";
  resetButton.textContent = t("Reset");
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
      empty.textContent = t("No activities match your filters");
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
        <div style="color:#3a4f72;">${t("Entry Guide")}: ${activity.guide}</div>
        <div class="table-actions" style="justify-content:flex-end;">
          <button class="button button--ghost" data-action="detail" data-id="${activity.id}">${t("Details")}</button>
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
      toaster.show(t("Activity recorded. Check the registration list in the header."), { type: "info" });
    }
    if (action === "toggle") {
      actions.toggleActivityRegistration(id);
      toaster.show(t("Activity status updated"), { type: "success" });
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
      toaster.show(t("Select an activity card first"), { type: "warn" });
      return;
    }
    if (!guideInput.value.trim()) {
      toaster.show(t("Enter updated entry guidance before submitting"), { type: "warn" });
      return;
    }
    actions.addStudentActivityFeedback(activeId, guideInput.value.trim());
    toaster.show(t("Entry guide updated"), { type: "success" });
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
        toaster.show(t("You have not registered for any activities yet"), { type: "info" });
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
      toaster.show(t("Schedule sent to your email"), { type: "success" });
    }
  });

  renderList();
  return container;
}
