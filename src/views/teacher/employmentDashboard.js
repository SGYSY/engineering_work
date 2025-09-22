export function renderTeacherEmploymentDashboard({ state, toaster }) {
  const dashboard = state.teacher.employmentDashboard;
  const stateFilter = {
    year: dashboard.filters.year[0],
    college: dashboard.filters.college[0],
    major: dashboard.filters.major[0]
  };

  const container = document.createElement("div");
  const header = document.createElement("div");
  header.className = "page-header";
  header.innerHTML = `
    <div>
      <h2 class="section-title" style="margin-bottom:6px;">学生就业看板</h2>
      <p style="color: var(--text-light); font-size: 13px;">按届别、学院、专业筛选就业流向与岗位类别分布。</p>
    </div>
    <button class="button button--outline" data-action="export">导出数据</button>
  `;
  container.appendChild(header);

  const filters = document.createElement("div");
  filters.className = "filter-bar";
  filters.innerHTML = `
    ${renderSelect("届别", "year", dashboard.filters.year)}
    ${renderSelect("学院", "college", dashboard.filters.college)}
    ${renderSelect("专业", "major", dashboard.filters.major)}
  `;
  container.appendChild(filters);

  const grid = document.createElement("div");
  grid.className = "grid grid-3";
  container.appendChild(grid);

  const industryCard = document.createElement("section");
  industryCard.className = "card";
  grid.appendChild(industryCard);

  const categoryCard = document.createElement("section");
  categoryCard.className = "card";
  grid.appendChild(categoryCard);

  const regionCard = document.createElement("section");
  regionCard.className = "card";
  grid.appendChild(regionCard);

  function renderCards() {
    industryCard.innerHTML = `
      <h3 class="section-title">行业分布</h3>
      <div class="data-list">
        ${dashboard.industryDistribution.map((item) => renderBarRow(item)).join("")}
      </div>
    `;

    categoryCard.innerHTML = `
      <h3 class="section-title">岗位类别分布</h3>
      <div class="data-list">
        ${dashboard.jobCategory.map((item) => renderBarRow(item, "#6f8cfb")).join("")}
      </div>
    `;

    regionCard.innerHTML = `
      <h3 class="section-title">地区流向</h3>
      <div class="data-list">
        ${dashboard.regionFlow.map((item) => renderBarRow(item, "#34caa5")).join("")}
      </div>
    `;
  }

  filters.querySelectorAll("select").forEach((select) => {
    select.addEventListener("change", () => {
      stateFilter[select.name] = select.value;
      updateSubtitle();
    });
  });

  header.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;
    if (target.dataset.action === "export") {
      toaster?.show?.("已导出当前筛选的数据报表", { type: "success" });
    }
  });

  function updateSubtitle() {
    header.querySelector("p").textContent = `当前筛选：${stateFilter.year} 届 · ${stateFilter.college} · ${stateFilter.major}`;
  }

  renderCards();
  updateSubtitle();

  return container;
}

function renderSelect(label, name, options) {
  return `
    <label style="display:flex; flex-direction:column; gap:6px; font-size:12px; color: var(--text-light);">
      ${label}
      <select name="${name}">
        ${options.map((option) => `<option value="${option}">${option}</option>`).join("")}
      </select>
    </label>
  `;
}

function renderBarRow(item, color = "var(--brand-blue)") {
  return `
    <div>
      <div style="display:flex; justify-content:space-between; font-size:13px; margin-bottom:6px; color:#3a4f72;">
        <span>${item.name}</span>
        <span>${item.value}%</span>
      </div>
      <div class="bar" style="width:100%;">
        <div class="bar__fill" style="width:${item.value}%; background:${color};"></div>
      </div>
    </div>
  `;
}
