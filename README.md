# humanize-code 🧑‍💻

[![npm version](https://img.shields.io/badge/npm-1.0.0-cb3837.svg?style=flat-square)](https://www.npmjs.com/package/humanize-code)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)](LICENSE)
[![Node.js](https://img.shields.io/badge/node-%3E%3D16.0.0-brightgreen.svg?style=flat-square)](https://nodejs.org/)

An AI agent skill that makes code look like it was written by an experienced human developer instead of an AI.

Works across **Google Antigravity**, **Claude Code**, **Cursor**, **GitHub Copilot**, **Windsurf**, **Codex**, and any harness adhering to the universal `.agents` standard.

---

## ⚡ Quick Install

Run this in your terminal:

```bash
npx humanize-code install
```

The interactive installer will ask where to install (current project or globally) and which AI coding harnesses to target.

### Non-Interactive Quick Commands

```bash
# Install to current project for all tools (no prompts)
npx humanize-code install -y

# Install globally for all projects on your machine
npx humanize-code install -g -y

# Install specifically for Claude Code and Cursor
npx humanize-code install --providers claude,cursor -y

# Check where humanize-code is currently installed
npx humanize-code status

# Uninstall / remove
npx humanize-code uninstall
```

---

## 💡 Why humanize-code?

AI-generated code gives itself away immediately:

* ❌ Every 3-line function has a 10-line JSDoc or docstring.
* ❌ Identifiers are absurdly verbose (`userSubscriptionBillingCycleRenewalTimestamp`).
* ❌ Trivial lines have redundant comments (`// loop through items`, `// check if user exists`).
* ❌ Premature abstractions and design patterns for simple scripts.
* ❌ Symmetrical, machine-polished formatting that screams "LLM output".

**`humanize-code` teaches your AI to write code the way real developers do:**

* ✔️ **Practical Naming:** Short, idiomatic names (`res`, `cnt`, `idx`, `cfg`, `usr`, `items`, `err`).
* ✔️ **Sensible Comments:** Only explain *why*, edge cases, or gotchas. Casual tone (`// weird quirk in legacy API`).
* ✔️ **Real-World Structure:** 30-line functions are fine; no pointless single-line micro-helpers.
* ✔️ **Zero Logic Changes:** Only refactors style, naming, comments, and polish—never breaks behavior or introduces bugs.

---

## 🛠 Supported AI Coding Assistants

| Tool | Project Scope | Global Scope |
| :--- | :--- | :--- |
| **Google Antigravity & Gemini CLI** | `.agents/skills/humanize-code/SKILL.md` | `~/.gemini/config/skills/humanize-code/` |
| **Claude Code** | `.claude/skills/humanize-code/SKILL.md` | `~/.claude/skills/humanize-code/` |
| **Cursor** | `.cursor/skills/` & `.cursor/rules/humanize-code.mdc` | `~/.cursor/skills/humanize-code/` |
| **Windsurf / Cascade** | `.windsurf/skills/humanize-code/SKILL.md` | `~/.codeium/windsurf/skills/` |
| **GitHub Copilot** | `.github/skills/humanize-code/SKILL.md` | — |
| **Codex / OpenCode** | `.codex/skills/humanize-code/SKILL.md` | `~/.codex/skills/humanize-code/` |
| **Universal Agents** | `.agents/skills/humanize-code/SKILL.md` | `~/.agent/skills/humanize-code/` |

---

## 🚀 How to Use It

Once installed, reload your editor or start a new agent session. Your AI coding assistant will automatically recognize the skill!

### 1. Slash Command
```text
/humanize-code
```

### 2. Natural Language
Just ask your agent in plain English:

* *"Humanize this code"*
* *"Make this function look like a real developer wrote it, not an AI"*
* *"Clean up the AI-style comments and verbose variable names in this file"*
* *"Review this PR and remove the AI slop styling"*

### 3. Target Specific Scopes
* *"Humanize only the comments in auth.ts"*
* *"Only humanize the variable naming in this function"*
* *"Match the existing coding style of the repo"*

---

## 📖 The Core Habits

### 1. Naming
- Use short, natural names: `res`, `cnt`, `tmp`, `val`, `idx`, `cfg`, `usr`, `data`, `items`, `i`, `j`.
- Don't over-explain: `getUserSubscriptionRenewalDate` → `getRenewal` or `renewDate`.
- Avoid unnecessary suffix patterns (`Manager`, `Handler`, `Helper`, `Impl`) unless already present in the project.

### 2. Comments
- Write far fewer. Most lines need none.
- Comment the **why** or workaround, never what the next line obviously does.
- Skip docstrings on small or internal functions.
- Natural, casual tone is fine: `// TODO: cleanup later`, `# not pretty but it works`.

### 3. Structure
- Avoid unnecessary boilerplate (factories, builders, wrappers) for simple logic.
- Allow modest repetition instead of over-abstracting everything.

### 4. Non-Negotiable Guardrails
- **Identical Behavior:** The code must execute identically and pass all existing tests.
- **Never Inject Bugs:** Imperfect means casual and human, not broken.
- **Security First:** Never weaken security checks, auth, sanitization, or trust boundaries to look "casual".

---

## 💻 CLI Command Reference

```text
USAGE:
  npx humanize-code [command] [options]

COMMANDS:
  install              Install the skill files (default)
  status               Display installation status across all providers
  uninstall            Remove installed skill files
  help                 Display CLI help

OPTIONS:
  -s, --scope <scope>  Target scope: 'project', 'global', or 'both'
  -p, --project        Install to current project directory
  -g, --global         Install globally in user home directory
  --providers <list>   Comma-separated list (e.g. claude,cursor) or 'all'
  -y, --yes            Skip interactive prompts and accept defaults
  --dry-run            Simulate installation without writing files
  -v, --version        Print version
```

---

## 📦 Publishing & Contributing

### For Repository Maintainers

1. **Test locally:**
   ```bash
   node bin/cli.js status
   node bin/cli.js install -y --dry-run
   ```

2. **Publish to npm:**
   ```bash
   npm login
   npm publish --access public
   ```

Once published to npm, anyone in the world can run `npx humanize-code install` with zero installation required!

---

## 📄 License

[MIT](LICENSE) © 2026 Aniket Kumar

