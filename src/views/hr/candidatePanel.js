export function renderHrCandidatePanel({ state, actions, toaster }) {
  const candidatesState = state.hr.candidates;
  const stages = candidatesState.stages;
  let filterStage = "";
  let activeId = candidatesState.list[0]?.id || null;
  let activeApplicationId = state.student.applications[0]?.id || null;

  const container = document.createElement("div");
  const header = document.createElement("div");
  header.className = "page-header";
  header.innerHTML = `
    <div>
      <h2 class="section-title" style="margin-bottom:6px;">Candidate workflow panel</h2>
      <p style="color: var(--text-light); font-size: 13px;">Filter candidates on the left, review resumes on the right, and update their stages.</p>
    </div>
    <div class="table-actions">
      <button class="button button--outline">Export resumes</button>
      <button class="button">Bulk invite</button>
    </div>
  `;
  container.appendChild(header);

  const toolbar = document.createElement("div");
  toolbar.className = "filter-bar";
  toolbar.innerHTML = `
    <label style="display:flex; flex-direction:column; gap:6px; font-size:12px; color: var(--text-light);">
      Stage filter
      <select data-role="stage-filter">
        <option value="">All</option>
        ${stages.map((stage) => `<option value="${stage.id}">${stage.label}</option>`).join("")}
      </select>
    </label>
    <input class="input" type="text" placeholder="Search name or role" data-role="keyword" style="flex:1;" />
    <button class="button button--ghost" data-action="reset">Reset</button>
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
      empty.textContent = "No candidates";
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
        <div style="color: var(--text-light); font-size:12px; margin-top:6px;">Updated: ${candidate.updatedAt}</div>
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
    const latestState = window.__careerStore?.getState?.() || state;
    const candidateList = latestState.hr?.candidates?.list || candidatesState.list;
    const candidate = candidateList.find((item) => item.id === activeId);
    if (!candidate) {
      resumeArea.innerHTML = `<div class="empty-state">Select a candidate</div>`;
      return;
    }
    const templates = latestState.hr?.candidates?.templates || candidatesState.templates;
    resumeArea.innerHTML = `
      <div class="page-header" style="margin-bottom:16px;">
        <div>
          <h3 class="section-title" style="margin-bottom:4px;">${candidate.name}</h3>
          <div style="color: var(--text-light); font-size: 13px;">Applied position: ${candidate.job}</div>
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
        <h4 style="font-weight:600; margin-bottom:10px;">Bulk invite templates</h4>
        <div class="data-list">
          ${templates
            .map(
              (tpl) => `<div class="data-row"><span>${tpl.name}</span><button class="button button--ghost button--sm" data-template="${tpl.id}">Send</button></div>`
            )
            .join("")}
        </div>
      </div>
    `;

    resumeArea.addEventListener("click", handleResumeActions, { once: true });
    const applicationsPanel = renderApplicationsSection(latestState);
    resumeArea.appendChild(applicationsPanel);
    const notificationsPanel = renderNotificationsSection(latestState);
    resumeArea.appendChild(notificationsPanel);
  }

  function handleResumeActions(event) {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;
    if (target.dataset.stage) {
      actions.updateCandidateStage(activeId, target.dataset.stage);
      toaster.show("Candidate stage updated", { type: "success" });
      renderResume();
    }
    if (target.dataset.template) {
      toaster.show("Invite template sent", { type: "info" });
    }
  }

  function renderApplicationsSection(latestState) {
    const applications = latestState.student?.applications || state.student.applications;
    if (!applications.length) {
      const emptyCard = document.createElement("section");
      emptyCard.className = "card";
      emptyCard.style.marginTop = "24px";
      emptyCard.innerHTML = `<div class="empty-state">No campus submissions yet</div>`;
      return emptyCard;
    }

    if (!activeApplicationId || !applications.some((app) => app.id === activeApplicationId)) {
      activeApplicationId = applications[0]?.id || null;
    }

    const activeApplication = applications.find((item) => item.id === activeApplicationId) || applications[0];
    const panel = document.createElement("section");
    panel.className = "card";
    panel.style.marginTop = "24px";
    panel.innerHTML = `
      <div class="page-header" style="margin-bottom:12px;">
        <h3 class="section-title" style="margin-bottom:0;">Campus submissions</h3>
        <div style="color: var(--text-light); font-size:12px;">${applications.length} record(s)</div>
      </div>
      <div class="grid grid-2" style="align-items:start;">
        <section>
          <table class="table table--striped">
            <thead>
              <tr>
                <th style="width:160px;">Job</th>
                <th>Candidate</th>
                <th>Status</th>
                <th>Submitted</th>
              </tr>
            </thead>
            <tbody>
              ${applications
                .map((application) => {
                  const isActive = application.id === activeApplicationId;
                  return `
                    <tr data-role="application-row" data-id="${application.id}" style="cursor:pointer; ${
                      isActive ? "background:#edf3ff;" : ""
                    }">
                      <td>${application.jobTitle}</td>
                      <td>${application.candidateName || "Alex Zhang"}</td>
                      <td><span class="badge">${application.status}</span></td>
                      <td>${application.submitDate}</td>
                    </tr>
                  `;
                })
                .join("")}
            </tbody>
          </table>
        </section>
        <section>
          ${renderApplicationDetail(activeApplication)}
        </section>
      </div>
    `;

    panel.querySelectorAll("[data-role='application-row']").forEach((row) => {
      row.addEventListener("click", () => {
        activeApplicationId = row.dataset.id;
        renderResume();
      });
    });

    panel.addEventListener("click", (event) => {
      const target = event.target;
      if (!(target instanceof HTMLElement)) return;
      const action = target.dataset.action;
      const id = target.dataset.id;
      if (!action || !id) return;
      if (action === "set-status") {
        const status = target.dataset.status;
        if (!status) return;
        actions.updateApplicationStatus(id, status, `Marked as ${status} by HR`);
        toaster.show(`Application moved to ${status}`, { type: "success" });
        renderResume();
      }
      if (action === "add-message") {
        const value = prompt("Send a note to the student");
        if (value) {
          actions.appendApplicationMessage(id, value);
          toaster.show("Message recorded", { type: "success" });
          renderResume();
        }
      }
    });

    return panel;
  }

  function renderApplicationDetail(application) {
    if (!application) {
      return `<div class="empty-state">Select a submission</div>`;
    }
    const statusOptions = ["Submitted", "Reviewed", "Interview Invite", "Offer", "Rejected"];
    return `
      <div class="page-header" style="margin-bottom:12px;">
        <div>
          <h4 style="margin-bottom:4px; font-size:15px;">${application.jobTitle}</h4>
          <div style="color: var(--text-light); font-size:12px;">${
            application.candidateName || "Alex Zhang"
          } · ${application.company}</div>
        </div>
        <div class="table-actions">
          ${statusOptions
            .map(
              (status) => `<button class="button button--sm ${status === application.status ? "" : "button--ghost"}" data-action="set-status" data-id="${application.id}" data-status="${status}">${status}</button>`
            )
            .join("")}
        </div>
      </div>
      <div style="margin-bottom:16px;">
        <div style="font-weight:600; margin-bottom:6px;">Timeline</div>
        <div class="timeline">
          ${application.progress
            .map(
              (step) => `
                <div class="timeline-item">
                  <div class="timeline-item__time">${step.time}</div>
                  <div class="timeline-item__content">
                    <div style="font-weight:500;">${step.label}</div>
                    <div style="color: var(--text-light); font-size:12px;">${step.remark}</div>
                  </div>
                </div>
              `
            )
            .join("")}
        </div>
      </div>
      <div style="margin-bottom:16px;">
        <div class="page-header" style="margin-bottom:8px;">
          <h4 style="font-size:14px; font-weight:600; margin-bottom:0;">Messages</h4>
          <button class="button button--ghost button--sm" data-action="add-message" data-id="${application.id}">Add message</button>
        </div>
        ${
          application.messages.length
            ? application.messages
                .map(
                  (msg) => `
                    <div class="message-card">
                      <div style="font-weight:500; margin-bottom:4px;">${msg.sender}</div>
                      <div style="color:#3a4f72;">${msg.content}</div>
                    </div>
                  `
                )
                .join("")
            : `<div class="empty-state" style="height:96px;">No messages yet</div>`
        }
      </div>
      <div>
        <div style="font-weight:600; margin-bottom:6px;">Attachments</div>
        ${
          application.attachments.length
            ? `<div class="attachment-list">${application.attachments
                .map((file) => `<div class="attachment-item"><span>${file.name}</span><span>${file.size || ""}</span></div>`)
                .join("")}</div>`
            : `<div class="empty-state" style="height:96px;">No attachments</div>`
        }
      </div>
    `;
  }

  function renderNotificationsSection(latestState) {
    const notifications = latestState.hr?.notifications || [];
    const card = document.createElement("section");
    card.className = "card";
    card.style.marginTop = "24px";
    card.innerHTML = `
      <div class="page-header" style="margin-bottom:12px;">
        <h3 class="section-title" style="margin-bottom:0;">HR notifications</h3>
        <div class="table-actions">
          <button class="button button--ghost button--sm" data-action="mark-all">Mark all read</button>
        </div>
      </div>
      <div class="list">
        ${
          notifications.length
            ? notifications
                .map(
                  (item) => `
                    <div class="data-row" data-id="${item.id}">
                      <div>
                        <div style="font-weight:600;">${item.title}</div>
                        <div style="color: var(--text-light); font-size:12px;">${item.category || "Info"} · ${item.time}</div>
                      </div>
                      <div class="table-actions">
                        <button class="button button--ghost button--sm" data-action="toggle-read" data-id="${item.id}">${item.read ? "Mark unread" : "Mark read"}</button>
                      </div>
                    </div>
                  `
                )
                .join("")
            : `<div class="empty-state">No notifications</div>`
        }
      </div>
    `;

    card.addEventListener("click", (event) => {
      const target = event.target;
      if (!(target instanceof HTMLElement)) return;
      const action = target.dataset.action;
      if (!action) return;
      if (action === "mark-all") {
        actions.markAllHrNotifications(true);
        toaster.show("All notifications marked as read", { type: "success" });
        renderResume();
      }
      if (action === "toggle-read") {
        const id = target.dataset.id;
        if (!id) return;
        const notification = notifications.find((item) => item.id === id);
        actions.markHrNotification(id, !(notification?.read));
        toaster.show("Notification updated", { type: "info" });
        renderResume();
      }
    });

    return card;
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
