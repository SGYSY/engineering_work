export function renderHrJobManagement({ state, actions, toaster }) {
  const jobs = state.hr.jobs;
  const selected = new Set();

  const container = document.createElement("div");
  const header = document.createElement("div");
  header.className = "page-header";
  header.innerHTML = `
    <div>
      <h2 class="section-title" style="margin-bottom:6px;">职位发布与管理</h2>
      <p style="color: var(--text-light); font-size: 13px;">查看投放数据，支持上下架、复制职位与批量操作。</p>
    </div>
    <div class="table-actions">
      <button class="button button--outline" data-action="create">新增职位</button>
      <button class="button" data-action="sync">同步至校招平台</button>
    </div>
  `;
  container.appendChild(header);

  const toolbar = document.createElement("div");
  toolbar.className = "filter-bar";
  toolbar.innerHTML = `
    <button class="button button--ghost" data-action="bulk-online">批量上线</button>
    <button class="button button--ghost" data-action="bulk-offline">批量下线</button>
    <button class="button button--ghost" data-action="bulk-copy">批量复制</button>
    <span style="color: var(--text-light); font-size: 12px;">已选 <strong id="selected-count">0</strong> 个职位</span>
  `;
  container.appendChild(toolbar);

  const tableCard = document.createElement("section");
  tableCard.className = "card";
  tableCard.innerHTML = `
    <table class="table table--striped">
      <thead>
        <tr>
          <th style="width:40px;"><input type="checkbox" data-role="select-all" /></th>
          <th>职位名称</th>
          <th>类型</th>
          <th>状态</th>
          <th>曝光量</th>
          <th>浏览量</th>
          <th>投递量</th>
          <th>发布时间</th>
          <th style="width:200px;">操作</th>
        </tr>
      </thead>
      <tbody></tbody>
    </table>
  `;
  container.appendChild(tableCard);

  const tbody = tableCard.querySelector("tbody");
  const selectAll = tableCard.querySelector("[data-role='select-all']");
  const selectedCount = toolbar.querySelector("#selected-count");

  function renderTable() {
    tbody.innerHTML = "";
    jobs.forEach((job) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td><input type="checkbox" data-id="${job.id}" ${selected.has(job.id) ? "checked" : ""} /></td>
        <td contenteditable="true" data-id="${job.id}" data-field="title">${job.title}</td>
        <td>${job.type}</td>
        <td><span class="badge ${job.status === "已上线" ? "badge--success" : "badge--ghost"}">${job.status}</span></td>
        <td>${job.exposure}</td>
        <td>${job.views}</td>
        <td>${job.applicants}</td>
        <td>${job.publishDate}</td>
        <td>
          <div class="table-actions">
            <button data-action="toggle" data-id="${job.id}">${job.status === "已上线" ? "下架" : "上线"}</button>
            <button data-action="duplicate" data-id="${job.id}">复制</button>
            <button data-action="boost" data-id="${job.id}">数据加速</button>
          </div>
        </td>
      `;
      tbody.appendChild(tr);
    });
  }

  function updateSelectedCount() {
    selectedCount.textContent = selected.size;
    selectAll.checked = selected.size && selected.size === jobs.length;
  }

  tbody.addEventListener("change", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLInputElement)) return;
    const id = target.dataset.id;
    if (!id) return;
    if (target.checked) {
      selected.add(id);
    } else {
      selected.delete(id);
    }
    updateSelectedCount();
  });

  selectAll.addEventListener("change", () => {
    if (selectAll.checked) {
      jobs.forEach((job) => selected.add(job.id));
    } else {
      selected.clear();
    }
    renderTable();
    updateSelectedCount();
  });

  tbody.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;
    const action = target.dataset.action;
    const id = target.dataset.id;
    if (!action || !id) return;

    if (action === "toggle") {
      const job = jobs.find((item) => item.id === id);
      const nextStatus = job?.status === "已上线" ? "已下线" : "已上线";
      actions.updateJob(id, { status: nextStatus });
      toaster.show(`职位状态已调整为 ${nextStatus}`, { type: "success" });
    }
    if (action === "duplicate") {
      actions.duplicateJob(id);
      toaster.show("已复制职位，状态为待上线", { type: "info" });
    }
    if (action === "boost") {
      actions.updateJob(id, {
        exposure: (jobs.find((item) => item.id === id)?.exposure || 0) + 200,
        views: (jobs.find((item) => item.id === id)?.views || 0) + 60
      });
      toaster.show("曝光与浏览量已模拟提升", { type: "success" });
    }
  });

  tbody.addEventListener("blur", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;
    const field = target.dataset.field;
    const id = target.dataset.id;
    if (!field || !id) return;
    actions.updateJob(id, { [field]: target.textContent.trim() });
    toaster.show("职位名称已保存", { type: "success" });
  }, true);

  toolbar.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;
    const action = target.dataset.action;
    if (!action) return;

    if (!selected.size) {
      toaster.show("请先勾选职位", { type: "warn" });
      return;
    }

    if (action === "bulk-online") {
      selected.forEach((id) => actions.updateJob(id, { status: "已上线" }));
      toaster.show("选中职位已上线", { type: "success" });
    }
    if (action === "bulk-offline") {
      selected.forEach((id) => actions.updateJob(id, { status: "已下线" }));
      toaster.show("选中职位已下线", { type: "info" });
    }
    if (action === "bulk-copy") {
      selected.forEach((id) => actions.duplicateJob(id, "批量副本"));
      toaster.show("已生成职位副本", { type: "success" });
    }
    selected.clear();
    updateSelectedCount();
  });

  header.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;
    const action = target.dataset.action;
    if (action === "create") {
      const title = prompt("请输入职位名称：");
      if (!title) return;
      actions.createJob({ title, type: "校招", status: "待上线" });
      toaster.show("职位草稿已创建", { type: "success" });
    }
    if (action === "sync") {
      toaster.show("同步任务已提交，预计 10 分钟完成", { type: "info" });
    }
  });

  renderTable();
  updateSelectedCount();
  return container;
}
