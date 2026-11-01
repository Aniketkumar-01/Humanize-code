#!/usr/bin/env node

/**
 * humanize-code CLI
 * Installer for humanize-code AI agent skill
 */

const fs = require('fs');
const path = require('path');
const os = require('os');
const readline = require('readline');

const PKG_VERSION = '1.0.0';

// ANSI colors
const useColor = !process.env.NO_COLOR && process.stdout.isTTY;
const c = {
  reset: useColor ? '\x1b[0m' : '',
  bold: useColor ? '\x1b[1m' : '',
  dim: useColor ? '\x1b[2m' : '',
  cyan: useColor ? '\x1b[36m' : '',
  green: useColor ? '\x1b[32m' : '',
  yellow: useColor ? '\x1b[33m' : '',
  blue: useColor ? '\x1b[34m' : '',
  magenta: useColor ? '\x1b[35m' : '',
  red: useColor ? '\x1b[31m' : '',
};

// Locate SKILL.md in the package
function getSkillContent() {
  const candidatePaths = [
    path.join(__dirname, '..', 'SKILL.md'),
    path.join(__dirname, '..', 'skills', 'humanize-code', 'SKILL.md')
  ];

  for (const p of candidatePaths) {
    if (fs.existsSync(p)) {
      return fs.readFileSync(p, 'utf8');
    }
  }

  throw new Error('SKILL.md not found in package directory');
}

// Convert SKILL.md content to Cursor .mdc format
function getCursorMdcContent(rawContent) {
  // Strip YAML frontmatter if present
  let body = rawContent;
  if (rawContent.startsWith('---')) {
    const endIdx = rawContent.indexOf('---', 3);
    if (endIdx !== -1) {
      body = rawContent.slice(endIdx + 3).trim();
    }
  }

  return `---
description: Makes code look like it was written by a real developer instead of an AI.
globs: *
alwaysApply: false
---

${body}
`;
}

// Definitions for all supported providers
function getProviderTargets(projectRoot, homeDir) {
  return {
    agents: {
      name: 'Agent Skills (Universal / .agents)',
      detectProject: () => fs.existsSync(path.join(projectRoot, '.agents')) || fs.existsSync(path.join(projectRoot, '.agent')),
      detectGlobal: () => fs.existsSync(path.join(homeDir, '.agent')) || fs.existsSync(path.join(homeDir, '.agents')),
      projectPaths: [
        { type: 'skill', path: path.join(projectRoot, '.agents', 'skills', 'humanize-code', 'SKILL.md') }
      ],
      globalPaths: [
        { type: 'skill', path: path.join(homeDir, '.agent', 'skills', 'humanize-code', 'SKILL.md') }
      ]
    },
    antigravity: {
      name: 'Antigravity / Gemini CLI',
      detectProject: () => fs.existsSync(path.join(projectRoot, '.agents')) || fs.existsSync(path.join(projectRoot, '.gemini')),
      detectGlobal: () => fs.existsSync(path.join(homeDir, '.gemini')),
      projectPaths: [
        { type: 'skill', path: path.join(projectRoot, '.agents', 'skills', 'humanize-code', 'SKILL.md') }
      ],
      globalPaths: [
        { type: 'skill', path: path.join(homeDir, '.gemini', 'config', 'skills', 'humanize-code', 'SKILL.md') }
      ]
    },
    claude: {
      name: 'Claude Code',
      detectProject: () => fs.existsSync(path.join(projectRoot, '.claude')),
      detectGlobal: () => fs.existsSync(path.join(homeDir, '.claude')),
      projectPaths: [
        { type: 'skill', path: path.join(projectRoot, '.claude', 'skills', 'humanize-code', 'SKILL.md') }
      ],
      globalPaths: [
        { type: 'skill', path: path.join(homeDir, '.claude', 'skills', 'humanize-code', 'SKILL.md') }
      ]
    },
    cursor: {
      name: 'Cursor',
      detectProject: () => fs.existsSync(path.join(projectRoot, '.cursor')),
      detectGlobal: () => fs.existsSync(path.join(homeDir, '.cursor')),
      projectPaths: [
        { type: 'skill', path: path.join(projectRoot, '.cursor', 'skills', 'humanize-code', 'SKILL.md') },
        { type: 'cursor-rule', path: path.join(projectRoot, '.cursor', 'rules', 'humanize-code.mdc') }
      ],
      globalPaths: [
        { type: 'skill', path: path.join(homeDir, '.cursor', 'skills', 'humanize-code', 'SKILL.md') }
      ]
    },
    windsurf: {
      name: 'Windsurf',
      detectProject: () => fs.existsSync(path.join(projectRoot, '.windsurf')) || fs.existsSync(path.join(projectRoot, '.windsurfrules')),
      detectGlobal: () => fs.existsSync(path.join(homeDir, '.codeium', 'windsurf')),
      projectPaths: [
        { type: 'skill', path: path.join(projectRoot, '.windsurf', 'skills', 'humanize-code', 'SKILL.md') }
      ],
      globalPaths: []
    },
    copilot: {
      name: 'GitHub Copilot',
      detectProject: () => fs.existsSync(path.join(projectRoot, '.github')),
      detectGlobal: () => false,
      projectPaths: [
        { type: 'skill', path: path.join(projectRoot, '.github', 'skills', 'humanize-code', 'SKILL.md') }
      ],
      globalPaths: []
    },
    codex: {
      name: 'Codex / OpenCode',
      detectProject: () => fs.existsSync(path.join(projectRoot, '.codex')),
      detectGlobal: () => fs.existsSync(path.join(homeDir, '.codex')),
      projectPaths: [
        { type: 'skill', path: path.join(projectRoot, '.codex', 'skills', 'humanize-code', 'SKILL.md') }
      ],
      globalPaths: [
        { type: 'skill', path: path.join(homeDir, '.codex', 'skills', 'humanize-code', 'SKILL.md') }
      ]
    }
  };
}

