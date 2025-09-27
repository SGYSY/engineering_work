const hints = {
  student: {
    title: "Student walkthrough",
    steps: [
      "Browse job list, then open a job detail to see highlights.",
      "Use My Applications to review the timeline or upload supporting PDFs.",
      "Visit Activities to toggle registrations and view counselor tips.",
      "Check Notifications to acknowledge messages from HR and counselors."
    ]
  },
  hr: {
    title: "HR walkthrough",
    steps: [
      "Adjust job postings, then duplicate or publish to simulate changes.",
      "Review candidates, update their stages, and send bulk invites.",
      "Open Campus Events to submit or edit the registration form.",
      "Watch the notification list for campus approvals and application updates."
    ]
  },
  teacher: {
    title: "Counselor walkthrough",
    steps: [
      "Publish or review campus activities and track registrations.",
      "Approve enterprise sign-ups and regenerate the on-site QR code.",
      "Explore Employment Dashboard filters to see distribution summaries.",
      "Use Enterprise Admission Review to manage whitelist / blacklist status."
    ]
  },
  admin: {
    title: "Admin walkthrough",
    steps: [
      "Manage platform users, create demo accounts, and reset passwords.",
      "Assign roles to reflect each persona before touring their workflows.",
      "Check Operation Log filters to audit recent simulated actions.",
      "Jump into Teacher / HR admin panels to open portal shortcuts."
    ]
  }
};

export function renderDemoGuide(roleId, viewId) {
  const guide = hints[roleId];
  if (!guide) return null;

  const container = document.createElement("aside");
  container.className = "demo-guide";

  const title = document.createElement("h4");
  title.className = "demo-guide__title";
  title.textContent = guide.title;
  container.appendChild(title);

  const list = document.createElement("ol");
  list.className = "demo-guide__list";

  guide.steps.forEach((text, index) => {
    const item = document.createElement("li");
    item.textContent = text;
    if (index === 0) {
      item.classList.add("highlight");
    }
    list.appendChild(item);
  });

  if (viewId) {
    const badge = document.createElement("div");
    badge.className = "demo-guide__badge";
    badge.textContent = `Now viewing: ${formatViewId(viewId)}`;
    container.appendChild(badge);
  }

  container.appendChild(list);
  return container;
}

function formatViewId(viewId) {
  return viewId
    .split("-")
    .map((chunk) => chunk.charAt(0).toUpperCase() + chunk.slice(1))
    .join(" ");
}
