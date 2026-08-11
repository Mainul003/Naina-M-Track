# Naina Money Tracker

A private, browser-based tracker for land sale money, expenses, loans, and savings. The initial records were imported from `Naina Money Track.xlsx`.

## Run locally

Open `index.html`, or start any static web server in this folder.

## Deployment and permanent saving

This version is deployed on Vercel because GitHub Pages cannot securely write commits. The application still stores every update in GitHub at `data/records.json`; each save, deletion, import, or reset creates a repository commit.

1. Push this project to GitHub.
2. Import that repository into Vercel.
3. Create a fine-grained GitHub personal access token with **Contents: Read and write** access to only this repository.
4. Add these Vercel environment variables:

   - `GH_OWNER`: GitHub username or organization
   - `GH_REPO`: repository name only
   - `GH_BRANCH`: `main`
   - `GH_TOKEN`: fine-grained GitHub token
   - `SESSION_SECRET`: a long random value of at least 32 characters
   - `APP_USER_ID`: `Naina03`
   - `APP_PASSWORD_HASH`: SHA-256 hash of the login password

5. Deploy. The first change made in the application creates `data/records.json`; subsequent changes update it with a new commit.

## Data and privacy

- The latest records are loaded from GitHub and synchronize between devices.
- Use **Backup & settings → Download backup** regularly.
- Login validation and the GitHub token run only in the Vercel server-side API.
- If the repository is public, `data/records.json` and its full commit history are intentionally public.