function prompt(query) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  return new Promise(resolve => rl.question(query, ans => {
    rl.close();
    resolve(ans.trim());
  }));
}

function printHeader() {
  console.log(`
${c.cyan}${c.bold}=====================================================${c.reset}
${c.cyan}${c.bold}  humanize-code v${PKG_VERSION}${c.reset}
${c.dim}  Makes AI-generated code look human and authentic${c.reset}
${c.cyan}${c.bold}=====================================================${c.reset}
`);
}

function printHelp() {
  printHeader();
  console.log(`
${c.bold}USAGE:${c.reset}
  npx humanize-code [command] [options]

${c.bold}COMMANDS:${c.reset}
  ${c.green}install${c.reset}              Install the humanize-code skill (default)
  ${c.yellow}status${c.reset}               Check installation status across providers
  ${c.red}uninstall${c.reset}            Remove humanize-code from providers
  ${c.cyan}help${c.reset}                 Show this help message

${c.bold}OPTIONS:${c.reset}
  ${c.bold}-s, --scope <scope>${c.reset}    Installation scope: ${c.cyan}project${c.reset}, ${c.cyan}global${c.reset}, or ${c.cyan}both${c.reset}
  ${c.bold}-g, --global${c.reset}           Shortcut for --scope global
  ${c.bold}-p, --project${c.reset}          Shortcut for --scope project
  ${c.bold}--providers <list>${c.reset}     Comma-separated providers (e.g. claude,cursor,antigravity) or 'all'
  ${c.bold}-y, --yes${c.reset}              Non-interactive mode, accept defaults
  ${c.bold}--dry-run${c.reset}              Show actions without writing files
  ${c.bold}-v, --version${c.reset}          Show version

${c.bold}SUPPORTED PROVIDERS:${c.reset}
  - ${c.bold}antigravity${c.reset} (Google Antigravity & Gemini CLI)
  - ${c.bold}claude${c.reset}      (Claude Code)
  - ${c.bold}cursor${c.reset}      (Cursor Skills & Rules)
  - ${c.bold}windsurf${c.reset}    (Windsurf / Cascade)
  - ${c.bold}copilot${c.reset}     (GitHub Copilot)
  - ${c.bold}codex${c.reset}       (Codex / OpenCode)
  - ${c.bold}agents${c.reset}      (Universal .agents standard)

${c.bold}EXAMPLES:${c.reset}
  ${c.dim}# Interactive install:${c.reset}
  npx humanize-code install

  ${c.dim}# Non-interactive install into current project for all providers:${c.reset}
  npx humanize-code install -y --scope project --providers all

  ${c.dim}# Install globally for Claude Code and Cursor:${c.reset}
  npx humanize-code install -g --providers claude,cursor

  ${c.dim}# Check where humanize-code is installed:${c.reset}
  npx humanize-code status
`);
}

