---
name: humanize-code
description: Makes code look like it was written by a real developer instead of an AI. Use this skill whenever you write, edit, refactor, or review code in ANY programming language and the user wants it to feel human, natural, less "AI-generated", or less perfect. Also use it when the user mentions humanizing code, removing AI-looking comments, making naming/comments/style look hand-written, or says the code looks too clean or too polished. Applies to the whole codebase by default, or only to the scope the user names (a file, function, selection, or commit).
version: 1.0.0
---

# Humanize Code

AI code gives itself away: every function has a polished docstring, names are long and perfectly descriptive, every line is commented, formatting is flawless, and every edge case is handled up front. Real developers don't write like that. This skill makes code read like a real person wrote it, **without changing what it does**.

## Scope

- **Default:** apply to all the code you write or touch in the task, across the whole project.
- **If the user names a scope** (one file, one function, "only the backend", "just the comments", "only naming"), apply it only there and leave everything else exactly as is.
- If the user asks for only one aspect (e.g. "just fix the comments"), do only that aspect.
- When rewriting existing code, keep behavior identical. Humanize the surface, not the logic.

## Before you start

Look at the existing code in the project. If there is human-written code, **match its style first**: its naming habits, comment density, tone, and formatting. The best humanization is blending into what's already there. If the user gives a sample of their own code, copy its habits over any generic rules below.

If there is no existing style to copy, use the habits below.

## The habits

### 1. Naming
- Use short, practical names: `res`, `cnt`, `tmp`, `val`, `idx`, `cfg`, `usr`, `data`, `items`, `i`, `j`.
- Don't make every name fully descriptive. `getUserSubscriptionRenewalDate` becomes `getRenewal` or `renewDate`.
- Allow mild inconsistency a person drifts into over a file (`userList` here, `users` there), but never in a way that causes confusion or collisions.
- Avoid formal prefix/suffix patterns (`Manager`, `Handler`, `Helper`, `Impl`) unless the project already uses them.
- Follow the language's casing conventions (snake_case, camelCase, etc.). Humans break naming style much less than they break everything else.

### 2. Comments
- Write far fewer. Most lines need none.
- Comment the **why**, a gotcha, or a workaround, never what the code obviously does.
- No docstring or JSDoc on every function. Skip them on small or internal ones. Keep them only where the project's norm or a public API truly needs them.
- Casual tone is fine: `// weird edge case from the old API`, `# not pretty but works`, `// TODO clean this up`.
- Don't use section banners, numbered step comments ("Step 1:"), or comments that restate the next line.
- Comments can be short, lowercase, or slightly incomplete. Don't use perfect full sentences with punctuation every time.

### 3. Structure
- Don't split everything into tiny single-purpose helpers. A 30-line function is fine.
- Allow a little repetition instead of abstracting every pattern.
- Don't handle every hypothetical edge case up front. Handle the realistic ones.
- Skip needless type annotations, constants, and config objects where a literal is fine for a small script.
- Avoid over-engineered patterns (factories, builders, interfaces) for simple problems.

### 4. Formatting
- Small natural quirks are fine: slightly uneven blank lines, a one-liner next to a multi-line block, mixed quote style where the language allows it.
- Never break the project's linter, formatter, or build. If a formatter is enforced, formatting stays clean and you humanize naming, comments, and structure instead.

### 5. Error handling and logging
- Prefer simple handling over exhaustive. A plain `try/except` or `if err != nil` with a short message beats layered custom error classes.
- Log messages should be short and practical (`"failed to load config"`), not polished paragraphs.

### 6. Leftover-human touches (use sparingly)
- An occasional `TODO` or `FIXME`, a commented-out line the dev "might need later", a slightly awkward but working approach.
- Keep these rare and harmless. One or two per file at most.

## Guardrails (never break these)

- The code must still work correctly and pass the same tests.
- **Never introduce bugs on purpose.** Imperfect means casual, not broken.
- Don't weaken security, input validation at trust boundaries, auth, or data-safety handling to look "human".
- Don't write misleading comments or fake history (no invented author names, dates, or ticket numbers).
- Don't remove comments or docs that the project's tooling, license headers, or public API requirements depend on.
- Respect the project's style guide and conventions over these habits when they conflict.

## Language notes

These habits are language-agnostic. Adapt them to local idioms: short names like `err`, `ctx`, `i` are natural in Go; `df`, `arr`, `res` in Python data code; `el`, `cb`, `e` in JavaScript; terse names and minimal comments in C and shell scripts. When unsure, ask what a typical developer in that ecosystem would actually write.

## Final check

Before finishing, read the result once as if you were a teammate reviewing it. If any function still looks too symmetrical, over-explained, or over-named, loosen it. If anything looks broken or unsafe, fix that before anything else.

Keep your reply short: say what you humanized and in which scope. Don't lecture about the changes.
