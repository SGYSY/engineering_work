export function renderHrCandidatePanel({ state, actions, toaster }) {
  const candidatesState = state.hr.candidates;
  const stages = candidatesState.stages;
  let filterStage = "";
  let activeId = candidatesState.list[0]?.id || null;

  const container = document.createElement("div");
  const header = document.createElement("div");
  header.className = "page-header";
  header.innerHTML = `
    <div>
      <h2 class="section-title" style="margin-bottom:6px;">候选人处理面板</h2>
      <p style="color: var(--text-light); font-size: 13px;">左侧列表筛选候选人，右侧预览简历并流转状态。</p>
    </div>
    <div class="table-actions">
      <button class="button button--outline">批量导出简历</button>
      <button class="button">批量邀约</button>
    </div>
  `;
  container.appendChild(header);

  const toolbar = document.createElement("div");
  toolbar.className = "filter-bar";
  toolbar.innerHTML = `
    <label style="display:flex; flex-direction:column; gap:6px; font-size:12px; color: var(--text-light);">
      状态筛选
      <select data-role="stage-filter">
        <option value="">全部</option>
        ${stages.map((stage) => `<option value="${stage.id}">${stage.label}</option>`).join("")}
      </select>
    </label>
    <input class="input" type="text" placeholder="搜索姓名或岗位" data-role="keyword" style="flex:1;" />
    <button class="button button--ghost" data-action="reset">重置</button>
  `;
  container.appendChild(toolbar);

  const layout = document.createElement("div");
  layout.className = "split-panel";
  container.appendChild(layout);

  const aside = document.createElement("aside");
  aside.className = "split-panel__aside";
  layout.appendChild(aside);

  const resumeArea = document.createElement("section");
  resumeArea.className = "resume-preview";
  layout.appendChild(resumeArea);

  const keywordInput = toolbar.querySelector("[data-role='keyword']");
  const stageFilter = toolbar.querySelector("[data-role='stage-filter']");

  function getFiltered() {
    const keyword = keywordInput.value.trim();
    return candidatesState.list.filter((item) => {
      const matchStage = filterStage ? item.stage === filterStage : true;
      const matchKeyword = keyword
        ? item.name.includes(keyword) || item.job.includes(keyword) || item.summary.includes(keyword)
        : true;
      return matchStage && matchKeyword;
    });
  }

  function renderAside() {
    const list = getFiltered();
    aside.innerHTML = "";
    if (!list.length) {
      const empty = document.createElement("div");
      empty.className = "empty-state";
      empty.textContent = "暂无候选人";
      aside.appendChild(empty);
      return;
    }
    list.forEach((candidate) => {
      const card = document.createElement("div");
      card.className = "candidate-card";
      if (candidate.id === activeId) card.classList.add("active");
      card.dataset.id = candidate.id;
      card.innerHTML = `
        <div style="display:flex; justify-content:space-between;">
          <div>
            <div style="font-weight:600;">${candidate.name}</div>
            <div style="color: var(--text-light); font-size:12px;">${candidate.job}</div>
          </div>
          <span class="badge">${getStageLabel(candidate.stage, stages)}</span>
        </div>
        <div style="color:#3a4f72; font-size:12px; margin-top:8px; line-height:1.4;">${candidate.summary}</div>
        <div style="color: var(--text-light); font-size:12px; margin-top:6px;">更新：${candidate.updatedAt}</div>
      `;
      card.addEventListener("click", () => {
        activeId = candidate.id;
        renderAside();
        renderResume();
      });
      aside.appendChild(card);
    });
  }

  function renderResume() {
    const candidate = candidatesState.list.find((item) => item.id === activeId);
    if (!candidate) {
      resumeArea.innerHTML = `<div class="empty-state">请选择候选人</div>`;
      return;
    }
    resumeArea.innerHTML = `
      <div class="page-header" style="margin-bottom:16px;">
        <div>
          <h3 class="section-title" style="margin-bottom:4px;">${candidate.name}</h3>
          <div style="color: var(--text-light); font-size: 13px;">应聘岗位：${candidate.job}</div>
        </div>
        <div class="table-actions">
          ${stages
            .map(
              (stage) => `<button class="button button--sm ${stage.id === candidate.stage ? "" : "button--ghost"}" data-stage="${stage.id}">${stage.label}</button>`
            )
            .join("")}
        </div>
      </div>
      <div style="line-height:1.7; color:#3a4f72;">${candidate.resume}</div>
      <div style="margin-top:18px;">
        <h4 style="font-weight:600; margin-bottom:10px;">批量邀约模板</h4>
        <div class="data-list">
          ${candidatesState.templates
            .map(
              (tpl) => `<div class="data-row"><span>${tpl.name}</span><button class="button button--ghost button--sm" data-template="${tpl.id}">发送</button></div>`
            )
            .join("")}
        </div>
      </div>
    `;

    resumeArea.addEventListener("click", handleResumeActions, { once: true });
  }

  function handleResumeActions(event) {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;
    if (target.dataset.stage) {
      actions.updateCandidateStage(activeId, target.dataset.stage);
      toaster.show("候选人状态已更新", { type: "success" });
    }
    if (target.dataset.template) {
      toaster.show("已发送邀约模板", { type: "info" });
    }
  }

  stageFilter.addEventListener("change", () => {
    filterStage = stageFilter.value;
    renderAside();
  });

  keywordInput.addEventListener("input", () => {
    renderAside();
  });

  toolbar.querySelector("[data-action='reset']").addEventListener("click", () => {
    filterStage = "";
    keywordInput.value = "";
    stageFilter.value = "";
    renderAside();
  });

  renderAside();
  renderResume();

  return container;
}

function getStageLabel(id, stages) {
  return stages.find((stage) => stage.id === id)?.label || "-";
}