function parseArgs(args) {
  const result = {
    command: 'install',
    scope: null,
    providers: null,
    yes: false,
    dryRun: false,
    version: false,
    help: false
  };

  let i = 0;
  if (args.length > 0 && !args[0].startsWith('-')) {
    result.command = args[0].toLowerCase();
    i = 1;
  }

  for (; i < args.length; i++) {
    const arg = args[i];
    if (arg === '-h' || arg === '--help' || arg === 'help') {
      result.help = true;
    } else if (arg === '-v' || arg === '--version') {
      result.version = true;
    } else if (arg === '-y' || arg === '--yes') {
      result.yes = true;
    } else if (arg === '--dry-run') {
      result.dryRun = true;
    } else if (arg === '-g' || arg === '--global') {
      result.scope = 'global';
    } else if (arg === '-p' || arg === '--project') {
      result.scope = 'project';
    } else if (arg === '-s' || arg === '--scope') {
      result.scope = args[++i];
    } else if (arg.startsWith('--scope=')) {
      result.scope = arg.split('=')[1];
    } else if (arg === '--providers') {
      result.providers = args[++i];
    } else if (arg.startsWith('--providers=')) {
      result.providers = arg.split('=')[1];
    }
  }

  return result;
}

async function runInstall(options, projectRoot, homeDir) {
  const providersDef = getProviderTargets(projectRoot, homeDir);
  const isTTY = process.stdin.isTTY && !options.yes;

  let chosenScope = options.scope;
  if (!chosenScope) {
    if (isTTY) {
      console.log(`${c.bold}Where would you like to install humanize-code?${c.reset}`);
      console.log(`  ${c.cyan}1)${c.reset} Current project (${path.basename(projectRoot) || projectRoot}) ${c.green}[Recommended]${c.reset}`);
      console.log(`  ${c.cyan}2)${c.reset} Globally (~${path.sep}) for all projects`);
      console.log(`  ${c.cyan}3)${c.reset} Both (project and global)`);
      const ans = await prompt(`Select [1-3] (default 1): `);
      if (ans === '2') chosenScope = 'global';
      else if (ans === '3') chosenScope = 'both';
      else chosenScope = 'project';
      console.log('');
    } else {
      chosenScope = 'project';
    }
  }

  let selectedProviderKeys = [];
  if (options.providers) {
    if (options.providers === 'all') {
      selectedProviderKeys = Object.keys(providersDef);
    } else {
      const parts = options.providers.split(',').map(s => s.trim().toLowerCase());
      for (const p of parts) {
        if (providersDef[p]) {
          selectedProviderKeys.push(p);
        } else {
          console.warn(`${c.yellow}! Unknown provider '${p}', skipping.${c.reset}`);
        }
      }
    }
  } else if (isTTY) {
    console.log(`${c.bold}Which AI coding tools do you want to target?${c.reset}`);
    console.log(`  ${c.cyan}1)${c.reset} All supported tools ${c.green}[Recommended]${c.reset}`);

    // Detect installed
    const detected = Object.keys(providersDef).filter(k => {
      const p = providersDef[k];
      return chosenScope === 'global' ? p.detectGlobal() : (p.detectProject() || p.detectGlobal());
    });

    if (detected.length > 0) {
      console.log(`  ${c.cyan}2)${c.reset} Auto-detected only (${detected.join(', ')})`);
    }

    const ans = await prompt(`Select [1${detected.length > 0 ? '/2' : ''}] (default 1): `);
    if (ans === '2' && detected.length > 0) {
      selectedProviderKeys = detected;
    } else {
      selectedProviderKeys = Object.keys(providersDef);
    }
    console.log('');
  } else {
    selectedProviderKeys = Object.keys(providersDef);
  }

  if (selectedProviderKeys.length === 0) {
    selectedProviderKeys = Object.keys(providersDef);
  }

  const skillRaw = getSkillContent();
  const cursorMdc = getCursorMdcContent(skillRaw);

  const scopes = chosenScope === 'both' ? ['project', 'global'] : [chosenScope];
  const writtenFiles = [];
  const seenPaths = new Set();

  console.log(`${c.bold}Installing humanize-code skill...${c.reset}\n`);

  for (const s of scopes) {
    for (const key of selectedProviderKeys) {
      const provider = providersDef[key];
      const paths = s === 'global' ? provider.globalPaths : provider.projectPaths;

      for (const item of paths) {
        const filePath = item.path;
        if (seenPaths.has(filePath)) continue;
        seenPaths.add(filePath);

        const content = item.type === 'cursor-rule' ? cursorMdc : skillRaw;
        const dir = path.dirname(filePath);

        if (options.dryRun) {
          console.log(`  ${c.dim}[dry-run] Would write:${c.reset} ${filePath}`);
          writtenFiles.push(filePath);
          continue;
        }

        try {
          fs.mkdirSync(dir, { recursive: true });
          fs.writeFileSync(filePath, content, 'utf8');
          console.log(`  ${c.green}✔${c.reset} ${c.bold}${provider.name}:${c.reset} ${filePath}`);
          writtenFiles.push(filePath);
        } catch (err) {
          console.error(`  ${c.red}✖ Failed to write ${filePath}:${c.reset} ${err.message}`);
        }
      }
    }
  }

  console.log('');
  if (writtenFiles.length > 0) {
    console.log(`${c.green}${c.bold}✨ Successfully installed humanize-code (${writtenFiles.length} file${writtenFiles.length === 1 ? '' : 's'})!${c.reset}`);
    console.log(`
${c.bold}How to use it:${c.reset}
  1. Open your AI coding assistant (Antigravity, Claude Code, Cursor, Copilot, etc.)
  2. Reload or restart your editor/session if needed
  3. Prompt naturally or invoke:
     ${c.cyan}• "Humanize this code"${c.reset}
     ${c.cyan}• "Make this look like a real person wrote it"${c.reset}
     ${c.cyan}• /humanize-code${c.reset}
`);
  } else {
    console.log(`${c.yellow}No files were installed.${c.reset}`);
  }
}

