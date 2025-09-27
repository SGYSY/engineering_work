import { roles } from "./data/mockData.js";
import { t } from "./utils/i18n.js";
import { getState, actions, subscribe } from "./state/store.js";
import { renderStudentJobList } from "./views/student/jobList.js";
import { renderStudentJobDetail } from "./views/student/jobDetail.js";
import { renderStudentApplications } from "./views/student/applications.js";
import { renderStudentResume } from "./views/student/resume.js";
import { renderStudentActivities } from "./views/student/activities.js";
import { renderStudentNotifications } from "./views/student/notifications.js";
import { renderHrJobManagement } from "./views/hr/jobManagement.js";
import { renderHrCandidatePanel } from "./views/hr/candidatePanel.js";
import { renderHrCampusEvents } from "./views/hr/campusEvents.js";
import { renderTeacherActivityManagement } from "./views/teacher/activityManagement.js";
import { renderTeacherEmploymentDashboard } from "./views/teacher/employmentDashboard.js";
import { renderTeacherEnterpriseAudit } from "./views/teacher/enterpriseAudit.js";
import { renderAdminUserRole } from "./views/admin/userRole.js";
import { renderAdminOperationLog } from "./views/admin/operationLog.js";
import { renderAdminTeacherPanel } from "./views/admin/teacherPanel.js";
import { renderAdminHrPanel } from "./views/admin/hrPanel.js";
import { mountToaster } from "./components/toast.js";
import { renderDemoGuide } from "./components/demoGuide.js";
import { renderLogin } from "./views/auth/login.js";

const roleNav = document.getElementById("role-nav");
const sectionNav = document.getElementById("section-nav");
const appRoot = document.getElementById("app-root");
const topbarUser = document.querySelector(".topbar__user");
const userNameEl = topbarUser?.querySelector(".user-name");
const logoutButton = document.getElementById("logout-btn");
const toaster = mountToaster();

const registry = {
  "student/job-list": renderStudentJobList,
  "student/job-detail": renderStudentJobDetail,
  "student/applications": renderStudentApplications,
  "student/resume": renderStudentResume,
  "student/activities": renderStudentActivities,
  "student/notifications": renderStudentNotifications,
  "hr/job-management": renderHrJobManagement,
  "hr/candidate-panel": renderHrCandidatePanel,
  "hr/campus-events": renderHrCampusEvents,
  "teacher/activity-review": renderTeacherActivityManagement,
  "teacher/employment-dashboard": renderTeacherEmploymentDashboard,
  "teacher/enterprise-review": renderTeacherEnterpriseAudit,
  "admin/user-role": renderAdminUserRole,
  "admin/operation-log": renderAdminOperationLog,
  "admin/teacher-admin": renderAdminTeacherPanel,
  "admin/hr-admin": renderAdminHrPanel
};

let lastRouteKey = "";
let activeRoleId = null;

function buildRoleNav(roleId) {
  if (!roleNav) return;
  roleNav.innerHTML = "";
  if (!roleId) {
    roleNav.style.display = "none";
    return;
  }
  const role = roles.find((item) => item.id === roleId);
  const item = document.createElement("span");
  item.className = "nav-item active";
  item.textContent = t(role?.label || roleId);
  roleNav.appendChild(item);
  roleNav.style.display = "flex";
}

function buildSectionNav(roleId, activeViewId) {
  sectionNav.innerHTML = "";
  const role = roles.find((item) => item.id === roleId);
  if (!role) return;
  role.routes.forEach((route) => {
    const link = document.createElement("a");
    link.href = `#${roleId}/${route.id}`;
  link.textContent = t(route.label);
    link.className = "nav-item";
    link.dataset.view = route.id;
    if (route.id === activeViewId) {
      link.classList.add("active");
    }
    sectionNav.appendChild(link);
  });
}

function parseRoute(hash, sessionRoleId) {
  const path = hash.replace("#", "").trim();
  const segments = path ? path.split("/") : [];
  let roleId = segments[0] || sessionRoleId || roles[0].id;
  const role = roles.find((item) => item.id === roleId) || roles[0];
  if (sessionRoleId && roleId !== sessionRoleId) {
    roleId = sessionRoleId;
  }
  const defaultView = role.routes[0].id;
  const viewId = segments[1] || defaultView;
  const param = segments[2] || null;
  return { roleId: role.id, viewId, param };
}

