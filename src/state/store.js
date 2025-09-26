import { cloneInitialState, initialState } from "../data/mockData.js";

const STORAGE_KEY = "career-platform-state";

function createEmptySession() {
  return {
    authenticated: false,
    userId: null,
    role: null,
    displayName: null,
    lastLoginAt: null
  };
}

let state = hydrateState();
const listeners = new Set();

function hydrateState() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return cloneInitialState();
    }
    const parsed = JSON.parse(raw);
    return mergeState(cloneInitialState(), parsed);
  } catch (error) {
    console.warn("state hydrate failed", error);
    return cloneInitialState();
  }
}

function mergeState(base, override) {
  if (Array.isArray(base) && Array.isArray(override)) {
    return override;
  }
  if (typeof base === "object" && base && typeof override === "object" && override) {
    const next = { ...base };
    Object.keys(override).forEach((key) => {
      next[key] = mergeState(base[key], override[key]);
    });
    return next;
  }
  return override === undefined ? base : override;
}

function persist() {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.warn("state persist failed", error);
  }
}

function notify() {
  listeners.forEach((listener) => {
    try {
      listener(getState());
    } catch (error) {
      console.error("state listener error", error);
    }
  });
}

function setState(updater) {
  const draft = JSON.parse(JSON.stringify(state));
  const result = updater(draft) || draft;
  state = result;
  persist();
  notify();
  return state;
}

export function getState() {
  return JSON.parse(JSON.stringify(state));
}