async function runUninstall(options, projectRoot, homeDir) {
  const providersDef = getProviderTargets(projectRoot, homeDir);
  const chosenScope = options.scope || 'both';
  const scopes = chosenScope === 'both' ? ['project', 'global'] : [chosenScope];
  const keys = options.providers
    ? (options.providers === 'all' ? Object.keys(providersDef) : options.providers.split(',').map(s => s.trim().toLowerCase()))
    : Object.keys(providersDef);

  console.log(`${c.bold}Uninstalling humanize-code skill...${c.reset}\n`);
  let removedCount = 0;
  const seenPaths = new Set();

  for (const s of scopes) {
    for (const key of keys) {
      const provider = providersDef[key];
      if (!provider) continue;
      const paths = s === 'global' ? provider.globalPaths : provider.projectPaths;

      for (const item of paths) {
        if (seenPaths.has(item.path)) continue;
        seenPaths.add(item.path);

        if (fs.existsSync(item.path)) {
          if (options.dryRun) {
            console.log(`  ${c.dim}[dry-run] Would delete:${c.reset} ${item.path}`);
            removedCount++;
            continue;
          }
          try {
            fs.unlinkSync(item.path);
            console.log(`  ${c.green}✔ Removed:${c.reset} ${item.path}`);
            removedCount++;

            // Clean up empty directory if possible
            const parentDir = path.dirname(item.path);
            if (fs.existsSync(parentDir) && fs.readdirSync(parentDir).length === 0) {
              fs.rmdirSync(parentDir);
            }
          } catch (err) {
            console.error(`  ${c.red}✖ Failed to remove ${item.path}:${c.reset} ${err.message}`);
          }
        }
      }
    }
  }

  console.log('');
  if (removedCount > 0) {
    console.log(`${c.green}${c.bold}✔ Removed ${removedCount} file(s).${c.reset}\n`);
  } else {
    console.log(`${c.dim}No installed humanize-code files found to remove.${c.reset}\n`);
  }
}

function runStatus(projectRoot, homeDir) {
  printHeader();
  const providersDef = getProviderTargets(projectRoot, homeDir);

  console.log(`${c.bold}Installation Status:${c.reset}\n`);

  for (const key of Object.keys(providersDef)) {
    const provider = providersDef[key];
    console.log(`${c.bold}${c.cyan}${provider.name}${c.reset}`);

    // Project paths
    for (const item of provider.projectPaths) {
      const exists = fs.existsSync(item.path);
      const icon = exists ? `${c.green}✔ installed${c.reset}` : `${c.dim}not installed${c.reset}`;
      console.log(`  [project] ${icon}  ${item.path}`);
    }

    // Global paths
    for (const item of provider.globalPaths) {
      const exists = fs.existsSync(item.path);
      const icon = exists ? `${c.green}✔ installed${c.reset}` : `${c.dim}not installed${c.reset}`;
      console.log(`  [global]  ${icon}  ${item.path}`);
    }
    console.log('');
  }
}

async function main() {
  const args = process.argv.slice(2);
  const options = parseArgs(args);

  if (options.version) {
    console.log(`humanize-code v${PKG_VERSION}`);
    process.exit(0);
  }

  if (options.help) {
    printHelp();
    process.exit(0);
  }

  const projectRoot = process.cwd();
  const homeDir = os.homedir();

  switch (options.command) {
    case 'install':
      printHeader();
      await runInstall(options, projectRoot, homeDir);
      break;

    case 'uninstall':
    case 'remove':
      printHeader();
      await runUninstall(options, projectRoot, homeDir);
      break;

    case 'status':
    case 'check':
      runStatus(projectRoot, homeDir);
      break;

    default:
      console.error(`${c.red}Unknown command: ${options.command}${c.reset}`);
      printHelp();
      process.exit(1);
  }
}

main().catch(err => {
  console.error(`${c.red}Error:${c.reset}`, err);
  process.exit(1);
});
