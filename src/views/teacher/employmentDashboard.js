export function renderTeacherEmploymentDashboard({ state, toaster }) {
  const dashboard = state.teacher.employmentDashboard;
  const stateFilter = {
    year: dashboard.filters.year[0],
    college: dashboard.filters.college[0],
    major: dashboard.filters.major[0]
  };
  const records = dashboard.records || [];

  const container = document.createElement("div");
  const header = document.createElement("div");
  header.className = "page-header";
  header.innerHTML = `
    <div>
      <h2 class="section-title" style="margin-bottom:6px;">Student Employment Dashboard</h2>
      <p style="color: var(--text-light); font-size: 13px;">Filter career outcomes by class year, college, and major.</p>
    </div>
    <button class="button button--outline" data-action="export">Export data</button>
  `;
  container.appendChild(header);

  const filters = document.createElement("div");
  filters.className = "filter-bar";
  filters.innerHTML = `
    ${renderSelect("Class year", "year", dashboard.filters.year)}
    ${renderSelect("College", "college", dashboard.filters.college)}
    ${renderSelect("Major", "major", dashboard.filters.major)}
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
    const filtered = getFilteredRecords();
    const industry = aggregateByKey(filtered, "industry");
    const category = aggregateByKey(filtered, "category");
    const region = aggregateByKey(filtered, "region");

    industryCard.innerHTML = `
      <h3 class="section-title">Industry distribution</h3>
      <div class="data-list">
        ${industry.length ? industry.map((item) => renderBarRow(item)).join("") : `<div class="empty-state">No data</div>`}
      </div>
    `;

    categoryCard.innerHTML = `
      <h3 class="section-title">Role category distribution</h3>
      <div class="data-list">
        ${category.length ? category.map((item) => renderBarRow(item, "#6f8cfb")).join("") : `<div class="empty-state">No data</div>`}
      </div>
    `;

    regionCard.innerHTML = `
      <h3 class="section-title">Regional flow</h3>
      <div class="data-list">
        ${region.length ? region.map((item) => renderBarRow(item, "#34caa5")).join("") : `<div class="empty-state">No data</div>`}
      </div>
    `;
  }

  filters.querySelectorAll("select").forEach((select) => {
    select.addEventListener("change", () => {
      stateFilter[select.name] = select.value;
      updateSubtitle();
      renderCards();
    });
  });

  header.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;
    if (target.dataset.action === "export") {
      toaster?.show?.("Exported report for current filters", { type: "success" });
    }
  });

  function updateSubtitle() {
    const total = getFilteredRecords().length;
    header.querySelector("p").textContent = `Current filters: Class of ${stateFilter.year} · ${stateFilter.college} · ${stateFilter.major} · ${total} record${total === 1 ? "" : "s"}`;
  }

  function getFilteredRecords() {
    if (!records.length) {
      return [];
    }
    return records.filter((item) => {
      const matchYear = stateFilter.year ? item.year === stateFilter.year : true;
      const matchCollege = stateFilter.college ? item.college === stateFilter.college : true;
      const matchMajor = stateFilter.major ? item.major === stateFilter.major : true;
      return matchYear && matchCollege && matchMajor;
    });
  }

  function aggregateByKey(list, key) {
    if (!list.length) {
      return [];
    }
    const counts = list.reduce((acc, item) => {
      const value = item[key] || "Unknown";
      acc[value] = (acc[value] || 0) + 1;
      return acc;
    }, {});
    const total = Object.values(counts).reduce((sum, value) => sum + value, 0) || 1;
    return Object.entries(counts)
      .map(([name, count]) => ({ name, value: Math.round((count / total) * 100) }))
      .sort((a, b) => b.value - a.value);
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
