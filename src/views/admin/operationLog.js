export function renderAdminOperationLog({ state, actions, toaster }) {
  const logs = state.admin.logs;
  const container = document.createElement("div");

  const header = document.createElement("div");
  header.className = "page-header";
  header.innerHTML = `
    <div>
      <h2 class="section-title" style="margin-bottom:6px;">Operation logs</h2>
      <p style="color: var(--text-light); font-size: 13px;">Track sensitive actions and filter by time or operator.</p>
    </div>
    <div class="table-actions">
      <button class="button button--outline" data-action="export">Export logs</button>
      <button class="button" data-action="clean">Purge data older than 30 days</button>
    </div>
  `;
  container.appendChild(header);

  const filters = document.createElement("div");
  filters.className = "filter-bar";
  filters.innerHTML = `
    <input class="input" type="text" placeholder="Search user or action" data-role="keyword" style="flex:1;" />
    <input class="input" type="date" data-role="date" />
    <button class="button button--ghost" data-action="reset">Reset</button>
  `;
  container.appendChild(filters);

  const table = document.createElement("section");
  table.className = "card";
  table.innerHTML = `
    <table class="table table--striped">
      <thead>
        <tr>
          <th>Time</th>
          <th>Operator</th>
          <th>Action</th>
          <th>Target</th>
          <th>Source IP</th>
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
      tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; padding:32px; color: var(--text-light);">No logs found</td></tr>`;
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
      toaster.show("Logs exported", { type: "success" });
    }
    if (action === "clean") {
      toaster.show("Old logs removed", { type: "warn" });
    }
  });

  renderRows();
  return container;
}
