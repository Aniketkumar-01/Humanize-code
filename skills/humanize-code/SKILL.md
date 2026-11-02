---
name: humanize-code
description: Removes the AI-generated look from code comments so the code reads like a competent engineer on a team wrote it, without changing how the code works. Use this skill whenever you write, edit, or review code in ANY programming language and the user wants it to look human, natural, or less "AI-generated" or "AI slop", or mentions banner/divider comments, over-explained comments, filler phrases, or comments that look too polished. Applies to the whole codebase by default, or only to the scope the user names (a file, function, or selection). Optional mode on request - shorten overlong local variable names.
version: 1.0.3
---

# Humanize Code

Goal: remove unnecessary AI habits from how code **looks**, while the code keeps working exactly as before.

Write like a competent engineer with several years of experience. Do not write like an AI trying to show it is a competent engineer. Do not make code artificially sloppy either. Good engineering practices stay. Only the AI clutter goes.

> Remove unnecessary AI patterns, not good engineering. Keep anything that improves readability, maintainability, reliability, security, or understanding.

## Hard rule: the code does not change

By default, only **comments** (and the blank lines directly around them) may be edited.

- If every comment edit were reverted, the code must be identical.
- Do not change logic, structure, function names, variable names, class names, imports, statement order, or behavior.
- Do not refactor, rename, split, merge, or reorder anything.
- If something would need a code change to look better, leave it alone.

## Scope

- **Default:** all comments in code you write or touch in the task.
- **If the user names a scope** (a file, a function, a selection), touch only that.
- When writing new code, write comments in this style from the start.
- Keep the cleanup consistent across all files in scope, not just one file.

## Before removing anything

Check what a comment is actually for. Never remove a comment only because it resembles an AI pattern. When unsure, keep it. Change only what needs changing. A style preference alone is not a reason to rewrite a well-written comment.

## What to fix

### 1. Decoration and formatting
- Remove oversized dividers: `=====`, `-----`, `#####`, `*****`, and box-style comments with borders.
- Remove ASCII art in comments.
- Remove numbering in headings unless there is a real sequence. `# 5. ENTRY POINT` becomes `# Entry point`.
- Use natural capitalization, not ALL-CAPS headings.
- Remove stacked empty comment lines used only for spacing.
- Remove excessive alignment or indentation inside comment text.
- Don't repeat the same decorative format throughout a file.
- If a section heading helps navigation, keep it as a plain one-liner. Only strip the decoration around it.

Example:

```python
# ============================================================================
# 5. ENTRY POINT
# ============================================================================
def main():
    ...
```
becomes
```python
# Entry point
def main():
    ...
```

### 2. Wording and over-explanation
Cut:
- Comments that restate the next line in English (`# increment counter`, `# return the result`).
- Step-by-step narration ("Step 1", "Step 2", "First we... then we...").
- Tutorial-style explanations of simple operations.
- Comments explaining obvious function or variable names.
- Comments about hypothetical future features.
- Generic TODOs with no actionable information.
- Comments that announce intent ("Here, we are going to...") instead of explaining behavior.

Trim repetitive filler phrases when they add nothing: "It is important to note that...", "This ensures that...", "This allows us to...", "The purpose of this function is...", "In order to ensure...", "As mentioned earlier...", "This approach provides...", "The following code handles...", "Gracefully handle...", "For better maintainability...". These are not banned on their own. The problem is unnecessary, repeated use, so judge each in context.

### 3. How the remaining comments should read
- Explain **why**, not what. Use specific project terms, not generic wording.
- Natural, plain technical language, like a teammate leaving a note: `# skip the header row`, `# API returns null for deleted users`.
- Length proportional to how complex the code is. Short is not the goal; usefulness is.
- Place comments near the code they explain.
- No emoji, bold, or markdown styling inside comments.
- Don't repeat the same explanation in several places.

### 4. Docstrings
- Keep good docstrings, including long ones on complex public APIs. A 30-line docstring on a complex public function is fine.
- Only trim filler: restated parameter/return sections that just repeat the signature, and "This function is responsible for..." openers.
- Keep the project's docstring format (Google, NumPy, JSDoc, Javadoc, etc.).

## Keep (do not remove or weaken)

- Comments explaining non-obvious logic, business rules, assumptions, units, formats, gotchas, and design decisions
- Architectural comments and useful section headings
- Meaningful TODOs that say what work is left
- License headers, copyright notices, shebangs, encoding lines
- Linter and type directives (`# noqa`, `# type: ignore`, `// eslint-disable`, `#pragma`, `# pylint:`)
- Comments tools read (doctest content, region markers, generated-file notices)
- Type annotations, existing formatting, and project conventions

## Do not do this

- Do not change any code, only comments.
- Do not rename, remove, or reorder functions, classes, variables, or imports.
- Do not remove wrapper functions, helpers, or abstractions, even if they look pointless.
- Do not remove validation, null checks, exception handling, fallbacks, retries, or logging, even if they look redundant.
- Do not simplify or restructure logic.
- Do not delete all comments. That creates a different kind of slop.
- Do not add messy formatting, bad naming, deliberate bugs, or sloppy code to look "human".
- Do not invent fake history (authors, dates, ticket numbers).
- Do not touch tests, READMEs, configs, or commit messages unless the user asks.

## Optional mode: shorten overlong local variables

**Off by default.** Only do this if the user asks (for example "also shorten long variable names").

When on, strict limits apply:
- Only **local variables inside a single function**.
- Never rename parameters (Python keyword arguments and named arguments would break callers), exports, class fields, constants, function names, or anything serialized, reflected, or accessed by string.
- Only shorten names that are truly overlong, into clear readable names a teammate would pick (`userAccountSubscriptionRenewalTimestampEpochSeconds` becomes `renewal_timestamp`). Never cryptic abbreviations like `fmt`, `cnt`, or `tmp2`.
- Check the new name doesn't clash with or shadow another name in scope.
- Rename every use inside that function, and nothing outside it.
- Keep the project's naming convention.

## Final check

1. With comments aside, is the code identical (unless optional mode was requested)? If not, undo.
2. Any banners, dividers, or numbered headings left? Remove them.
3. Could a new teammate still follow the code with the remaining comments? If not, restore a short helpful comment.
4. Does any comment still read like a tutorial, narration, or filler? Trim it.
5. Were any license, linter, or tool comments touched? Restore them.

Keep your reply short: say which comments you changed and in what scope. Don't lecture.
