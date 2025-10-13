# University Employment Analytics Demo – Technique Manual

This manual explains how to explore and demonstrate the front-end prototype found in this repository. It highlights account credentials, core user journeys, configuration options, and troubleshooting steps so you can confidently showcase the experience to stakeholders.

---

## 1. Overview

The demo is a static single-page application with a rich mock state. It emulates the major personas that participate in campus recruitment:

- **Student** – searches for jobs, manages applications, monitors activities, and reads notifications.
- **Human Resources (HR)** – publishes jobs, manages candidate pipelines, and registers for campus events.
- **Teacher / Counselor** – reviews enterprise sign-ups, runs campus activities, and analyzes employment dashboards.
- **Administrator** – maintains users and roles, inspects operation logs, and monitors overall activity.

No backend is required; all data is stored in `localStorage` and in the JavaScript mock state under `src/state/store.js`.

---

## 2. Getting Started

### 2.1 Serve the application

The `index.html` file can be opened directly in a modern browser. For a more realistic origin (useful when testing browser storage or previews), launch a local static server:

```powershell
# Preferred on Windows – binds to 127.0.0.1:5000
npx serve --listen tcp://127.0.0.1:5000

# Alternative if port 3000 is available
npx serve --listen tcp://127.0.0.1:3000
```

The CLI prints the access URL. Stop the server with `Ctrl+C`.

### 2.2 Demo credentials

| Role          | Username    | Password       | Persona name    |
| ------------- | ----------- | -------------- | --------------- |
| Student       | `student` | `student123` | Alex Zhang      |
| HR            | `hr`      | `hr123`      | Wang (HR)       |
| HR (alt)      | `hr2`     | `hr456`      | Liu (Campus HR) |
| Teacher       | `teacher` | `teacher123` | Professor Zhang |
| Administrator | `admin`   | `admin123`   | Admin Li        |

The login view also lists these accounts and allows one-click autofill.

### 2.3 Resetting state

The application persists changes in `localStorage` under the key `career-platform-state`. To reset the demo:

1. Open the browser DevTools.
2. Switch to the **Application** (Chrome) or **Storage** (Firefox) tab.
3. Delete the `career-platform-state` entry, or run `localStorage.clear()` in the console.

---

## 3. Guided Walkthroughs

Each view displays a contextual “Demo Guide” card. The sections below provide a suggested narrative for live sessions.

### 3.1 Student experience

1. **Job discovery** – Navigate to *Job List*. Demonstrate keyword filters, chips, and the “Smart Suggestions” shortcut. Toggle favorites and trigger “Quick Apply”.
2. **Job detail** – Open a job from the list to show description, requirements, and application timeline. Submit an application to generate toasts.
3. **Applications** – View the pipeline, show timeline entries, append messages, and upload/remove attachments (PDF mocked).
4. **Activities** – Register for or cancel events, update entry guides, and switch to “My Registrations”.
5. **Notifications** – Mark items as read/unread and highlight the filters; mention how HR or teacher actions appear here.

### 3.2 HR experience

1. **Job management** – Modify job fields inline; demonstrate publish/unpublish toggles and duplication.
2. **Candidate panel** – Move candidates across stages using drag & drop, and use bulk invitation actions.
3. **Campus events** – Submit an event registration; this sends an approval request to the teacher portal.
4. **Notifications** – Show HR alerts for student applications or counselor decisions.

### 3.3 Teacher / counselor experience

1. **Activity management** – Approve or reject enterprise sign-ups, generate updated QR codes, and export participant rosters.
2. **Employment dashboard** – Filter by year, college, and major to refresh charts; emphasize the use of mock analytics data.
3. **Enterprise audits** – Adjust whitelist/blacklist marks, review history, and export audit logs.

### 3.4 Administrator experience

1. **User & role administration** – Inspect the list, reset passwords, and add/remove demo entries.
2. **Operation log** – Filter by module or keyword to trace actions taken in other roles.
3. **Portal shortcuts** – Jump into teacher or HR center directly from the overview cards.

---

## 4. Customisation Tips

- **Mock data** – `src/state/store.js` seeds lists for jobs, applications, activities, and more. Update entries to match your pitching storyline.
- **Copy and tone** – All strings are defined inline or via `src/utils/i18n.js`. You can adjust messaging without touching build tooling.
- **Styling** – Global variables are declared in `styles/main.css`; component-specific styles live alongside the views.
- **Feature toggles** – Actions in `store.js` expose top-level functions (`toggleJobFavorite`, `applyForJob`, etc.). They are easy to stub or extend for new demo scenarios.

---

## 5. Troubleshooting

| Issue                                                  | Resolution                                                                                         |
| ------------------------------------------------------ | -------------------------------------------------------------------------------------------------- |
| `npx serve` fails with **EACCES** on port 3000 | Use the 5000 port command, run the terminal as administrator, or reserve the port via `netsh`.   |
| No data appears after logging in                       | Ensure `localStorage` is enabled. Clear the `career-platform-state` key and refresh.           |
| Attachments don’t upload                              | Only PDF file types are permitted. The demo records metadata but does not persist actual files.    |
| QR code download opens blank page                      | The app generates data URLs for mock PNGs; ensure the browser allows downloads from data URLs.     |
| Toasts or updates don’t appear                        | Reload the page to reinitialise the state store. Older browsers may not support optional chaining. |

---

## 6. File Map Reference

| Path                                       | Purpose                                      |
| ------------------------------------------ | -------------------------------------------- |
| `index.html`                             | Entry point referencing ES module bundle     |
| `styles/main.css` / `styles/reset.css` | Global styling and reset definitions         |
| `src/main.js`                            | Route registry and shell mounting logic      |
| `src/state/store.js`                     | Central state container with mock data       |
| `src/views/*`                            | Role-specific views and components           |
| `src/components/toast.js`                | Toast notification utility                   |
| `src/components/demoGuide.js`            | Contextual guidance cards                    |
| `src/utils/i18n.js`                      | Translation helper (English-only by default) |
| `src/utils/qr.js` / `qrCreator.js`     | QR code generation utilities                 |

---

## 7. Contact Notes

This demo is designed for rapid iteration. When preparing customer-facing presentations:

- Update persona names and job listings to match the audience.
- Highlight that all data is fictional and explain how it would sync with the real backend.
- Collect feedback after each walkthrough and adjust mock data or copy accordingly.

---

Enjoy exploring the platform! Reach out to the project maintainers if you need additional scenarios or if you want to integrate new mock data sets.***
