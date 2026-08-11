# Naina Money Tracker

A private, browser-based tracker for land sale money, expenses, loans, and savings. The initial records were imported from `Naina Money Track.xlsx`.

## Run locally

Open `index.html`, or start any static web server in this folder.

## GitHub Pages

In the repository settings, open **Pages**, choose **Deploy from a branch**, select the `main` branch and `/ (root)`, then save.

## Data and privacy

- Records are saved in the browser's local storage; they do not sync between devices.
- Use **Backup & settings → Download backup** regularly.
- This is a static app. Its login is a privacy screen, not secure server-side authentication. Do not publish sensitive source data in a public repository.
- For genuinely private multi-device access, connect the UI to a backend with authentication and database storage (for example, Supabase or Firebase).
