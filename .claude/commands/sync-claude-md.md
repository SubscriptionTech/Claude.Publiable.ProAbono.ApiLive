# Sync CLAUDE.md

You are running the `/sync-claude-md` command. Follow the steps below exactly.

---

## Step 1 — Read both files

Read:
1. `shared/DocApi/CLAUDE.md` — locate the section titled **"Shared CLAUDE.md instructions"**
2. The root `CLAUDE.md` of the current project

---

## Step 2 — Extract canonical sections

In `shared/DocApi/CLAUDE.md`, find the **"Shared CLAUDE.md instructions"** section. Under it, each `###` subsection is a canonical shared block. For each one, record:
- Its exact `###` heading text
- Its full body (everything after the heading, up to the next `###` or `##` heading)

---

## Step 3 — Compare and sync, one section at a time

For each canonical section, search the root `CLAUDE.md` for a `###` heading with the exact same text.

**Case A — Section is missing from root:**
Add it to the root `CLAUDE.md` under the `##` parent heading indicated in `shared/DocApi/CLAUDE.md` (see the note above each group of `###` sections). Create the `##` heading if it does not exist. Report what was added.

**Case B — Section exists in both with identical content:**
No action needed. Move to the next section.

**Case C — Section exists in both but content differs:**
Show the user:
- **Shared version** — the text from `shared/DocApi/CLAUDE.md`
- **Root version** — the text from the project's `CLAUDE.md`

Then ask using `AskUserQuestion` (single-select):
> "The section **[section name]** differs from the shared version. What should be done?"

Options:
1. **Update root** — replace the root version with the shared canonical version
2. **Update shared** — replace the shared version with the root version (the root becomes the new canonical)
3. **Keep both** — leave the divergence as-is for now

Apply the choice before moving to the next section.

---

## Step 4 — Summary

After all sections are processed, report:
- Sections **added** to `CLAUDE.md`
- Sections **synced** (and direction: root ← shared, or shared ← root)
- Sections **left diverged** (kept both)
- Sections already **in sync** (no action)
