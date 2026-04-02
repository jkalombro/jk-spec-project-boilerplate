---
description: Scaffold a new API application and wire its framework constitution into the project.
---

## User Input

```text
$ARGUMENTS
```

You **MUST** consider the user input before proceeding (if not empty).

## Outline

### Step 0 — Argument Validation

Parse `FRAMEWORK` and `APP_NAME` from `$ARGUMENTS` (first and second whitespace-separated tokens).

- Normalize `FRAMEWORK` to lowercase (e.g., `DotNet` → `dotnet`, `NestJS` → `nestjs`, `ASP.NET` → `aspnet`).
- If either argument is missing: output the following and **stop**:
  ```
  Usage: /create-api-app <framework> <app-name>
  Example: /create-api-app dotnet my-api
  ```
- If `APP_NAME` contains spaces: warn the user ("App names with spaces are non-standard and may cause issues with scaffold tools. Proceed anyway? (yes/no)") and wait for confirmation before continuing.

---

### Step 1 — Constitution Handling

1. **Guard check**: Verify `.specify/memory/constitution.md` exists. If it does not → stop with:
   ```
   constitution.md not found. Run /speckit.constitution first to initialize your project constitution.
   ```

2. Compute the template path: `.specify/memory/language-templates/<FRAMEWORK>.constitution.md`

3. Check if the template file exists.

**Branch A — Template EXISTS:**

   a. Read `.specify/memory/constitution.md` and scan for a line matching the pattern `## API Constitution — ` (case-insensitive match on the framework name that follows). If a matching section is already present:
      - Inform the user: "A `## API Constitution — <Framework>` section already exists in `constitution.md`. Skipping append. Run `/speckit.constitution` to update it."
      - Proceed to Step 2.

   b. Read `.specify/memory/language-templates/<FRAMEWORK>.constitution.md`. Strip the first line if it begins with `# This contains` (it is a file-level comment that becomes noise inside `constitution.md`).

   c. Append the following block to the end of `.specify/memory/constitution.md` (after a blank line):

      ```markdown

      ---

      ## API Constitution — <Framework>
      <!-- Sourced from .specify/memory/language-templates/<framework>.constitution.md on <today's date YYYY-MM-DD> -->

      <stripped template content verbatim>
      ```

      Where `<Framework>` is title-cased (e.g., `dotnet` → `Dotnet`, `nestjs` → `NestJS`, `express` → `Express`).

   d. After appending, scan the newly added content for any remaining tokens matching the pattern `[ALL_CAPS_IDENTIFIER]` (bracket-wrapped uppercase identifiers). If any are found, emit a prominent warning:

      > **⚠ Warning:** The API Constitution section for `<Framework>` still contains unfilled placeholder tokens (e.g., `[PRINCIPLE_1_NAME]`). Run `/speckit.constitution` to fill them in before planning features.

**Branch B — Template DOES NOT EXIST:**

   Inform the user: "No language template found at `.specify/memory/language-templates/<FRAMEWORK>.constitution.md`."

   Then invoke `/speckit.constitution` with the following argument:

   > Define an API constitution for the `<FRAMEWORK>` framework. Focus on: API architecture style (REST/GraphQL/gRPC), error response format and status codes, authentication and authorization strategy, API versioning policy, data validation approach, database/ORM conventions, testing approach (unit, integration, contract), and observability (logging, tracing, metrics). Scope this to backend/API development concerns only. Add it as a section titled `## API Constitution — <Framework>` in constitution.md.

   Wait for `/speckit.constitution` to complete before proceeding to Step 2.

---

### Step 2 — Determine Project Location

Check the `API/` directory at the repo root.

**Detection logic (evaluate in order):**

1. Does `API/` not exist, or exist but contain no files (including hidden files)? → **Case A** (fresh scaffold).

2. Does `API/` contain any of the following project-marker files directly at its root: `package.json`, `*.csproj`, `*.sln`, `Program.cs`, `Startup.cs`, `requirements.txt`, `pyproject.toml`, `manage.py`, `go.mod`, `Cargo.toml`, `pom.xml`, `build.gradle`, `tsconfig.json`, `.eslintrc*`? → **Case B** (existing single project at root).

3. Does `API/` contain subdirectories but no project-marker files at root? → **Case C** (multi-project mode).

4. Does `API/` contain both project-marker files at root AND subdirectories? → **Case B** (root-level project takes precedence).

**Case A actions:** Note that `API/` is empty or absent. The scaffold will create `API/<APP_NAME>/`; you will flatten it to `API/` afterward (Step 3).

**Case B actions — find existing project name:**

