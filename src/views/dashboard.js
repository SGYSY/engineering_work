export function renderDashboard({ state, navigate, toaster }) {
  const container = document.createElement("div");
  container.className = "grid";
  container.style.gap = "32px";

  const userProfile = {
    name: "root",
    role: "平台管理员",
    status: "在线",
    lastLogin: new Date().toISOString().replace("T", " ").slice(0, 16)
  };

  container.appendChild(buildProfileCard(userProfile, state, navigate));
  container.appendChild(buildMessageArea(state));
  container.appendChild(buildNetworkSection(state, navigate, toaster));

  return container;
}

function buildProfileCard(userProfile, state, navigate) {
  const card = document.createElement("section");
  card.className = "card";

  const stats = [
    { label: "学生投递", value: state.student.applications.length },
    { label: "活跃职位", value: state.hr.jobs.filter((job) => job.status === "已上线").length },
    { label: "待审企业", value: state.teacher.enterpriseAudit.filter((item) => item.status === "待审核").length }
  ];

  card.innerHTML = `
    <div class="info-card">
      <div class="avatar avatar--lg">
        <img src="assets/avatar.svg" alt="用户头像" class="avatar" style="width: 64px; height: 64px;" />
      </div>
      <div>
        <div style="font-size: 18px; font-weight: 600;">${userProfile.name}</div>
        <div style="margin-top: 6px; display:flex; gap:8px; align-items:center;">
          <span class="badge">${userProfile.role}</span>
          <span class="pill">${userProfile.status}</span>
        </div>
        <div style="margin-top: 8px; color: var(--text-light); font-size: 13px;">上次登录时间：${userProfile.lastLogin}</div>
      </div>
      <div class="info-card__actions">
        <button class="button" onclick="window.location.hash='#student/job-list'">进入学生端</button>
        <button class="button button--outline" onclick="window.location.hash='#hr/job-management'">HR 面板</button>
      </div>
    </div>
    <div class="status-tiles">
      ${stats
        .map(
          (item) => `
            <div class="status-tile">
              <div class="status-tile__label">${item.label}</div>
              <div class="status-tile__value">${item.value}</div>
            </div>
          `
        )
        .join("")}
    </div>
  `;
  return card;
}

function buildMessageArea(state) {
  const section = document.createElement("section");
  section.className = "grid";
  section.style.gap = "24px";
  section.style.gridTemplateColumns = "minmax(0, 2fr) minmax(0, 1fr)";

  const messageCard = document.createElement("div");
  messageCard.className = "card";
  messageCard.innerHTML = `
    <div class="section-title" style="display:flex; justify-content: space-between; align-items:center;">
      <span>最新投递动态</span>
      <a class="nav-item" href="#student/applications">查看更多</a>
    </div>
    <div class="timeline">
      ${state.student.applications
        .slice(0, 3)
        .map(
          (item) => `
            <div class="timeline-item">
              <div class="timeline-item__time">${item.progress[0]?.time || item.submitDate}</div>
              <div>
                <div style="font-weight:500; margin-bottom:4px;">${item.jobTitle}</div>
                <div style="color: var(--text-light); font-size: 12px;">${item.company} · ${item.status}</div>
              </div>
            </div>
          `
        )
        .join("")}
    </div>
  `;

  const noticeCard = document.createElement("div");
  noticeCard.className = "card";
  noticeCard.innerHTML = `
    <div class="section-title">公告信息</div>
    <div class="timeline">
      ${state.student.notifications
        .slice(0, 3)
        .map(
          (notice) => `
            <div class="timeline-item">
              <div class="timeline-item__time">${notice.time}</div>
              <div>
                <div style="font-weight:500; margin-bottom:4px;">${notice.title}</div>
                <div style="color: var(--text-light); font-size: 12px;">${notice.category}</div>
              </div>
            </div>
          `
        )
        .join("")}
    </div>
  `;

  section.appendChild(messageCard);
  section.appendChild(noticeCard);

  return section;
}

function buildNetworkSection(state, navigate, toaster) {
  const card = document.createElement("section");
  card.className = "card";
  const companies = state.teacher.enterpriseAudit.slice(0, 6);
  card.innerHTML = `
    <div class="section-title" style="display:flex; justify-content: space-between; align-items:center;">
      <span>企业对接</span>
      <a href="#teacher/enterprise-review" class="nav-item" style="padding:0;">更多</a>
    </div>
    <div class="grid grid-3">
      ${companies
        .map(
          (enterprise) => `
            <div class="company-card">
              <div class="company-card__logo">${enterprise.company.slice(0, 1)}</div>
              <div style="flex:1;">
                <div style="font-weight:600; margin-bottom:6px;">${enterprise.company}</div>
                <div class="chips">
                  <span class="chip">状态：${enterprise.status}</span>
                  <span class="chip">${enterprise.blacklist ? "黑名单" : "白名单"}</span>
                </div>
                <div style="margin-top:8px; font-size:12px; color: var(--text-light);">材料数量：${enterprise.materials.length}</div>
              </div>
              <div class="info-card__actions" style="flex-direction:column; gap:6px;">
                <button class="button" data-id="${enterprise.id}" data-action="to-teacher">审核</button>
                <button class="button button--outline" data-id="${enterprise.id}" data-action="toggle">切换名单</button>
              </div>
            </div>
          `
        )
        .join("")}
    </div>
  `;

  card.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;
    const action = target.dataset.action;
    const id = target.dataset.id;
    if (!action || !id) return;

    if (action === "to-teacher") {
      navigate("teacher", "enterprise-review", id);
    }
    if (action === "toggle") {
      toaster?.show?.("请在教师端企业考核中操作", { type: "info" });
      navigate("teacher", "enterprise-review", id);
    }
  });

  return card;
}
