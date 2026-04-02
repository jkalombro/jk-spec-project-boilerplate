# jk-spec-project-boilerplate

A personal project boilerplate and spec-driven development harness. Clone this repo to bootstrap any new project — constitutions, scaffolding templates, and AI-assisted workflows are all pre-wired.

---

## What this is

This repo is the starting point for all future projects. It bundles two things together:

1. **Spec-driven development workflow** (`speckit`) — a set of Claude Code slash commands that take a feature description all the way from spec → plan → tasks → implementation, with a project constitution enforcing standards at every step.

2. **Pre-built scaffolding templates** (`.scaffolding/`) — opinionated project starters for specific frameworks. When you run `/create-ui-app angular my-app`, it copies the full Angular boilerplate (NgRx, feature modules, SCSS architecture, shared module, tests) rather than generating a bare `ng new` project.

---

## Project structure

```
.
├── .claude/
│   └── commands/          # Claude Code slash commands
├── .scaffolding/
│   └── angular/           # Angular boilerplate template (NgRx, lazy modules, SCSS)
├── .specify/
│   ├── memory/            # Project constitution and framework-specific standards
│   │   └── language-templates/
│   ├── templates/         # Spec, plan, tasks, checklist templates
│   └── scripts/           # Setup and context-update scripts
├── UI/                    # Frontend application(s) live here
└── API/                   # Backend application(s) live here
```

---

## Slash commands

### Scaffolding

| Command | Description |
|---|---|
| `/create-ui-app <framework> <name>` | Scaffold a new UI app. Uses `.scaffolding/<framework>/` template if available, otherwise bare CLI scaffold. |
| `/create-api-app <framework> <name>` | Scaffold a new API app. Uses `.scaffolding/<framework>/` template if available, otherwise bare CLI scaffold. |

### Speckit — spec-driven development

| Command | Description |
|---|---|
| `/speckit.constitution` | Create or update the project constitution (coding standards, patterns, principles). |
| `/speckit.specify "<description>"` | Turn a feature description into a structured spec. |
| `/speckit.clarify` | Ask up to 5 targeted questions to fill gaps in the current spec. |
| `/speckit.plan` | Generate an implementation plan from the spec. |
| `/speckit.tasks` | Break the plan into a dependency-ordered task list. |
| `/speckit.implement` | Execute the tasks one by one. |
| `/speckit.analyze` | Cross-check spec, plan, and tasks for consistency issues. |
| `/speckit.checklist` | Generate a feature-specific QA/review checklist. |
| `/speckit.taskstoissues` | Convert tasks into GitHub issues. |

---

## Scaffolding templates

Templates live in `.scaffolding/<framework>/` and use two placeholder tokens that get replaced at scaffold time:

| Token | Replaced with |
|---|---|
| `__APP_NAME__` | The app name you pass to the command (e.g., `my-dashboard`) |
| `__APP_TITLE__` | PascalCase version of the name (e.g., `MyDashboard`) |

### Available templates

| Framework | Location | Includes |
|---|---|---|
| Angular | `.scaffolding/angular/` | NgRx global + feature stores, lazy-loaded feature modules (home, about), shared module (badge, logger, string helpers), SCSS design token architecture |

To add a new template: scaffold a project the way you want it, then copy it into `.scaffolding/<framework>/` with the placeholder tokens substituted in.

---

## Constitution

The project constitution (`.specify/memory/constitution.md`) is the source of truth for coding standards. It links to per-framework constitutions under `.specify/memory/language-templates/`.

Claude reads the constitution before writing any code. Run `/speckit.constitution` to create or update it.

---

## Getting started on a new project

```bash
# 1. Clone this boilerplate
git clone <this-repo> my-new-project
cd my-new-project

# 2. Scaffold your UI app (uses the Angular template)
# In Claude Code:
/create-ui-app angular my-app

# 3. Scaffold your API app (bare scaffold — add a template to .scaffolding/ to customize)
/create-api-app dotnet my-api

# 4. Define your first feature
/speckit.specify "users can log in with email and password"
```
