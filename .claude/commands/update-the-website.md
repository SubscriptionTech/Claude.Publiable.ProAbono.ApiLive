# Update the Website

You are running the `/update-the-website` command. Follow the steps below exactly.

---

## Step 1 — Present the checklist

Use `AskUserQuestion` with `multiSelect: true` to ask the user which actions to perform. The question is: "Which update steps do you want to run?"

Options (in this order):
1. **Pull the latest version of the API Live specs** — Update the `shared/ProAbonoLive` submodule to the latest remote commit.
2. **Re-generate the API reference** — Run `npm run gen-api-docs` in the `website/` folder.
3. **Adjust authored pages** — Compare the spec source files against the authored website pages and resolve discrepancies.
4. **Full audit of the website** — Audit the description folder against the website source (long, costs many tokens).
5. **Commit** — Stage, commit, and push all changes in the root repository.

Wait for the user's selections before doing anything.

---

## Step 2 — Execute selected actions in order

Run only the checked actions, in the order listed above (1 → 5). Stop if an error or unexpected result occurs — do not proceed to the next action. If a decision is needed, prompt the user before continuing.

---

### Action 1 — Pull the latest version of the API Live specs

Run the following command from the repository root:

```
git submodule update --remote shared/ProAbonoLive
```

Report whether the submodule was updated (include the new commit hash if it changed) or was already up to date.

**Do nothing else after this.** Do not sync the specs or update the website as part of this action — that is handled by the other actions.

---

### Action 2 — Re-generate the API reference

Run the following command from the `website/` folder:

```
npm run gen-api-docs
```

Report the output. If an error occurs, report it clearly and **stop the entire process** — do not proceed to the next action.

---

### Action 3 — Adjust authored pages

The following source files in `shared/ProAbonoLive` are used when authoring the non-API-reference website pages:

| Source file | Used to author |
|---|---|
| `shared/ProAbonoLive/resources/` (all `.md` files) | Source reference for all resource pages |
| `shared/ProAbonoLive/specs/enum.md` | Concepts pages |
| `shared/ProAbonoLive/specs/convention.md` | Authentication page |
| `shared/ProAbonoLive/specs/actions.md` | Guides pages |

Follow these steps:

**3a. Identify what changed in the submodule.**
Run `git -C shared/ProAbonoLive log --oneline -20` to see recent commits. Then check for changes in the source files above since the previous submodule commit using `git -C shared/ProAbonoLive diff HEAD~1 HEAD -- specs/ resources/` (adjust the range if needed).

If the submodule was just updated (Action 1 was also checked), you can instead diff between the old and new commit:
- Before Action 1, the old commit was recorded in `git show HEAD:shared/ProAbonoLive` — use it here.
- After Action 1, the new commit is at `git rev-parse HEAD:shared/ProAbonoLive`.

**3b. Read the source spec files** that have changed (or all of them if you cannot determine what changed).

**3c. Read the corresponding authored pages** in the website source (under `website/docs/` or `website/src/pages/`). Consult `description/pipeline/authoring.md` and `description/functional/` for the page locations.

**3d. For each discrepancy** — a case where the source spec says X but the authored website page says Y, or something present in the spec is missing from the page — present it to the user using a numbered list. For each item, offer at least 2 options, for example:
- **Option A — Update the website page** to reflect the spec change (describe what would change).
- **Option B — Leave the website page as-is** (explain why this might be acceptable).

Present **one discrepancy at a time**. Wait for the user's decision, apply it if needed, then move to the next.

If no discrepancies are found, report that and move on.

---

### Action 4 — Full audit of the website

Apply this prompt verbatim:

> Audit the description folder against the actual website, then walk me through each discrepancy.
>
> Steps:
> 1. Read `description/index.md` to understand the description structure, then read all relevant description files.
> 2. Read the website source (`website/src/`, `website/static/`, and any config files) to understand what is actually built.
> 3. Produce a complete numbered list of discrepancies — things where the description says X but the website does Y (or vice versa).
> 4. Present discrepancy #1 only: describe what the description says, what the website actually does, and propose two options — fix the description to match the website, or fix the website to match the description. Ask me which to apply.
> 5. Wait for my decision, apply it if needed, then move to #2, and so on until the list is exhausted.
>
> Do not batch or pre-apply fixes. One discrepancy at a time, wait for my go-ahead each time.

---

### Action 5 — Commit

**Always ask the user to confirm before committing.** Present a summary of what will be staged, propose a commit message, and wait for explicit approval.

Once the user approves:
1. Stage all relevant changes (prefer staging specific files over `git add -A` to avoid accidentally including `.env` or large binaries).
2. Commit with the approved message.
3. Push to the remote.

Report the result (commit hash, push confirmation, or any error).