1. Attempt to read `API/package.json` → extract the `name` field.
2. If absent, look for a `*.csproj` file in `API/` → use the filename without extension.
3. If absent, look for a `*.sln` file in `API/` → use the filename without extension.
4. If absent, read `API/pyproject.toml` → extract the `[tool.poetry] name` or `[project] name` field.
5. If absent, read `API/go.mod` → extract the module name (first line: `module <name>`).
6. If still undetermined → **ask the user**: "I found an existing project in `API/` but could not determine its name. What should I name its subfolder when reorganizing?" Wait for response.

Once `EXISTING_NAME` is known:
1. Create `API/<EXISTING_NAME>/`.
2. Capture the list of all current top-level entries in `API/` (excluding `<EXISTING_NAME>/` itself) using `ls -A API/`.
3. Move each captured entry into `API/<EXISTING_NAME>/`.
4. Verify the move succeeded by checking that the marker file (e.g., `API/<EXISTING_NAME>/package.json`, `API/<EXISTING_NAME>/*.csproj`) now exists in the subfolder.

**Guard — name conflict:** Before scaffolding, check if `API/<APP_NAME>/` already exists (in Cases B/C) or if `API/` already contains project files matching `<APP_NAME>` (Case A). If a conflict is detected → stop with:
```
Conflict: API/<APP_NAME> already exists. Choose a different app name or remove the existing folder first.
```

---

### Step 3 — Scaffold the Project

Determine the scaffold command from `FRAMEWORK`:

| Framework | Scaffold Command |
|---|---|
| `dotnet`, `.net`, `aspnet`, `asp.net` | `dotnet new webapi -n <APP_NAME> -o <APP_NAME>` |
| `nestjs` | `npx @nestjs/cli new <APP_NAME>` |
| `express`, `nodejs`, `node` | `mkdir <APP_NAME> && cd <APP_NAME> && npm init -y && npm install express` |
| `fastapi`, `python` | Create `<APP_NAME>/main.py` with a minimal FastAPI app stub and `<APP_NAME>/requirements.txt` containing `fastapi` and `uvicorn` |
| `django`, `python-django` | `django-admin startproject <APP_NAME>` |
| `spring`, `java` | `spring init --name=<APP_NAME> --artifact-id=<APP_NAME> <APP_NAME>` (requires Spring CLI; if not available, instruct the user to use https://start.spring.io) |
| `go`, `golang` | `mkdir <APP_NAME> && cd <APP_NAME> && go mod init <APP_NAME>` |
| anything else | Ask the user: "I don't have a built-in scaffold command for `<FRAMEWORK>`. Please provide the scaffold command to run from inside `API/`, or type `skip` to create the folder manually." Wait for response. |

**If user provides a custom command:** use it exactly as provided for the execution step below.

**If user types `skip`:**
- Create `API/<APP_NAME>/` (or `API/` in Case A) as an empty directory.
- Note in the summary that scaffolding was skipped.
- Jump to Step 4.

**Execution:**

Run the scaffold command from inside `API/` (i.e., set working directory to `API/`). This creates `API/<APP_NAME>/` as output.

- **Case A only (flatten):** After scaffolding succeeds, move the contents of `API/<APP_NAME>/` up to `API/` and remove the now-empty subfolder:
  ```bash
  cd API && mv <APP_NAME>/* <APP_NAME>/.??* . 2>/dev/null; rmdir <APP_NAME>
  ```
  Verify by confirming a marker file (e.g., `package.json`, `*.csproj`, `go.mod`) now exists at `API/` root.

- **Cases B and C:** No post-scaffold move needed. The project is already in `API/<APP_NAME>/`.

**If the scaffold command fails** (e.g., CLI not found on PATH): report the error output verbatim, suggest installing the required CLI tool (e.g., `dotnet SDK`, `npm install -g @nestjs/cli`), and stop. Do not proceed to Step 4.

---

### Step 4 — Output Summary

Print the following summary:

```
## Summary — create-api-app complete

- Framework:    <FRAMEWORK>
- App name:     <APP_NAME>
- Location:     API/              ← (Case A: single project, files at root)
                API/<APP_NAME>/   ← (Cases B/C: multi-project, named subfolder)

- Constitution: Section "## API Constitution — <Framework>" added to
                .specify/memory/constitution.md
```

If constitution placeholders remain unfilled, append:

```
  ⚠ WARNING: Unfilled placeholder tokens remain in the constitution section.
    Run /speckit.constitution to fill them in.
```

If the constitution section was skipped (already existed), append:

```
  ℹ Constitution section already existed — no changes made.
    Run /speckit.constitution to update it.
```

Then print:

```
## Next Steps

1. Fill in any constitution placeholders: /speckit.constitution
2. Define features for this app:        /speckit.specify "<feature description>"
```
