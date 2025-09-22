import { roles } from "./data/mockData.js";
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

const roleNav = document.getElementById("role-nav");
const sectionNav = document.getElementById("section-nav");
const appRoot = document.getElementById("app-root");
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

function buildRoleNav() {
  roleNav.innerHTML = "";
  roles.forEach((role) => {
    const link = document.createElement("a");
    link.href = `#${role.id}/${role.routes[0].id}`;
    link.textContent = role.label;
    link.className = "nav-item";
    link.dataset.role = role.id;
    roleNav.appendChild(link);
  });
}

function buildSectionNav(roleId, activeViewId) {
  sectionNav.innerHTML = "";
  const role = roles.find((item) => item.id === roleId);
  if (!role) return;
  role.routes.forEach((route) => {
    const link = document.createElement("a");
    link.href = `#${roleId}/${route.id}`;
    link.textContent = route.label;
    link.className = "nav-item";
    link.dataset.view = route.id;
    if (route.id === activeViewId) {
      link.classList.add("active");
    }
    sectionNav.appendChild(link);
  });
}

function setActiveRole(roleId) {
  const links = roleNav.querySelectorAll(".nav-item");
  links.forEach((link) => {
    if (link.dataset.role === roleId) {
      link.classList.add("active");
    } else {
      link.classList.remove("active");
    }
  });
}

function parseRoute(hash) {
  const path = hash.replace("#", "").trim();
  const segments = path ? path.split("/") : [];
  const roleId = segments[0] || roles[0].id;
  const role = roles.find((item) => item.id === roleId) || roles[0];
  const defaultView = role.routes[0].id;
  const viewId = segments[1] || defaultView;
  const param = segments[2] || null;
  return { roleId: role.id, viewId, param };
}

function normalizeRoute({ roleId, viewId, param }) {
  const role = roles.find((item) => item.id === roleId) || roles[0];
  const routeExists = role.routes.some((route) => route.id === viewId);
  const safeView = routeExists ? viewId : role.routes[0].id;
  return { roleId: role.id, viewId: safeView, param };
}

function renderRoute() {
  const parsed = parseRoute(window.location.hash);
  const { roleId, viewId, param } = normalizeRoute(parsed);
  const hashPath = param ? `#${roleId}/${viewId}/${param}` : `#${roleId}/${viewId}`;
  if (window.location.hash !== hashPath) {
    window.location.hash = hashPath;
    return;
  }

  setActiveRole(roleId);
  buildSectionNav(roleId, viewId);

  const key = `${roleId}/${viewId}`;
  const render = registry[key];
  const currentState = getState();
  appRoot.innerHTML = "";
  if (typeof render === "function") {
    const view = render({ state: currentState, actions, param, navigate, toaster });
    if (view instanceof HTMLElement) {
      appRoot.appendChild(view);
    } else if (typeof view === "string") {
      appRoot.innerHTML = view;
    }
  }
  lastRouteKey = key;
}

function navigate(roleId, viewId, param) {
  const target = param ? `#${roleId}/${viewId}/${param}` : `#${roleId}/${viewId}`;
  window.location.hash = target;
}

buildRoleNav();
window.addEventListener("hashchange", renderRoute);
subscribe(() => {
  const { roleId, viewId } = normalizeRoute(parseRoute(window.location.hash));
  const key = `${roleId}/${viewId}`;
  if (key === lastRouteKey) {
    renderRoute();
  }
});
renderRoute();