export function subscribe(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function ensureApplication(job, applications) {
  const existing = applications.find((item) => item.jobId === job.id);
  if (existing) {
    return existing;
  }
  const now = new Date();
  const record = {
    id: `apply-${job.id}`,
    jobId: job.id,
    jobTitle: job.title,
    company: job.company,
    submitDate: now.toISOString().slice(0, 10),
    status: "Submitted",
    progress: [
      {
        time: now.toISOString().replace("T", " ").slice(0, 16),
        label: "Submitted",
        remark: "Application received"
      }
    ],
    messages: [],
    attachments: []
  };
  applications.unshift(record);
  return record;
}

function addNotification(draft, payload) {
  draft.student.notifications.unshift({
    id: `notify-${Date.now()}`,
    read: false,
    time: new Date().toISOString().replace("T", " ").slice(0, 16),
    ...payload
  });
}

export const actions = {
  login({ username, password }) {
    const nextUsername = (username || "").trim().toLowerCase();
    const current = getState();
    const account = current.accounts.find(
      (item) => item.username.toLowerCase() === nextUsername
    );
    if (!account || account.password !== password) {
      throw new Error("Invalid credentials");
    }
    setState((draft) => {
      draft.session = {
        authenticated: true,
        userId: account.id,
        role: account.role,
        displayName: account.displayName,
        lastLoginAt: new Date().toISOString()
      };
    });
  },

  logout() {
    setState((draft) => {
      draft.session = createEmptySession();
    });
  },

  reset() {
    setState(() => cloneInitialState());
  },

  toggleJobFavorite(jobId) {
    setState((draft) => {
      const job = draft.student.jobs.find((item) => item.id === jobId);
      if (job) {
        job.favorite = !job.favorite;
      }
    });
  },

  applyForJob(jobId) {
    setState((draft) => {
      const job = draft.student.jobs.find((item) => item.id === jobId);
      if (!job) return;
      const record = ensureApplication(job, draft.student.applications);
      record.status = "Submitted";
      record.progress.unshift({
        time: new Date().toISOString().replace("T", " ").slice(0, 16),
        label: "Reapplied",
        remark: "Application record updated"
      });
      addNotification(draft, {
        category: "Application Status",
        title: `${job.company} - ${job.title} submitted successfully`
      });
    });
  },

  updateApplicationStatus(applicationId, status, remark = "Status updated") {
    setState((draft) => {
      const application = draft.student.applications.find((item) => item.id === applicationId);
      if (!application) return;
      application.status = status;
      application.progress.unshift({
        time: new Date().toISOString().replace("T", " ").slice(0, 16),
        label: status,
        remark
      });
    });
  },

  appendApplicationMessage(applicationId, message) {
    if (!message) return;
    setState((draft) => {
      const application = draft.student.applications.find((item) => item.id === applicationId);
      if (!application) return;
      application.messages.unshift({
        sender: "Me",
        content: message
      });
    });
  },

  addApplicationAttachment(applicationId, fileName) {
    if (!fileName) return;
    setState((draft) => {
      const application = draft.student.applications.find((item) => item.id === applicationId);
      if (!application) return;
      application.attachments.push({
        name: fileName,
        size: "Auto generated"
      });
    });
  },

  updateResumeField(stepId, fieldId, value) {
    setState((draft) => {
      const step = draft.student.resume.steps.find((item) => item.id === stepId);
      if (!step) return;
      const field = step.fields.find((item) => item.id === fieldId);
      if (!field) return;
      field.value = value;
      recalcResumeCompleteness(draft.student.resume);
    });
  },

  addResumeAttachment(name) {
    if (!name) return;
    setState((draft) => {
      draft.student.resume.attachments.push({
        id: `att-${Date.now()}`,
        name,
        updatedAt: new Date().toISOString().slice(0, 10)
      });
      recalcResumeCompleteness(draft.student.resume);
    });
  },

  removeResumeAttachment(attachmentId) {
    setState((draft) => {
      draft.student.resume.attachments = draft.student.resume.attachments.filter(
        (item) => item.id !== attachmentId
      );
      recalcResumeCompleteness(draft.student.resume);
    });
  },

  markNotification(id, read = true) {
    setState((draft) => {
      const target = draft.student.notifications.find((item) => item.id === id);
      if (target) {
        target.read = read;
      }
    });
  },

  markAllNotifications(read = true) {
    setState((draft) => {
      draft.student.notifications.forEach((item) => {
        item.read = read;
      });
    });
  },

  toggleActivityRegistration(activityId) {
    setState((draft) => {
      const act = draft.student.activities.find((item) => item.id === activityId);
      if (!act) return;
      const nextStatus = act.status === "Registered" ? "Open" : "Registered";
      act.status = nextStatus;
      addNotification(draft, {
        category: "Activity Reminder",
        title: `${act.title} ${nextStatus === "Registered" ? "registration confirmed" : "registration cancelled"}`
      });
    });
  },

  addStudentActivityFeedback(activityId, guide) {
    setState((draft) => {
      const act = draft.student.activities.find((item) => item.id === activityId);
      if (act) {
        act.guide = guide;
      }
    });
  },

  createJob(payload) {
    setState((draft) => {
      draft.hr.jobs.unshift({
        id: `job${Date.now()}`,
        exposure: 0,
        views: 0,
        applicants: 0,
        status: "Pending",
        publishDate: new Date().toISOString().slice(0, 10),
        ...payload
      });
    });
  },

  updateJob(jobId, changes) {
    setState((draft) => {
      const job = draft.hr.jobs.find((item) => item.id === jobId);
      if (!job) return;
      Object.assign(job, changes);
    });
  },

  duplicateJob(jobId, suffix = "Copy") {
    setState((draft) => {
      const job = draft.hr.jobs.find((item) => item.id === jobId);
      if (!job) return;
      draft.hr.jobs.push({
        ...job,
        id: `${job.id}-${Date.now()}`,
        title: `${job.title} (${suffix})`,
        status: "Pending",
        publishDate: new Date().toISOString().slice(0, 10)
      });
    });
  },

  updateCandidateStage(candidateId, stageId) {
    setState((draft) => {
      const candidate = draft.hr.candidates.list.find((item) => item.id === candidateId);
      if (!candidate) return;
      candidate.stage = stageId;
      candidate.updatedAt = new Date().toISOString().slice(0, 10);
    });
  },

  updateCampusRegistration(changes) {
    setState((draft) => {
      Object.assign(draft.hr.campusEvents.registrationForm, changes);
    });
  },

  addTeacherActivity(activity) {
    setState((draft) => {
      draft.teacher.activities.unshift({
        id: `teach-act-${Date.now()}`,
        status: "Under Review",
        registered: 0,
        ...activity
      });
    });
  },

  updateTeacherApproval(approvalId, status) {
    setState((draft) => {
      const approval = draft.teacher.approvals.find((item) => item.id === approvalId);
      if (!approval) return;
      approval.status = status;
    });
  },

  toggleEnterpriseBlacklist(auditId) {
    setState((draft) => {
      const enterprise = draft.teacher.enterpriseAudit.find((item) => item.id === auditId);
      if (!enterprise) return;
      enterprise.blacklist = !enterprise.blacklist;
    });
  },

  updateEnterpriseStatus(auditId, status) {
    setState((draft) => {
      const enterprise = draft.teacher.enterpriseAudit.find((item) => item.id === auditId);
      if (!enterprise) return;
      enterprise.status = status;
      enterprise.history.unshift({
        date: new Date().toISOString().slice(0, 10),
        result: status
      });
    });
  },

  updateUserRole(userId, roleName) {
    setState((draft) => {
      const user = draft.admin.users.find((item) => item.id === userId);
      if (user) {
        user.role = roleName;
      }
    });
  },

  toggleUserStatus(userId) {
    setState((draft) => {
      const user = draft.admin.users.find((item) => item.id === userId);
      if (user) {
        user.status = user.status === "Enabled" ? "Disabled" : "Enabled";
      }
    });
  },

  addLog(entry) {
    setState((draft) => {
      draft.admin.logs.unshift({
        id: `log-${Date.now()}`,
        time: new Date().toISOString().replace("T", " ").slice(0, 16),
        ...entry
      });
    });
  },

  addAdminRole(role) {
    setState((draft) => {
      const exists = draft.admin.roles.some(
        (item) => item.name.trim().toLowerCase() === (role.name || "").trim().toLowerCase()
      );
      if (exists) return;
      draft.admin.roles.push({
        id: role.id || `role-${Date.now()}`,
        name: role.name || "New Role",
        desc: role.desc || "Custom permissions"
      });
    });
  }
};

function recalcResumeCompleteness(resume) {
  const totalFields = resume.steps.reduce((sum, step) => sum + step.fields.length, 0);
  const filledFields = resume.steps.reduce((sum, step) => {
    return sum + step.fields.filter((field) => field.value && field.value.trim()).length;
  }, 0);
  const attachmentScore = Math.min(resume.attachments.length * 5, 20);
  resume.completeness = Math.min(100, Math.round(((filledFields / totalFields) * 80) + attachmentScore));
}

export function getInitialState() {
  return cloneInitialState();
}

export function debugState() {
  console.table(state);
}

window.__careerStore = { getState, actions, subscribe };
