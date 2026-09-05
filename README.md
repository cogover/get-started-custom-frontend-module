# Get Started: Custom Frontend Module

A complete vanilla TypeScript + Vite page ready to build for a Cogover Custom
Frontend Module. It displays the onboarding "Hello" card and loads assets using
relative URLs, including when hosted under a slot such as `/_cm_1/`.

No workspace configuration or credentials are needed to run the page locally.
This is a standalone static sample; it does not call the backend Lead sample.

## Requirements

- Node.js **20.19+ or 22.12+** and npm (22.12+ recommended).
  Earlier Node 20/22 releases are not supported by Vite 8.
- To deploy: permission to create/publish a Custom Frontend Module.
- For CLI deployment: the latest Cogover Dev CLI and a **Workspace API key**.
  A backend Project key and `cogover-dev login` are not needed.

## 1. Install and run

Download/clone this repository and open the directory containing `package.json`:

```bash
npm ci
npm run dev
```

Open [http://127.0.0.1:5173](http://127.0.0.1:5173). You should see
"Hello from your first frontend module". Stop with Ctrl+C.

- `src/main.ts` renders the static sample; use `textContent` for untrusted text
  if you later add dynamic data.
- `src/style.css` includes responsive spacing and text wrapping.
- `vite.config.ts` sets `base: "./"`; keep this to support Cogover slot URLs.
- `index.html` includes language, page title and a zoom-friendly viewport.
- No external fonts, analytics, remote images or API calls are required.

## 2. Build and verify

```bash
npm run build
npm run preview
```

Open [http://127.0.0.1:4173](http://127.0.0.1:4173). The build output is:

```text
dist/
├── index.html
└── assets/
    ├── index-<hash>.js
    └── index-<hash>.css
```

For automated browser tests, stop preview if it conflicts with another process,
then install the test browser once:

```bash
npx playwright install chromium
npm run check
```

On a minimal Linux container, use `npx playwright install --with-deps chromium`
instead (system dependency installation may require root).
`npm run check` rebuilds and tests Chromium at 320, 375, 768 and 1440px widths,
including enlarged text, no horizontal overflow, relative asset loading and
no JavaScript errors. A test-only server hosts `dist/` under `/_cm_1/` with
no root asset aliases or SPA fallback. Test screenshots are ignored by Git.

## 3. Create a Cogover Project

In the workspace UI, open **Custom Frontend Module** and create a Project if
needed. Record its **Project ID** (`FEP...`) and assigned **slugSlot**
(for example `_cm_1`). If you were given a Project, use that one.

The slot is assigned by Cogover; do not assume every workspace uses `_cm_1`.
It is a URL segment, not the Project ID or a backend Project slug.

## 4. Upload to Cogover

Choose either approach below; both create and activate a version of the same
Project. Do not run both just to publish one version.

### Option A: manually through the UI

From this repository root (requires the `zip` utility):

```bash
npm run build
zip -r hello-frontend.zip dist -x '*/.*' '__MACOSX/*'
```

Use a new ZIP filename (or remove your old generated ZIP first) to avoid stale
entries from an earlier archive. The exclusions omit hidden/macOS metadata files.
The ZIP must contain `dist/index.html` and `dist/assets/...`, not merely the
contents of `dist` at its root.

Open the Project's versions in Custom Frontend Module, create a version, upload
`hello-frontend.zip` as a private file, wait for `READY`, and activate it.
If the version fails, fix the reported build/archive issue and create a new one.

### Option B: Cogover Dev CLI

```bash
npm install --global @cogover/dev-cli
cogover-dev --version
cp cogover.example.json cogover.json
```

Edit the ignored `cogover.json` with your own workspace origin and Project ID:

```json
{
  "version": 1,
  "runtimeUrl": "https://example.cogover.com",
  "projectId": "FEPXXXXXXXXXXXX",
  "projectType": "frontend"
}
```

Keep **`"projectType": "frontend"`**. If omitted, CLI defaults to backend.
Use the full HTTPS workspace origin with no path. Do not put a key or
`slugSlot` in this configuration. CLI publishes existing Projects; it does not
create them.

```bash
npm run build
cogover-dev publish
```

The CLI requires `dist/index.html`, automatically ZIPs `dist/`, uploads it as
private, creates a version and waits for `READY` or `FAILED`. It **does not
build for you**: rebuild after every source change. Its temporary ZIP is removed
afterward; `dist/` is preserved.

The **Workspace API key** is read from `COGOVER_API_KEY` in the Project `.env`
first, then the native credential store. Otherwise CLI prompts with hidden
input. It saves a successfully authenticated prompted key in native storage
where available, or a private ignored `.env` as fallback. In non-interactive
Docker/CI, securely provision that `.env` beforehand, outside upload artifacts.

If you already made the correctly structured ZIP, you may run
`cogover-dev publish hello-frontend.zip` instead. A supplied ZIP is not deleted.

On success, use the exact **FEV... version ID** and activation command printed:

```bash
cogover-dev activate VERSION_ID
```

Do not pass the FEP... Project ID. Only activate a version that belongs to the
intended Project and is `READY`. Activation changes what workspace users see.

## 5. Open the deployed page

Sign in to your workspace in the browser and visit:

```text
https://example.cogover.com/SLUG_SLOT/index.html
```

Replace the domain and `SLUG_SLOT` with the assigned values. For an assigned
slot `_cm_1`, the path is `/_cm_1/index.html`. Verify the Hello card and check
the browser Network/Console panels for missing assets or errors.

CLI authentication does not log your browser in. Local browser tests prove
the build works under a prefix; they do not prove deployment or workspace
login. There is no assumed SPA fallback: use hash routing if adding client-side
routes unless your hosting explicitly supports another routing scheme.

## Before publishing this repository

- Everything under `src/`, `public/` (if added) and generated `dist/` can be
  read by end-users. Never put API keys, tokens or private data there.
- **`VITE_*` values are embedded in client code**. An ignored `.env` does not
  make a secret safe if Vite bundles its value.
- The CLI Workspace API key is for deployment only; do not read it from app code.
- `cogover.json`, `.env*`, session files, logs, ZIPs and generated artifacts
  are excluded by `.gitignore`. Review staged files; ignored files that were
  already tracked can still be committed.
- Only upload `dist/`, never the whole repository or `node_modules/`.
- `test/` and the test static host are local development tools, not production
  servers, and are not included in the Vite build.

Licensed under MIT; see [LICENSE](LICENSE).
