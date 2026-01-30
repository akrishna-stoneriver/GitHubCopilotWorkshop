# Fork Setup (origin/upstream)

This repo is often used in workshop settings where you want to push your changes to **your own fork**, while still being able to pull updates from the **original workshop repo**.

This guide documents the recommended Git remote configuration:

- `origin` → your fork (push here)
- `upstream` → original repo (pull updates from here)

## Current remote targets for this workspace

Example:

- `origin`: `https://github.com/akrishna-stoneriver/GitHubCopilotWorkshop.git`
- `upstream`: `https://github.com/lyantovski/GitHubCoPilotWorkshop`

To verify yours:

- `git remote -v`

## One-time setup (switch to your fork)

If your current remote is only `origin` pointing to the original repo:

1. Go to the repo root
2. Rename the existing `origin` to `upstream`
3. Add your fork as the new `origin`

Commands:

- `git remote rename origin upstream`
- `git remote add origin https://github.com/<your-user>/<your-fork>.git`
- `git remote -v`

## Day-to-day: push your branch to your fork

- `git push -u origin HEAD`

This publishes your current branch to your fork and sets the upstream tracking branch.

## Sync your fork with upstream (default branch = master)

This repository uses `master` as the default branch in some setups.

### Option A: Merge upstream (safest)

- `git fetch upstream`
- `git checkout master`
- `git pull origin master`
- `git merge upstream/master`
- `git push origin master`

### Option B: Rebase onto upstream (linear history)

Only use this if you’re comfortable rewriting history on your fork.

- `git fetch upstream`
- `git checkout master`
- `git pull origin master`
- `git rebase upstream/master`
- `git push origin master --force-with-lease`

## Troubleshooting

### "remote origin already exists"

You likely haven’t renamed the original `origin` yet.

- `git remote rename origin upstream`
- then re-run `git remote add origin ...`

### Authentication / permission errors on push

- Make sure `origin` points to your fork (not upstream)
- If using HTTPS, ensure you’re logged in via Git Credential Manager or using a token

### Which branch name should I use?

- This guide assumes `master`.
- If your repo uses `main`, replace `master` with `main` in commands.