function normalizeRoute({ roleId, viewId, param }, sessionRoleId) {
  const targetRoleId = sessionRoleId || roleId;
  const role = roles.find((item) => item.id === targetRoleId) || roles[0];
  const routeExists = role.routes.some((route) => route.id === viewId);
  const safeView = routeExists ? viewId : role.routes[0].id;
  return { roleId: role.id, viewId: safeView, param };
}

function renderRoute(session) {
  if (!session?.role) return;
  const parsed = parseRoute(window.location.hash, session.role);
  const { roleId, viewId, param } = normalizeRoute(parsed, session.role);
  const hashPath = param ? `#${roleId}/${viewId}/${param}` : `#${roleId}/${viewId}`;
  if (window.location.hash !== hashPath) {
    window.location.hash = hashPath;
    return;
  }

  buildSectionNav(roleId, viewId);

  const key = `${roleId}/${viewId}`;
  const render = registry[key];
  const currentState = getState();
  appRoot.innerHTML = "";
  if (typeof render === "function") {
    const view = render({ state: currentState, actions, param, navigate, toaster });
    const wrapper = document.createElement("div");
    wrapper.className = "view-shell";
    const guide = renderDemoGuide(roleId, viewId);
    if (guide) {
      wrapper.appendChild(guide);
    }
    if (view instanceof HTMLElement) {
      wrapper.appendChild(view);
    } else if (typeof view === "string") {
      const container = document.createElement("div");
      container.innerHTML = view;
      wrapper.appendChild(container);
    }
    appRoot.appendChild(wrapper);
  }
  lastRouteKey = key;
}

function navigate(roleId, viewId, param) {
  const targetRole = roleId || activeRoleId;
  if (!targetRole) return;
  const target = param ? `#${targetRole}/${viewId}/${param}` : `#${targetRole}/${viewId}`;
  window.location.hash = target;
}

function renderApp() {
  const state = getState();
  const session = state.session;
  const authenticated = Boolean(session?.authenticated && session.role);

  if (!authenticated) {
    activeRoleId = null;
    if (roleNav) {
      roleNav.innerHTML = "";
      roleNav.style.display = "none";
    }
    sectionNav.innerHTML = "";
    sectionNav.style.display = "none";
    if (logoutButton) {
      logoutButton.style.display = "none";
    }
    if (userNameEl) {
      userNameEl.textContent = "Guest";
    }
    appRoot.innerHTML = "";
    const loginView = renderLogin({ state, actions, toaster });
    appRoot.appendChild(loginView);
    return;
  }

  const roleExists = roles.some((item) => item.id === session.role);
  if (!roleExists) {
    actions.logout();
    window.location.hash = "";
    toaster.show(t("Session reset for demo"), { type: "info" });
    return;
  }
  activeRoleId = session.role;
  buildRoleNav(session.role);
  sectionNav.style.display = "flex";
  if (logoutButton) {
    logoutButton.style.display = "inline-flex";
  }
  if (userNameEl) {
    userNameEl.textContent = session.displayName || t(session.role);
  }

  const role = roles.find((item) => item.id === session.role) || roles[0];
  const defaultView = role.routes[0]?.id;
  if (!window.location.hash || !window.location.hash.startsWith(`#${session.role}/`)) {
    window.location.hash = `#${role.id}/${defaultView}`;
  }
  renderRoute(session);
}

window.addEventListener("hashchange", () => {
  const state = getState();
  if (!state.session?.authenticated) {
    return;
  }
  renderRoute(state.session);
});

if (logoutButton) {
  logoutButton.addEventListener("click", () => {
    actions.logout();
    window.location.hash = "";
    toaster.show("Signed out", { type: "info" });
  });
}

subscribe(() => {
  const state = getState();
  if (!state.session?.authenticated) {
    renderApp();
    return;
  }
  const parsed = parseRoute(window.location.hash, state.session.role);
  const { roleId, viewId } = normalizeRoute(parsed, state.session.role);
  const key = `${roleId}/${viewId}`;
  if (key === lastRouteKey) {
    renderRoute(state.session);
  } else {
    renderApp();
  }
});

renderApp();
