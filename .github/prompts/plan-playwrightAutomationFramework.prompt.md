## Plan: Scalable Playwright TypeScript Automation Framework

TL;DR: Bootstrap a Page Object Model framework using @playwright/test + TypeScript, npm, with folders tests/ pages/ locators/ utils/ config/ base/. base/ holds reusable Playwright action wrappers (click, type, navigate, etc.) that all Page Objects extend/use. JSON-based environment config loaded via a ConfigManager util. Screenshot-on-failure via playwright.config.ts `use.screenshot` + a custom test fixture/reporter hook for named failure screenshots. Sample tests target playwright.dev demo site (todomvc or playwright.dev itself).

**Steps**

Phase A — Project bootstrap (sequential)
1. Initialize npm project: `package.json`, `tsconfig.json`, install `@playwright/test`, `typescript`, `dotenv` (optional), `@types/node`.
2. Run `npx playwright install` note in README (not executed automatically, mention as setup step).
3. Create `.gitignore` (node_modules, test-results, playwright-report, .env).

Phase B — Folder scaffolding (parallel once Phase A done)
4. `config/` — `config/env/dev.json`, `config/env/qa.json` (baseUrl, timeout, credentials placeholders), `config/ConfigManager.ts` (loads JSON based on `process.env.ENV`, default `dev`).
5. `base/` — `base/BasePage.ts` (constructor takes `Page`, exposes wrapped actions: `navigateTo`, `click`, `fill`, `getText`, `isVisible`, `waitForElement`, `selectOption`, etc., each with logging/try-catch); `base/BaseTest.ts` — custom Playwright `test` fixture (extends `test` from `@playwright/test`) that injects page objects and attaches screenshot-on-failure logic via `testInfo`.
6. `locators/` — one file per page, e.g. `locators/LoginPageLocators.ts`, exporting locator string constants/selectors object (kept separate from page objects for maintainability).
7. `pages/` — Page Object classes extending `BasePage`, e.g. `pages/LoginPage.ts`, `pages/HomePage.ts`; import locators from `locators/`, expose high-level methods (`login()`, `search()`).
8. `utils/` — `utils/Logger.ts` (simple console/pino wrapper), `utils/ScreenshotHelper.ts` (capture + save named screenshot to `test-results/screenshots`), `utils/TestDataHelper.ts` (optional, reads JSON test data), `utils/waitUtils.ts` if needed beyond BasePage.
9. `tests/` — sample spec(s) e.g. `tests/example.spec.ts` importing the custom `test` from `base/BaseTest.ts` and page objects; demonstrates POM usage against playwright.dev.

Phase C — Config & failure handling (depends on B)
10. `playwright.config.ts` at root: set `testDir: './tests'`, `use: { screenshot: 'only-on-failure', trace: 'on-first-retry', video: 'retain-on-failure', baseURL: ConfigManager.get('baseUrl') }`, reporters `['list', 'html']`.
11. Wire `base/BaseTest.ts` fixture's `afterEach`/`test.afterEach` (or use built-in `testInfo.attach`) to explicitly capture a full-page screenshot via `ScreenshotHelper` when `testInfo.status !== testInfo.expectedStatus`, saved with test-name+timestamp for clarity (supplementing built-in screenshot).
12. Add npm scripts in `package.json`: `test`, `test:headed`, `test:dev`, `test:qa` (set `ENV` env var), `report`.

Phase D — Docs & polish
13. `README.md` — folder structure explanation, setup (`npm install`, `npx playwright install`), how to run tests per env, how to add new Page Object/locator/base keyword.
14. `.env.example` (optional) if secrets needed later.

**Relevant files**
- `package.json` — scripts & deps
- `tsconfig.json` — TS compiler options (target ES2020+, strict true, esModuleInterop)
- `playwright.config.ts` — global Playwright config, screenshot/trace/video, reporters, projects (chromium/firefox/webkit)
- `config/ConfigManager.ts` — loads correct JSON per `ENV`
- `config/env/dev.json`, `config/env/qa.json` — baseUrl, timeouts, sample creds
- `base/BasePage.ts` — reusable Playwright action wrappers used by all Page Objects
- `base/BaseTest.ts` — extends `test` from `@playwright/test`, provides fixtures + failure screenshot hook
- `locators/*.ts` — selector constants per page
- `pages/*.ts` — Page Object classes extending `BasePage`
- `utils/Logger.ts`, `utils/ScreenshotHelper.ts` — cross-cutting helpers
- `tests/*.spec.ts` — actual test cases using POM
- `README.md` — usage docs

**Verification**
1. `npm install` completes without errors.
2. `npx playwright install` installs browsers.
3. `npm test` runs sample spec successfully (green).
4. Intentionally break a locator in sample test, rerun — verify screenshot appears in `test-results/` and `playwright-report/` (via `npm run report`).
5. `npm run test:qa` picks up `config/env/qa.json` baseUrl (verify via console log/assertion on `page.url()`).

**Decisions**
- Test runner: `@playwright/test` (built-in fixtures/parallelism) rather than a fully custom runner.
- Config format: JSON per environment, selected via `ENV` npm script/env var, not `.env`-only.
- Screenshot on failure: rely on built-in `use.screenshot: 'only-on-failure'` PLUS custom `ScreenshotHelper` hook for named/organized captures — gives both automatic and clearly-named artifacts.
- Sample tests target playwright.dev (public, stable, no auth needed) as placeholder; easily swappable via `config/env/*.json` baseUrl.
- Package manager: npm.

**Further Considerations**
1. Do you want CI (GitHub Actions workflow) added now or in a later iteration? Currently excluded from this plan per your reporting choice (screenshot/report only).
2. Should locators be plain string selectors or Playwright `Locator` factory functions (page.locator(...)) — plan currently uses string selector constants consumed by Page Objects for simplicity; can switch to locator-factory pattern if preferred for chained/dynamic locators.
