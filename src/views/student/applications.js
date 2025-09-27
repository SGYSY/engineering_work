import { t } from "../../utils/i18n.js";

export function renderStudentApplications({ state, actions, toaster }) {
  const container = document.createElement("div");
  let applications = Array.isArray(state.student?.applications) ? [...state.student.applications] : [];
  let activeId = applications[0]?.id || null;

  const header = document.createElement("div");
  header.className = "page-header";
  header.innerHTML = `
    <div>
      <h2 class="section-title" style="margin-bottom:6px;">${t("My Applications")}</h2>
      <p style="color: var(--text-light); font-size: 13px;">${t("Review application history, sync statuses, and leave supporting notes.")}</p>
    </div>
    <div class="table-actions">
      <button class="button button--outline" data-action="export">${t("Export Records")}</button>
      <button class="button" data-action="refresh">${t("Sync Latest Status")}</button>
      <button class="button button--ghost" data-action="simulate">${t("Simulate HR Update")}</button>
    </div>
  `;
  container.appendChild(header);

  const layout = document.createElement("div");
  layout.className = "grid grid-2";
  layout.style.alignItems = "start";

  const listCard = document.createElement("section");
  listCard.className = "card";
  listCard.innerHTML = `
    <h3 class="section-title">${t("投递列表")}</h3>
    <table class="table table--striped">
      <thead>
        <tr>
          <th>${t("岗位名称")}</th>
          <th>${t("企业")}</th>
          <th>${t("投递时间")}</th>
          <th>${t("当前状态")}</th>
        </tr>
      </thead>
      <tbody></tbody>
    </table>
  `;
  const tbody = listCard.querySelector("tbody");

  const detailCard = document.createElement("section");
  detailCard.className = "card";

  layout.appendChild(listCard);
  layout.appendChild(detailCard);
  container.appendChild(layout);

  function syncApplications() {
    const latestState = window.__careerStore?.getState?.();
    if (latestState?.student?.applications) {
      applications = latestState.student.applications;
      if (!applications.some((item) => item.id === activeId)) {
        activeId = applications[0]?.id || null;
      }
    }
  }

  function renderTable() {
    syncApplications();
    tbody.innerHTML = "";

    applications.forEach((item) => {
      if (!item) return;
      const statusKey = (item.status || "").toLowerCase();
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${item.jobTitle}</td>
        <td>${item.company}</td>
        <td>${item.submitDate}</td>
        <td><span class="badge ${statusKey.includes("offer") ? "badge--success" : ""}">${t(item.status || "-")}</span></td>
      `;
      tr.style.cursor = "pointer";
      if (item.id === activeId) {
        tr.style.background = "#edf3ff";
      }
      tr.addEventListener("click", () => {
        activeId = item.id;
        renderTable();
        renderDetail();
      });
      tbody.appendChild(tr);
    });

    if (!applications.length) {
      const empty = document.createElement("tr");
      empty.innerHTML = `<td colspan="4" style="text-align:center; padding:24px; color: var(--text-light);">${t("暂无投递记录")}</td>`;
      tbody.appendChild(empty);
    }
  }

  function renderDetail() {
    syncApplications();
    const current = applications.find((item) => item.id === activeId);
    if (!current) {
      detailCard.innerHTML = `<div class="empty-state">${t("请选择投递记录")}</div>`;
      return;
    }

    const progress = Array.isArray(current.progress) ? current.progress : [];
    const timelineHtml = progress
      .map(
        (step) => `
          <div class="timeline-item">
            <div class="timeline-item__time">${step.time}</div>
            <div class="timeline-item__content">
              <div style="font-weight:500; margin-bottom:4px;">${t(step.label)}</div>
              <div style="color: var(--text-light); font-size:12px;">${t(step.remark)}</div>
            </div>
          </div>
        `
      )
      .join("");

    const messages = Array.isArray(current.messages) ? current.messages : [];
    const messagesHtml = messages.length
      ? messages
          .map(
            (msg) => `
              <div class="message-card">
                <div style="font-weight:500; margin-bottom:6px;">${msg.sender}</div>
                <div style="color:#3a4f72;">${msg.content}</div>
              </div>
            `
          )
          .join("")
      : `<div class="empty-state" style="height:120px;">${t("暂无消息")}</div>`;

    const attachments = Array.isArray(current.attachments) ? current.attachments : [];
    const attachmentsHtml = attachments.length
      ? `<div class="attachment-list">${attachments
          .map((file, index) => {
            const uploadedAt = file.uploadedAt ? formatDateTime(file.uploadedAt) : "";
            const meta = [file.size || "", uploadedAt].filter(Boolean).join(" · ");
            const attachmentId = file.id || "";
            return `
              <div class="attachment-item" data-attachment-index="${index}" data-attachment-id="${attachmentId}">
                <div>
                  <div style="font-weight:600;">${file.name}</div>
                  <div style="color: var(--text-light); font-size:12px;">${meta}</div>
                </div>
                <div class="table-actions">
                  <button class="button button--ghost button--sm" data-action="remove-attachment" data-attachment-index="${index}" data-attachment-id="${attachmentId}">${t("删除")}</button>
                </div>
              </div>
            `;
          })
          .join("")}</div>`
      : `<div class="empty-state" style="height:120px;">${t("暂无附件")}</div>`;

    detailCard.innerHTML = `
      <div class="page-header" style="margin-bottom:16px;">
        <div>
          <h3 class="section-title" style="margin-bottom:4px;">${current.jobTitle}</h3>
          <div style="color: var(--text-light); font-size: 13px;">${current.company} · ${t("投递于")} ${current.submitDate}</div>
        </div>
        <span class="badge badge--success">${t(current.status)}</span>
      </div>
      <div>
        <h4 style="font-size:15px; font-weight:600; margin-bottom:10px;">${t("状态时间线")}</h4>
        <div class="timeline">${timelineHtml}</div>
      </div>
      <div style="margin-top:18px;">
        <div class="page-header" style="margin-bottom:12px;">
          <h4 style="font-size:15px; font-weight:600; margin-bottom:0;">${t("沟通消息")}</h4>
          <div class="table-actions">
            <button class="button button--ghost button--sm" data-action="append-msg">${t("补充消息")}</button>
          </div>
        </div>
        ${messagesHtml}
      </div>
      <div style="margin-top:18px;">
        <div class="page-header" style="margin-bottom:12px;">
          <h4 style="font-size:15px; font-weight:600; margin-bottom:0;">${t("附件资料")}</h4>
          <div class="table-actions">
            <button class="button button--ghost button--sm" data-action="upload-attachment">${t("上传附件")}</button>
          </div>
        </div>
        ${attachmentsHtml}
      </div>
    `;

    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "application/pdf,.pdf";
    fileInput.style.display = "none";
    detailCard.appendChild(fileInput);

    fileInput.addEventListener("change", () => {
      const file = fileInput.files?.[0];
      if (!file) return;
      const name = file.name || "attachment.pdf";
      const isPdf = (file.type && file.type.toLowerCase() === "application/pdf") || /\.pdf$/i.test(name);
      if (!isPdf) {
        toaster.show(t("仅支持上传PDF文件"), { type: "warn" });
        return;
      }
      const attachment = {
        name,
        size: formatFileSize(file.size),
        type: file.type,
        uploadedAt: new Date().toISOString()
      };
      actions.addApplicationAttachment(current.id, attachment);
      toaster.show(t("附件已更新"), { type: "success" });
      renderDetail();
    });

    detailCard.onclick = (event) => {
      const target = event.target;
      if (!(target instanceof HTMLElement)) return;
      const action = target.dataset.action;
      if (!action) return;
      event.stopPropagation();

      if (action === "append-msg") {
        const value = prompt(t("请输入要补充的沟通信息："));
        if (value) {
          actions.appendApplicationMessage(current.id, value);
          toaster.show(t("消息已补充"), { type: "success" });
        }
      }

      if (action === "upload-attachment") {
        fileInput.value = "";
        fileInput.click();
      }

      if (action === "remove-attachment") {
  const attachmentId = target.dataset.attachmentId || null;
  const attachmentIndex = target.dataset.attachmentIndex ?? null;
        actions.removeApplicationAttachment(current.id, attachmentId, attachmentIndex);
        toaster.show(t("附件已移除"), { type: "info" });
        renderDetail();
      }
    };
  }

  header.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;
    const action = target.dataset.action;
    if (!action) return;

    if (action === "export") {
      toaster.show(t("Application export generated (mock)"), { type: "info" });
    }

    if (action === "refresh") {
      toaster.show(t("Statuses synced. Timeline reflects the latest update."), { type: "success" });
    }

    if (action === "simulate") {
      syncApplications();
  const pending = applications.find((item) => (item?.status || "") !== "Offer");
      if (pending) {
        actions.updateApplicationStatus(
          pending.id,
          "Offer",
          "Offer letter delivered via campus platform"
        );
        toaster.show(t("Simulated offer generated for the highlighted application."), { type: "success" });
        renderDetail();
      } else {
        toaster.show(t("All demo applications already show offer status."), { type: "info" });
      }
      renderTable();
    }
  });

  renderTable();
  renderDetail();

  return container;
}

function formatFileSize(bytes) {
  if (!bytes && bytes !== 0) return "";
  const units = ["B", "KB", "MB", "GB"];
  let size = bytes;
  let unitIndex = 0;
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex += 1;
  }
  const value = size >= 10 || size % 1 === 0 ? Math.round(size) : parseFloat(size.toFixed(1));
  return `${value}${units[unitIndex]}`;
}

function formatDateTime(value) {
  try {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "";
    return date.toLocaleString();
  } catch (error) {
    return "";
  }
}
