# University Employment Analytics Demo (Front-end Only)

This repository contains a purely front-end prototype that mirrors the major flows described in `requirement.md`. It ships with a rich mock state so you can showcase student, HR, counselor, and administrator journeys without a backend.

## Quick start

1. Open `index.html` in a modern browser (Chrome/Edge ≥ 110 recommended), **or** serve the folder with Node to match a “real” origin:
   ```powershell
   # Recommended for Windows users – binds to localhost on port 5000
   npx serve --listen tcp://127.0.0.1:5000

   # If port 3000 is available you can use:
   npx serve --listen tcp://127.0.0.1:3000
   ```
   The `serve` CLI prints the exact URL when it launches. Press `Ctrl+C` to stop.
2. Use the provided demo accounts from the login panel (student / hr / teacher / admin).
3. Actions persist via `localStorage`; use the **Reset State** button in DevTools (`localStorage.clear()`) or remove the `career-platform-state` key to start fresh.

## Highlighted scenarios

### Student role
- Discover positions with preset filters, open job details, and trigger “One Click Apply”.
- Navigate to **My Applications** to review the timeline, upload / remove supporting PDFs, and simulate an HR offer.
- Toggle activity registration to generate counselor notifications and watch the Activity Guide update.
- Check Notifications to acknowledge campus reminders and HR updates.

### HR role
- Manage postings: edit inline fields, duplicate drafts, publish/unpublish, or bulk operate.
- Review candidates with draggable stage chips and send bulk invitations.
- Complete the campus registration form to push requests into the counselor approval queue.
- Monitor HR notifications for real-time campus or application events.

### Teacher (Counselor) role
- Create activities, approve enterprise signups, and regenerate the check-in QR code.
- Explore the employment dashboard filters; charts refresh from aggregated mock records.
- Maintain enterprise whitelist/blacklist history while logging each decision.

### Admin role
- Manage system users, reset passwords, and align platform roles for the demo.
- Audit recent interactions from the operation log with keyword, date, and module filters.
- Jump into HR / Teacher portals straight from the admin overview panels.

## New demo helpers
- A contextual **Demo Guide** appears on every page summarizing the recommended walkthrough for the current role.
- Mock data has been extended with richer jobs, notifications, campus events, and pre-canned history so the demo feels up-to-date.
- “Simulate HR Update” updates the highlighted student application to demonstrate offer hand-offs instantly.

## Tech notes
- Vanilla ES modules + modern CSS, no build step required.
- Global state managed in `src/state/store.js` with persistence and toast feedback.
- QR codes rendered client-side through `src/utils/qr.js` / `qrCreator.js` for compliant mock downloads.

Feel free to tailor copy or mock data for custom pitches; the architecture is kept simple on purpose so you can adjust quickly.
