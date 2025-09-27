import { cloneInitialState, roles } from "../data/mockData.js";

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

let state = sanitizeState(hydrateState());
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
  state = sanitizeState(result);
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

function addHrNotification(draft, payload) {
  draft.hr.notifications = draft.hr.notifications || [];
  draft.hr.notifications.unshift({
    id: `hr-notify-${Date.now()}`,
    read: false,
    time: new Date().toISOString().replace("T", " ").slice(0, 16),
    ...payload
  });
}

function pushLog(draft, entry) {
  draft.admin.logs.unshift({
    id: `log-${Date.now()}`,
    time: new Date().toISOString().replace("T", " ").slice(0, 16),
    module: entry.module || "General",
    actor: entry.actor || getActorName(draft),
    action: entry.action || "Updated",
    target: entry.target || "-",
    ip: entry.ip || "-"
  });
}

function getActorName(draft) {
  if (draft.session?.displayName) return draft.session.displayName;
  if (draft.session?.role) return draft.session.role;
  return "System";
}

function generatePassword(length = 10) {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789";
  let result = "";
  for (let index = 0; index < length; index += 1) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
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
    if (account.disabled) {
      throw new Error("Account disabled, contact administrator");
    }
    setState((draft) => {
      draft.session = {
        authenticated: true,
        userId: account.id,
        role: account.role,
        displayName: account.displayName,
        lastLoginAt: new Date().toISOString()
      };
      pushLog(draft, {
        module: "Auth",
        action: "Signed in",
        target: account.username
      });
    });
  },

  logout() {
    setState((draft) => {
      pushLog(draft, {
        module: "Auth",
        action: "Signed out",
        target: draft.session?.displayName || draft.session?.role || "Session"
      });
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
      record.candidateName = draft.session.displayName || "Student";
      addNotification(draft, {
        category: "Application Status",
        title: `${job.company} - ${job.title} submitted successfully`
      });
      addHrNotification(draft, {
        category: "Application",
        title: `${record.candidateName} submitted ${job.title}`,
        jobId: job.id
      });
      pushLog(draft, {
        module: "Application",
        action: "Submitted application",
        target: `${job.title} @ ${job.company}`
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
      addNotification(draft, {
        category: "Application Status",
        title: `${application.jobTitle} ${status}`
      });
      addHrNotification(draft, {
        category: "Application",
        title: `${application.jobTitle} marked as ${status}`,
        jobId: application.jobId
      });
      pushLog(draft, {
        module: "Application",
        action: `Updated status to ${status}`,
        target: `${application.jobTitle}`
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

  addApplicationAttachment(applicationId, payload) {
    if (!payload) return;
    setState((draft) => {
      const application = draft.student.applications.find((item) => item.id === applicationId);
      if (!application) return;
      let attachment;
      if (typeof payload === "string") {
        attachment = {
          id: `att-${Date.now()}`,
          name: payload,
          size: "Auto generated",
          uploadedAt: new Date().toISOString()
        };
      } else {
        const generatedId = `att-${Date.now()}`;
        attachment = {
          id: payload.id || generatedId,
          name: payload.name || "Attachment.pdf",
          size: payload.size || "Auto generated",
          type: payload.type || "application/pdf",
          url: payload.url || null,
          uploadedAt: payload.uploadedAt || new Date().toISOString()
        };
      }
      application.attachments.push(attachment);
    });
  },

  removeApplicationAttachment(applicationId, attachmentId, index = null) {
    setState((draft) => {
      const application = draft.student.applications.find((item) => item.id === applicationId);
      if (!application) return;
      if (attachmentId) {
        const before = application.attachments.length;
        application.attachments = application.attachments.filter((item) => item.id !== attachmentId);
        if (before !== application.attachments.length) {
          return;
        }
      }
      if (index !== null && index !== undefined) {
        const idx = Number(index);
        if (Number.isInteger(idx) && idx >= 0 && idx < application.attachments.length) {
          application.attachments.splice(idx, 1);
        }
      }
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
      const teacherActivity = draft.teacher.activities.find(
        (item) => item.linkedActivityId === activityId || item.id === activityId
      );
      if (teacherActivity) {
        if (nextStatus === "Registered") {
          teacherActivity.registered = Math.min(
            teacherActivity.capacity,
            (teacherActivity.registered || 0) + 1
          );
        } else {
          teacherActivity.registered = Math.max(0, (teacherActivity.registered || 1) - 1);
        }
      }
      pushLog(draft, {
        module: "Activity",
        action: `${nextStatus === "Registered" ? "Registered for" : "Cancelled"} activity`,
        target: act.title
      });
    });
  },

  addStudentActivityFeedback(activityId, guide) {
    setState((draft) => {
      const act = draft.student.activities.find((item) => item.id === activityId);
      if (act) {
        act.guide = guide;
        pushLog(draft, {
          module: "Activity",
          action: "Updated onsite guide",
          target: act.title
        });
      }
    });
  },

  createJob(payload) {
    setState((draft) => {
      const jobId = payload.id || `job${Date.now()}`;
      const job = {
        id: jobId,
        title: payload.title || "New position",
        type: payload.type || "Full-time",
        status: payload.status || "Pending",
        exposure: payload.exposure || 0,
        views: payload.views || 0,
        applicants: payload.applicants || 0,
        publishDate: payload.publishDate || new Date().toISOString().slice(0, 10),
        city: payload.city || "",
        salary: payload.salary || "Negotiable",
        deadline: payload.deadline || "",
        description:
          payload.description ||
          "Please add a description so students understand the expectations."
      };
      draft.hr.jobs.unshift(job);
      pushLog(draft, {
        module: "Job",
        action: "Created job",
        target: job.title
      });
    });
  },

  updateJob(jobId, changes) {
    setState((draft) => {
      const job = draft.hr.jobs.find((item) => item.id === jobId);
      if (!job) return;
      Object.assign(job, changes);
      pushLog(draft, {
        module: "Job",
        action: "Updated job",
        target: job.title
      });
    });
  },

  duplicateJob(jobId, suffix = "Copy") {
    setState((draft) => {
      const job = draft.hr.jobs.find((item) => item.id === jobId);
      if (!job) return;
      const clone = {
        ...job,
        id: `${job.id}-${Date.now()}`,
        title: `${job.title} (${suffix})`,
        status: "Pending",
        publishDate: new Date().toISOString().slice(0, 10)
      };
      draft.hr.jobs.push(clone);
      pushLog(draft, {
        module: "Job",
        action: "Duplicated job",
        target: clone.title
      });
    });
  },

  deleteJob(jobId) {
    setState((draft) => {
      const index = draft.hr.jobs.findIndex((item) => item.id === jobId);
      if (index === -1) return;
      const [removed] = draft.hr.jobs.splice(index, 1);
      pushLog(draft, {
        module: "Job",
        action: "Deleted job",
        target: removed?.title || jobId
      });
    });
  },

  updateCandidateStage(candidateId, stageId) {
    setState((draft) => {
      const candidate = draft.hr.candidates.list.find((item) => item.id === candidateId);
      if (!candidate) return;
      candidate.stage = stageId;
      candidate.updatedAt = new Date().toISOString().slice(0, 10);
      const stage = draft.hr.candidates.stages.find((item) => item.id === stageId);
      addHrNotification(draft, {
        category: "Pipeline",
        title: `${candidate.name} moved to ${stage?.label || stageId}`
      });
      pushLog(draft, {
        module: "Candidate",
        action: `Stage set to ${stage?.label || stageId}`,
        target: candidate.name
      });
    });
  },

  updateCampusRegistration(changes) {
    setState((draft) => {
      Object.assign(draft.hr.campusEvents.registrationForm, changes);
      pushLog(draft, {
        module: "Campus",
        action: "Saved registration draft",
        target: draft.hr.campusEvents.registrationForm.company
      });
    });
  },

  submitCampusRegistration(changes = {}) {
    setState((draft) => {
      Object.assign(draft.hr.campusEvents.registrationForm, changes);
      const form = draft.hr.campusEvents.registrationForm;
      form.status = "Reviewing";
      const approvalId = `approval-${Date.now()}`;
      draft.teacher.approvals.unshift({
        id: approvalId,
        company: form.company,
        requestAt: new Date().toISOString().slice(0, 10),
        type: form.boothType || "Campus Event",
        boothNeed: form.boothType || "Standard",
        status: "Pending",
        linkedFormId: approvalId,
        remark: form.remark || ""
      });
      addHrNotification(draft, {
        category: "Campus",
        title: `${form.company} registration submitted`
      });
      pushLog(draft, {
        module: "Campus",
        action: "Submitted campus registration",
        target: form.company
      });
    });
  },

  addTeacherActivity(activity) {
    setState((draft) => {
      const teacherId = activity.id || `teach-act-${Date.now()}`;
      const studentId = activity.linkedActivityId || `act-${Date.now()}`;
      const teacherActivity = {
        id: teacherId,
        title: activity.title || "Untitled activity",
        date: activity.date || "TBD",
        location: activity.location || "TBD",
        capacity: activity.capacity || 0,
        registered: activity.registered || 0,
        status: activity.status || "Under Review",
        linkedActivityId: studentId
      };
      draft.teacher.activities.unshift(teacherActivity);
      draft.student.activities.unshift({
        id: studentId,
        type: activity.type || "Campus Activity",
        title: teacherActivity.title,
        date: teacherActivity.date,
        location: teacherActivity.location,
        status: "Open",
        guide: activity.desc || "Counselor will release onsite instructions soon.",
        linkedTeacherId: teacherId
      });
      pushLog(draft, {
        module: "Activity",
        action: "Created campus activity",
        target: teacherActivity.title
      });
    });
  },

  updateTeacherApproval(approvalId, status) {
    setState((draft) => {
      const approval = draft.teacher.approvals.find((item) => item.id === approvalId);
      if (!approval) return;
      approval.status = status;
      approval.reviewedAt = new Date().toISOString().slice(0, 10);
      if (approval.linkedFormId) {
        draft.hr.campusEvents.registrationForm.status = status;
      }
      addHrNotification(draft, {
        category: "Campus",
        title: `${approval.company} ${status}`
      });
      pushLog(draft, {
        module: "Campus",
        action: `Marked ${status}`,
        target: approval.company
      });
    });
  },

  regenerateCheckinQr() {
    let latest = null;
    setState((draft) => {
      const checkin = draft.teacher.checkin;
      if (!checkin) return;
      const token = generatePassword(8).toUpperCase();
      const data = `https://career.univ.edu/checkin/${token}`;
      checkin.qrData = data;
      checkin.updatedAt = new Date().toISOString();
      latest = data;
      pushLog(draft, {
        module: "Activity",
        action: "Regenerated check-in QR",
        target: token
      });
    });
    return latest;
  },

  toggleEnterpriseBlacklist(auditId) {
    setState((draft) => {
      const enterprise = draft.teacher.enterpriseAudit.find((item) => item.id === auditId);
      if (!enterprise) return;
      enterprise.blacklist = !enterprise.blacklist;
      pushLog(draft, {
        module: "Enterprise",
        action: enterprise.blacklist ? "Added to blacklist" : "Removed from blacklist",
        target: enterprise.company
      });
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
      pushLog(draft, {
        module: "Enterprise",
        action: `Review ${status}`,
        target: enterprise.company
      });
    });
  },

  updateUserRole(userId, roleName, platformRole) {
    setState((draft) => {
      const user = draft.admin.users.find((item) => item.id === userId);
      if (!user) return;
      user.role = roleName;
      if (platformRole) {
        user.platformRole = platformRole;
      }
      const account = draft.accounts.find(
        (item) => item.userId === userId || item.username === user.username
      );
      if (account && platformRole) {
        account.role = platformRole;
      }
      pushLog(draft, {
        module: "User",
        action: `Updated role to ${roleName}`,
        target: user.name
      });
    });
  },

  toggleUserStatus(userId) {
    setState((draft) => {
      const user = draft.admin.users.find((item) => item.id === userId);
      if (user) {
        user.status = user.status === "Enabled" ? "Disabled" : "Enabled";
        const account = draft.accounts.find(
          (item) => item.userId === userId || item.username === user.username
        );
        if (account) {
          account.disabled = user.status !== "Enabled";
        }
        pushLog(draft, {
          module: "User",
          action: `${user.status === "Enabled" ? "Enabled" : "Disabled"} account`,
          target: user.name
        });
      }
    });
  },

  addLog(entry) {
    setState((draft) => {
      pushLog(draft, entry);
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
      pushLog(draft, {
        module: "User",
        action: "Created role",
        target: role.name || "New Role"
      });
    });
  },

  createPlatformUser(payload) {
    const username = (payload.username || "").trim();
    const password = (payload.password || "").trim();
    if (!username || !password) {
      throw new Error("Username and password are required");
    }
    const normalized = username.toLowerCase();
    const current = getState();
    const usernameTaken = current.accounts.some(
      (account) => account.username.toLowerCase() === normalized
    );
    if (usernameTaken) {
      throw new Error("Username already exists");
    }
    setState((draft) => {
      const userId = payload.id || `user-${Date.now()}`;
      const platformRole = payload.platformRole || "admin";
      const record = {
        id: userId,
        username,
        name: payload.name || username,
        role: payload.role || "System User",
        department: payload.department || "",
        email: payload.email || "",
        status: payload.status || "Enabled",
        platformRole
      };
      draft.admin.users.unshift(record);
      draft.accounts.push({
        id: `acct-${Date.now()}`,
        username,
        password,
        role: platformRole,
        displayName: record.name,
        disabled: record.status !== "Enabled",
        userId
      });
      pushLog(draft, {
        module: "User",
        action: "Created user",
        target: record.name
      });
    });
  },

  updateAdminUser(userId, changes) {
    const nextUsername = changes.username ? changes.username.trim() : null;
    if (nextUsername) {
      const normalized = nextUsername.toLowerCase();
      const current = getState();
      const usernameTaken = current.accounts.some((account) => {
        if (account.userId === userId) return false;
        return account.username.toLowerCase() === normalized;
      });
      if (usernameTaken) {
        throw new Error("Username already exists");
      }
    }
    setState((draft) => {
      const user = draft.admin.users.find((item) => item.id === userId);
      if (!user) return;
      const account = draft.accounts.find(
        (item) => item.userId === userId || item.username === user.username
      );
      if (nextUsername) {
        if (account) {
          account.username = nextUsername;
        }
        user.username = nextUsername;
      }
      if (changes.name) {
        user.name = changes.name;
        if (account) {
          account.displayName = changes.name;
        }
      }
      if (changes.role) {
        user.role = changes.role;
      }
      if (changes.department !== undefined) {
        user.department = changes.department;
      }
      if (changes.email !== undefined) {
        user.email = changes.email;
      }
      if (changes.status) {
        user.status = changes.status;
        if (account) {
          account.disabled = changes.status !== "Enabled";
        }
      }
      if (changes.platformRole && account) {
        user.platformRole = changes.platformRole;
        account.role = changes.platformRole;
      }
      pushLog(draft, {
        module: "User",
        action: "Updated user",
        target: user.name
      });
    });
  },

  resetUserPassword(userId) {
    const newPassword = generatePassword();
    let updated = false;
    setState((draft) => {
      const account = draft.accounts.find((item) => item.userId === userId);
      if (!account) return;
      account.password = newPassword;
      updated = true;
      pushLog(draft, {
        module: "User",
        action: "Reset password",
        target: account.displayName || account.username
      });
    });
    return updated ? newPassword : null;
  },

  markHrNotification(id, read = true) {
    setState((draft) => {
      const notification = draft.hr.notifications.find((item) => item.id === id);
      if (notification) {
        notification.read = read;
      }
    });
  },

  markAllHrNotifications(read = true) {
    setState((draft) => {
      draft.hr.notifications.forEach((item) => {
        item.read = read;
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

function sanitizeState(snapshot) {
  const draft = deepClone(snapshot || {});
  const baseline = cloneInitialState();

  const roleValid =
    draft.session &&
    draft.session.role &&
    roles.some((item) => item.id === draft.session.role);
  if (!roleValid) {
    draft.session = createEmptySession();
  }
  if (
    !Array.isArray(draft.accounts) ||
    !draft.accounts.some((account) => account && account.username && account.role)
  ) {
    draft.accounts = baseline.accounts;
  }

  draft.student = sanitizeStudentSlice(draft.student, baseline.student);
  draft.teacher = sanitizeTeacherSlice(draft.teacher, baseline.teacher);
  draft.hr = sanitizeHrSlice(draft.hr, baseline.hr);
  draft.admin = sanitizeAdminSlice(draft.admin, baseline.admin);

  return draft;
}

function sanitizeStudentSlice(current = {}, baseline = {}) {
  const next = { ...deepClone(baseline), ...deepClone(current) };
  next.jobs = ensureList(current?.jobs, baseline?.jobs, isValidStudentJob);
  next.applications = ensureList(current?.applications, baseline?.applications, isValidStudentApplication);
  next.activities = ensureList(current?.activities, baseline?.activities, isValidStudentActivity);
  next.notifications = ensureList(current?.notifications, baseline?.notifications, isValidNotification);
  next.resume = sanitizeResume(current?.resume, baseline?.resume);
  return next;
}

function sanitizeTeacherSlice(current = {}, baseline = {}) {
  const next = { ...deepClone(baseline), ...deepClone(current) };
  next.enterpriseAudit = ensureList(current?.enterpriseAudit, baseline?.enterpriseAudit, isValidEnterpriseAudit);
  next.activities = ensureList(current?.activities, baseline?.activities, isValidTeacherActivity);
  next.approvals = ensureList(current?.approvals, baseline?.approvals, isValidTeacherApproval);
  next.exports = ensureList(current?.exports, baseline?.exports, isValidTeacherExport);
  next.checkin = deepClone(current?.checkin) || deepClone(baseline?.checkin);
  if (!next.employmentDashboard) {
    next.employmentDashboard = deepClone(baseline?.employmentDashboard);
  }
  return next;
}

function sanitizeHrSlice(current = {}, baseline = {}) {
  const next = { ...deepClone(baseline), ...deepClone(current) };
  next.jobs = ensureList(current?.jobs, baseline?.jobs, isValidHrJob);
  next.notifications = ensureList(current?.notifications, baseline?.notifications, isValidNotification);
  next.candidates = sanitizeHrCandidates(current?.candidates, baseline?.candidates);
  next.campusEvents = deepClone(current?.campusEvents) || deepClone(baseline?.campusEvents);
  return next;
}

function sanitizeAdminSlice(current = {}, baseline = {}) {
  const next = { ...deepClone(baseline), ...deepClone(current) };
  next.users = ensureList(current?.users, baseline?.users, isValidAdminUser);
  next.roles = ensureList(current?.roles, baseline?.roles, isValidAdminRole);
  next.logs = ensureList(current?.logs, baseline?.logs, isValidAdminLog);
  return next;
}

function sanitizeHrCandidates(current = {}, baseline = {}) {
  const result = { ...deepClone(baseline), ...deepClone(current) };
  result.list = ensureList(current?.list, baseline?.list, isValidHrCandidate);
  result.stages = ensureList(current?.stages, baseline?.stages, Boolean);
  result.templates = ensureList(current?.templates, baseline?.templates, Boolean);
  return result;
}

function ensureList(currentList, fallbackList, predicate) {
  const currentValid = Array.isArray(currentList) ? currentList.filter(predicate) : [];
  if (currentValid.length) {
    return currentValid.map(deepClone);
  }
  const fallbackValid = Array.isArray(fallbackList) ? fallbackList.filter(predicate) : [];
  return fallbackValid.map(deepClone);
}

function sanitizeResume(current, baseline) {
  if (!current || typeof current !== "object") {
    return deepClone(baseline);
  }
  const next = deepClone(current);
  next.attachments = ensureList(current.attachments, baseline?.attachments, isValidResumeAttachment);
  next.steps = Array.isArray(current.steps) && current.steps.length ? deepClone(current.steps) : deepClone(baseline?.steps);
  return next;
}

function isValidStudentJob(item) {
  return Boolean(item && item.id && item.title && item.company && item.city);
}

function isValidStudentApplication(item) {
  return Boolean(item && item.id && item.jobTitle && item.company);
}

function isValidStudentActivity(item) {
  return Boolean(item && item.id && item.title && item.date && item.location);
}

function isValidNotification(item) {
  return Boolean(item && item.id && item.title && item.category);
}

function isValidEnterpriseAudit(item) {
  return Boolean(item && item.id && item.company);
}

function isValidTeacherActivity(item) {
  return Boolean(item && item.id && item.title && item.date && item.location);
}

function isValidTeacherApproval(item) {
  return Boolean(item && item.id && item.company && item.type);
}

function isValidTeacherExport(item) {
  return Boolean(item && item.id && item.label);
}

function isValidHrJob(item) {
  return Boolean(item && item.id && item.title && item.type && item.city);
}

function isValidHrCandidate(item) {
  return Boolean(item && item.id && item.name && item.job);
}

function isValidResumeAttachment(item) {
  return Boolean(item && item.id && item.name);
}

function isValidAdminUser(item) {
  return Boolean(item && item.id && item.username && item.name && item.role);
}

function isValidAdminRole(item) {
  return Boolean(item && item && item.id && item.name);
}

function isValidAdminLog(item) {
  return Boolean(item && item.id && item.actor && item.module && item.time);
}

function deepClone(value) {
  if (value === undefined) return undefined;
  return JSON.parse(JSON.stringify(value));
}
