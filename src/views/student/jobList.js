import { jobFilters } from "../../data/mockData.js";
import { t } from "../../utils/i18n.js";

export function renderStudentJobList({ state, actions, navigate, toaster }) {
  const container = document.createElement("div");
  const jobs = state.student.jobs;

  const header = document.createElement("div");
  header.className = "page-header";
  header.innerHTML = `
    <div>
      <h2 class="section-title" style="margin-bottom:6px;">${t("职位列表")}</h2>
      <p style="color: var(--text-light); font-size: 13px;">${t("筛选行业、城市、薪资与学历，快速找到匹配岗位；支持收藏与一键投递。")}</p>
    </div>
    <div class="table-actions">
      <button class="button button--outline" data-action="recommend">${t("智能推荐")}</button>
      <button class="button" data-action="save-filter">${t("保存筛选")}</button>
    </div>
  `;
  container.appendChild(header);

  const filterBar = document.createElement("div");
  filterBar.className = "filter-bar";

  const keywordInput = createInput(t("关键字搜索（岗位/公司/标签）"));
  filterBar.appendChild(keywordInput);

  const industrySelect = createSelect(t("行业"), jobFilters.industries);
  const citySelect = createSelect(t("城市"), jobFilters.cities);
  const salarySelect = createSelect(t("薪资"), jobFilters.salaries);
  const eduSelect = createSelect(t("学历"), jobFilters.education);

  [industrySelect, citySelect, salarySelect, eduSelect].forEach((select) => filterBar.appendChild(select));

  const resetButton = document.createElement("button");
  resetButton.className = "button button--ghost";
  resetButton.textContent = t("重置");
  filterBar.appendChild(resetButton);

  container.appendChild(filterBar);

  const listWrapper = document.createElement("div");
  listWrapper.className = "list";
  container.appendChild(listWrapper);

  function applyFilters() {
    const query = keywordInput.value.trim();
    const industry = industrySelect.querySelector("select").value;
    const city = citySelect.querySelector("select").value;
    const salary = salarySelect.querySelector("select").value;
    const education = eduSelect.querySelector("select").value;

    const results = jobs.filter((job) => {
      const matchKeyword = query
        ? job.title.includes(query) || job.company.includes(query) || job.tags.some((tag) => tag.includes(query))
        : true;
      const matchIndustry = industry ? job.industry === industry : true;
      const matchCity = city ? job.city === city : true;
      const matchSalary = salary ? salaryMatch(job.salary, salary) : true;
      const matchEducation = education ? job.education === education : true;
      return matchKeyword && matchIndustry && matchCity && matchSalary && matchEducation;
    });
    renderList(results);
  }

  function renderList(list) {
    listWrapper.innerHTML = "";
    if (!list.length) {
      const empty = document.createElement("div");
      empty.className = "empty-state";
  empty.textContent = t("暂无匹配岗位");
      listWrapper.appendChild(empty);
      return;
    }

    list.forEach((job) => {
      const jobCard = document.createElement("article");
      jobCard.className = "job-card";
      jobCard.innerHTML = `
        <div class="job-card__header">
          <div>
            <h3 style="font-size:18px; font-weight:600; margin-bottom:6px;">${job.title}</h3>
            <div class="job-card__meta">
              <span>${job.company}</span>
              <span>${job.city}</span>
              <span>${job.salary}</span>
              <span>${job.education}${t("及以上")}</span>
              <span>${t("截止")}: ${job.deadline}</span>
            </div>
          </div>
          <div class="job-card__actions">
            <button class="button ${job.favorite ? "button--ghost" : "button--outline"}" data-action="favorite" data-id="${job.id}">${
        t(job.favorite ? "已收藏" : "收藏")
      }</button>
            <button class="button" data-action="apply" data-id="${job.id}">${t("一键投递")}</button>
            <button class="button button--ghost" data-action="detail" data-id="${job.id}">${t("查看详情")}</button>
          </div>
        </div>
        <div class="chips">
          ${job.tags.map((tag) => `<span class="chip">${tag}</span>`).join("")}
        </div>
        <p style="color: var(--text-light); line-height:1.6;">${job.description}</p>
      `;
      listWrapper.appendChild(jobCard);
    });
  }

  listWrapper.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;
    const action = target.dataset.action;
    const jobId = target.dataset.id;
    if (!action || !jobId) return;

    if (action === "detail") {
      navigate("student", "job-detail", jobId);
      return;
    }

    if (action === "favorite") {
      actions.toggleJobFavorite(jobId);
  toaster.show(t("收藏状态已更新"), { type: "info" });
      return;
    }

    if (action === "apply") {
      actions.applyForJob(jobId);
  toaster.show(t("投递成功，已同步至我的投递"), { type: "success" });
      return;
    }
  });

  keywordInput.addEventListener("input", applyFilters);
  [industrySelect, citySelect, salarySelect, eduSelect].forEach((select) =>
    select.querySelector("select").addEventListener("change", applyFilters)
  );
  resetButton.addEventListener("click", () => {
    keywordInput.value = "";
    [industrySelect, citySelect, salarySelect, eduSelect].forEach((select) => {
      select.querySelector("select").value = "";
    });
    applyFilters();
  });

  header.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;
    if (target.dataset.action === "recommend") {
  keywordInput.value = "frontend";
      applyFilters();
  toaster.show(t("已根据偏好生成推荐结果"), { type: "info" });
    }
    if (target.dataset.action === "save-filter") {
  toaster.show(t("筛选已保存，下次将自动加载"), { type: "success" });
    }
  });

  applyFilters();
  return container;
}

