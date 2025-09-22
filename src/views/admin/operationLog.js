export function renderAdminOperationLog({ state, actions, toaster }) {
  const logs = state.admin.logs;
  const container = document.createElement("div");

  const header = document.createElement("div");
  header.className = "page-header";
  header.innerHTML = `
    <div>
      <h2 class="section-title" style="margin-bottom:6px;">操作日志</h2>
      <p style="color: var(--text-light); font-size: 13px;">追踪平台敏感操作，支持按时间与用户筛选。</p>
    </div>
    <div class="table-actions">
      <button class="button button--outline" data-action="export">导出日志</button>
      <button class="button" data-action="clean">清理30天前数据</button>
    </div>
  `;
  container.appendChild(header);

  const filters = document.createElement("div");
  filters.className = "filter-bar";
  filters.innerHTML = `
    <input class="input" type="text" placeholder="搜索用户或动作" data-role="keyword" style="flex:1;" />
    <input class="input" type="date" data-role="date" />
    <button class="button button--ghost" data-action="reset">重置</button>
  `;
  container.appendChild(filters);

  const table = document.createElement("section");
  table.className = "card";
  table.innerHTML = `
    <table class="table table--striped">
      <thead>
        <tr>
          <th>时间</th>
          <th>操作人</th>
          <th>动作</th>
          <th>目标对象</th>
          <th>来源IP</th>
        </tr>
      </thead>
      <tbody></tbody>
    </table>
  `;
  container.appendChild(table);

  const tbody = table.querySelector("tbody");
  const keywordInput = filters.querySelector("[data-role='keyword']");
  const dateInput = filters.querySelector("[data-role='date']");

  function renderRows() {
    const keyword = keywordInput.value.trim();
    const date = dateInput.value;
    const rows = logs.filter((log) => {
      const matchKeyword = keyword
        ? log.actor.includes(keyword) || log.action.includes(keyword) || log.target.includes(keyword)
        : true;
      const matchDate = date ? log.time.startsWith(date) : true;
      return matchKeyword && matchDate;
    });

    tbody.innerHTML = rows
      .map(
        (log) => `
          <tr>
            <td>${log.time}</td>
            <td>${log.actor}</td>
            <td>${log.action}</td>
            <td>${log.target}</td>
            <td>${log.ip || "-"}</td>
          </tr>
        `
      )
      .join("");

    if (!rows.length) {
      tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; padding:32px; color: var(--text-light);">暂无日志</td></tr>`;
    }
  }

  keywordInput.addEventListener("input", renderRows);
  dateInput.addEventListener("change", renderRows);
  filters.querySelector("[data-action='reset']").addEventListener("click", () => {
    keywordInput.value = "";
    dateInput.value = "";
    renderRows();
  });

  header.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;
    const action = target.dataset.action;
    if (!action) return;

    if (action === "export") {
      toaster.show("日志已导出", { type: "success" });
    }
    if (action === "clean") {
      toaster.show("已清理过期日志", { type: "warn" });
    }
  });

  renderRows();
  return container;
}
