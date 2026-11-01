---
name: humanize-code
description: Makes code look like it was written by a real software engineer working in a team, instead of an AI. Use this skill whenever you write, edit, refactor, or review code in ANY programming language and the user wants it to feel human, natural, less "AI-generated", or less perfect. Also use it when the user mentions humanizing code, AI slop, removing AI-looking comments or naming, or says the code looks too clean or too polished. Applies to the whole codebase by default, or only to the scope the user names (a file, function, selection, or commit).
version: 1.0.1
---

# Humanize Code

AI code gives itself away: a docstring on every function, comments that narrate every line, names that are either absurdly long or oddly generic, perfectly symmetrical structure, and every edge case handled up front. Real engineers on a team write differently.

The target is **a competent engineer writing for teammates**: readable by someone new to the codebase, a bit pragmatic, not polished to perfection. Not a lone hacker who writes for themselves. Not an AI showing off.

**Balance rule:** a new teammate should understand the code without asking the author. If humanizing makes anything harder to follow, undo that part.

## Scope

- **Default:** apply to all code you write or touch in the task.
- **If the user names a scope** (a file, a function, "only the comments", "only naming"), apply it only there and leave everything else exactly as is.
- When rewriting existing code, keep behavior identical. Change the surface, not the logic.

## Never rename existing functions

- **Keep every existing function, method, and class name exactly as it is.** Do not shorten, rename, or "improve" them.
- Don't rename public APIs, exported symbols, or anything other code may depend on.
- For new functions you write yourself, pick clear, normal names of moderate length (`format_number`, `load_config`, `parse_row`), never cryptic ones.

## Before you start

Look at the existing code. If it is human-written, **match its style**: naming habits, comment density, tone, and formatting. Blending in is the best humanization. If the user supplies a sample of their own code, follow it over the generic rules below.

## The habits

### 1. Naming (variables and locals only)
- Use normal, readable names a teammate would pick: `result`, `count`, `user_list`, `config`, `items`, `index`.
- Short names are fine only where convention makes them obvious: `i`, `j` for loop counters, `e`/`err` for exceptions, `ctx`, `req`, `res`, `id`, `df` in pandas code.
- Do **not** abbreviate into puzzles (`fmt`, `cnt`, `tmp2`, `usr_mgr`). If a reader has to decode it, use the full word.
- Avoid the opposite AI habit too: no 40-character names, no needless prefixes/suffixes (`Manager`, `Helper`, `Impl`) unless the project uses them.
- Follow the language's casing convention. Drift a little in wording (`users` here, `user_list` there), never in a way that confuses.

### 2. Comments (moderate, useful, team-style)
Aim for the comment density of a good engineer on a team: **not zero, not every line.**

Write comments that give guidance:
- A short one-line comment above a non-obvious block saying what it's for or why it's done this way.
- Context a newcomer needs: a business rule, an assumption, a unit, an expected format, a link to why a workaround exists.
- Warnings about gotchas: "order matters here", "API returns null for deleted users".
- A brief note above a function that does something non-trivial. Plain language, one or two lines, not a formal docstring with every param and return restated. Follow the project's docstring convention for public APIs.

Avoid:
- Restating the code (`# increment i`, `# return the result`).
- Narrating every step, numbered "Step 1/2/3" comments, or section banners.
- Perfectly formatted multi-paragraph docstrings on small helpers.
- Over-polish. Comments can be short, plain, even a bit informal: `# skip header row`, `# retry once, the API is flaky`.

Rough guide: a few comments per file, more where the logic is tricky, none where the code is self-explanatory. A new teammate should be able to follow the flow from names plus comments alone.

### 3. Structure
- Don't split everything into tiny single-use helpers. A 25-40 line function is fine.
- Allow a little repetition rather than abstracting every pattern.
- Handle realistic edge cases, not every imaginable one.
- Skip over-engineering (factories, builders, extra interfaces, config objects) for simple problems.
- Avoid unnecessary constants and type noise in small scripts, but don't strip types where the project uses them.

### 4. Formatting
- Small natural variation is fine, but stay consistent enough to look tidy. Never break the project's linter, formatter, or build. If a formatter is enforced, keep formatting clean and humanize through naming, comments, and structure instead.

### 5. Error handling and logging
- Simple, practical handling over layered custom error classes.
- Log and error messages short and clear: `"failed to load config: %s"`, not polished paragraphs.

### 6. Occasional human touches (rare)
- An occasional `TODO` with a clear note about what's left, a small known limitation mentioned in a comment. One or two per file at most, and only when genuinely fitting.

## Guardrails (never break these)

- Code must work correctly and pass the same tests.
- **Never introduce bugs on purpose.** Imperfect means pragmatic, not broken.
- Don't weaken security, validation at trust boundaries, auth, or data-safety handling.
- No misleading comments or fake history (no invented authors, dates, or ticket numbers).
- Keep comments and docs that tooling, license headers, or public API requirements depend on.
- The project's style guide beats these habits when they conflict.

## Final check

Read the result as a new teammate seeing it for the first time:
1. Could they follow it without asking the author? If not, add a comment or use a clearer name.
2. Does it still read like an AI wrote it (every function documented, every line explained, everything perfectly symmetrical)? If so, loosen it.
3. Are all existing function names unchanged? If not, restore them.

Keep your reply short: say what you humanized and in which scope. Don't lecture.