function salaryMatch(jobSalary, filterValue) {
  const normalizedJob = jobSalary.toLowerCase();
  const normalizedFilter = filterValue.toLowerCase();

  const jobIsDaily = normalizedJob.includes("/day") || normalizedJob.includes("daily");
  const filterIsDaily = normalizedFilter.includes("/day") || normalizedFilter.includes("daily");
  if (jobIsDaily !== filterIsDaily) {
    return false;
  }

  if (normalizedFilter.includes("+")) {
    const threshold = parseSalaryValue(normalizedFilter.replace("+", ""));
    const min = parseSalaryValue(normalizedJob.split("-")[0]);
    return min >= threshold;
  }

  if (normalizedFilter.includes("-")) {
    const [filterMin, filterMax] = normalizedFilter.split("-").map(parseSalaryValue);
    const [jobMinRaw, jobMaxRaw] = normalizedJob.split("-");
    const jobMin = parseSalaryValue(jobMinRaw);
    const jobMax = parseSalaryValue(jobMaxRaw || jobMinRaw);
    return jobMin <= filterMax && jobMax >= filterMin;
  }

  return normalizedJob.includes(normalizedFilter);
}

function parseSalaryValue(raw) {
  if (!raw) return 0;
  const cleaned = raw.replace(/[^0-9.]/g, "");
  const value = parseFloat(cleaned);
  if (Number.isNaN(value)) {
    return 0;
  }
  if (raw.includes("k")) {
    return value * 1000;
  }
  return value;
}

function createSelect(label, options) {
  const wrapper = document.createElement("label");
  wrapper.style.display = "flex";
  wrapper.style.flexDirection = "column";
  wrapper.style.gap = "6px";
  wrapper.style.fontSize = "12px";
  wrapper.style.color = "var(--text-light)";
  const select = document.createElement("select");
  select.innerHTML = `<option value="">${label}</option>` + options.map((opt) => `<option value="${opt}">${opt}</option>`).join("");
  wrapper.appendChild(select);
  return wrapper;
}

function createInput(placeholder) {
  const input = document.createElement("input");
  input.type = "text";
  input.placeholder = placeholder;
  input.className = "input";
  input.style.flex = "1";
  return input;
}
