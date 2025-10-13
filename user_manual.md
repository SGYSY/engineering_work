# University Employment Analytics Demo – User Manual

This guide walks new users through the web demo experience, explaining how each role completes everyday tasks. Follow the steps below to log in, explore features, and interpret the information presented on each screen.

---

## 1. Before You Begin

1. Open the demo in a modern browser. If you are running a local server, the address is typically `http://127.0.0.1:5000` or as printed by the `npx serve` command.
2. On the sign-in page, choose a role from the dropdown and use one of the accounts listed in the “Available accounts” section. Credentials are autofilled when you press “Use”.
3. The application remembers your changes. To reset the demo to its original state, clear browser storage (`localStorage` key: `career-platform-state`) and refresh the page.

---

## 2. Student Portal

### 2.1 Discover Jobs

1. Select **Job List** from the navigation bar.
2. Use the search bar and dropdown filters (Industry, City, Salary, Education) to refine matches.
3. Press **Smart Suggestions** for tailored filters, **Save Filter** to remember preferences, or click **Quick Apply** to submit an application immediately.
4. Mark a job as **Favorite** to track it later; favorites appear with a highlighted icon.

### 2.2 Review Job Details

1. Click **View Details** on any job card.
2. Read the description, requirements, salary, and deadlines.
3. Apply or favorite directly from the detail page; the timeline shows posting and deadline milestones.

### 2.3 Track Applications

1. Open **My Applications**.
2. The left table lists all submissions. Click a row to view its status timeline.
3. Use **Add Message** to record follow-up notes, and **Upload Attachment** to append PDF reminders.
4. Use **Simulate HR Update** to fast-forward a sample application to an offer for demonstration purposes.

### 2.4 Manage Activities

1. Navigate to **Activities**.
2. Filter by type or search keywords to find campus events.
3. Register or cancel attendance; registered events display a success badge.
4. Update the entry guide using the side input to note arrival instructions.
5. **My Registrations** shows only the events you have confirmed.

### 2.5 Notifications

1. Choose **Notifications** in the navigation.
2. Toggle **Unread only** to focus on new items.
3. Use the buttons within each card (Mark Read / Mark Unread / View Details) to stay organised.

---

## 3. HR Portal

### 3.1 Manage Job Postings

1. Open **Job Management**.
2. Edit fields inline and use the action buttons to publish, unpublish, duplicate, or delete positions.
3. Use the bulk controls at the top (select multiple rows) for quick updates.

### 3.2 Candidate Panel

1. Switch to **Candidate Panel**.
2. Drag candidates between stages (e.g., Screening, Interview, Offer) to show progression.
3. Send invitation reminders using the toolbar.

### 3.3 Campus Events

1. Choose **Campus Events**.
2. Inspect existing events, read requirements, and submit a registration form.
3. Submitted entries await counselor approval and trigger notifications when the status changes.

### 3.4 Notifications

1. Inspect the bell icon or the **Notifications** list to see counselor replies or student activity.

---

## 4. Teacher / Counselor Portal

### 4.1 Activity Management

1. Open **Activity Management**.
2. Approve or reject company sign-ups; the status updates immediately.
3. Click **Generate QR Code** to create a new check-in code for attendants.
4. Use **Export Signup List** to download the mock attendee CSV.

### 4.2 Employment Dashboard

1. Visit **Employment Dashboard**.
2. Select year, college, and major filters to refresh charts showing industry, role, and regional distribution.
3. Discuss trends using the aggregated mock metrics.

### 4.3 Enterprise Review

1. Navigate to **Enterprise Admission Review**.
2. Inspect company submissions and mark them as whitelist or blacklist entries.
3. Export audit logs for reference.

---

## 5. Administrator Portal

### 5.1 User & Role Management

1. Open **User Roles**.
2. Review account details, reset passwords, or update role assignments.

### 5.2 Teacher Panel

1. Visit **Teacher Admin** to see counselor summaries and shortcut links to their workspace.

### 5.3 HR Panel

1. Inspect **HR Admin** for a consolidated view of enterprise recruiter activity.

### 5.4 Operation Log

1. Go to **Operation Log**.
2. Filter by module, keyword, or time to audit actions performed across the platform.

---

## 6. Tips for Demonstrations

- Reference the contextual **Demo Guide** card on each view for a quick description and key actions.
- Highlight status toasts, timeline updates, and badge indicators to show how the interface responds in real time.
- If an element appears unresponsive, refresh the page to reinitialise the state and ensure no browser extensions interfere with storage.

---

## 7. Support

- For technical notes, consult `technique_manual` file.
- Reset the demo between sessions to keep the walkthrough consistent.

Enjoy exploring the University Employment Analytics Demo. Let us know if you need customized data sets or role-specific enhancements for your presentations.***
