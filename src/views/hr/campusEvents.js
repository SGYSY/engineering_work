export function renderHrCampusEvents({ state, actions, toaster }) {
  const { calendar, rules, registrationForm } = state.hr.campusEvents;

  const container = document.createElement("div");
  const header = document.createElement("div");
  header.className = "page-header";
  header.innerHTML = `
    <div>
      <h2 class="section-title" style="margin-bottom:6px;">校招活动面板</h2>
      <p style="color: var(--text-light); font-size: 13px;">查看活动日历、报名规则与企业报名表状态。</p>
    </div>
    <div class="table-actions">
      <button class="button button--outline">下载日历</button>
      <button class="button">提交报名</button>
    </div>
  `;
  container.appendChild(header);

  const grid = document.createElement("div");
  grid.className = "grid grid-2";
  container.appendChild(grid);

  const calendarCard = document.createElement("section");
  calendarCard.className = "card";
  calendarCard.innerHTML = `
    <h3 class="section-title">活动日历</h3>
    <div class="calendar-grid">
      ${calendar
        .map(
          (item) => `
            <div class="calendar-item">
              <div style="font-weight:600;">${item.date}</div>
              <div style="margin:6px 0;">${item.title}</div>
              <span class="badge ${item.status === "已报名" ? "badge--success" : ""}">${item.status}</span>
            </div>
          `
        )
        .join("")}
    </div>
  `;
  grid.appendChild(calendarCard);

  const ruleCard = document.createElement("section");
  ruleCard.className = "card";
  ruleCard.innerHTML = `
    <h3 class="section-title">规则说明</h3>
    <ul style="display:grid; gap:12px; color:#3a4f72;">
      ${rules.map((rule) => `<li>• ${rule}</li>`).join("")}
    </ul>
  `;
  grid.appendChild(ruleCard);

  const formCard = document.createElement("section");
  formCard.className = "card";
  formCard.innerHTML = `
    <div class="page-header" style="margin-bottom:16px;">
      <h3 class="section-title" style="margin-bottom:0;">企业报名表</h3>
      <span class="badge">状态：${registrationForm.status}</span>
    </div>
    <div class="form-grid">
      ${Object.entries(registrationForm)
        .filter(([key]) => key !== "status")
        .map(
          ([key, value]) => `
            <label style="display:flex; flex-direction:column; gap:6px; font-size:12px; color: var(--text-light);">
              ${labelMap[key] || key}
              <input class="input" name="${key}" value="${value}" />
            </label>
          `
        )
        .join("")}
    </div>
    <label style="display:flex; flex-direction:column; gap:6px; font-size:12px; color: var(--text-light); margin-top:16px;">
      备注信息
      <textarea class="input" name="remark">${registrationForm.remark || ""}</textarea>
    </label>
    <div class="form-actions">
      <button class="button button--outline" data-action="save">保存草稿</button>
      <button class="button" data-action="submit">提交审核</button>
    </div>
  `;
  container.appendChild(formCard);

  formCard.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;
    const action = target.dataset.action;
    if (!action) return;

    const inputs = formCard.querySelectorAll("input, textarea");
    const payload = {};
    inputs.forEach((input) => {
      payload[input.name] = input.value;
    });

    actions.updateCampusRegistration(payload);
    if (action === "save") {
      toaster.show("报名表已保存草稿", { type: "success" });
    }
    if (action === "submit") {
      toaster.show("报名信息已提交，等待审核", { type: "success" });
      actions.updateCampusRegistration({ status: "待审" });
    }
  });

  header.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;
    if (target.textContent?.includes("下载日历")) {
      toaster.show("活动日历已下载", { type: "success" });
    }
    if (target.textContent?.includes("提交报名")) {
      toaster.show("报名请求已发送", { type: "info" });
    }
  });

  return container;
}

const labelMap = {
  company: "企业名称",
  contact: "联系人",
  phone: "联系电话",
  boothType: "展位需求",
  participants: "参会人数"
};
