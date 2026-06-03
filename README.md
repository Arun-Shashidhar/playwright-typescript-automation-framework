# Playwright TypeScript Automation Framework

This project is a Playwright automation framework built with TypeScript. It supports UI testing, API testing, test tagging, environment configuration, reusable Page Object Model classes, API client classes, reporting, and GitHub Actions CI execution.

## Application Under Test

This framework currently uses the Restful Booker demo application.

| Area            | URL                                  |
| --------------- | ------------------------------------ |
| UI Application  | https://automationintesting.online   |
| API Application | https://restful-booker.herokuapp.com |

## Tech Stack

| Tool           | Purpose                          |
| -------------- | -------------------------------- |
| Playwright     | UI and API test automation       |
| TypeScript     | Strongly typed test development  |
| Node.js        | Runtime environment              |
| GitHub         | Source code repository           |
| GitHub Actions | CI pipeline execution            |
| JUnit Report   | CI/Jira-compatible reporting     |
| JSON Report    | Custom integration support       |
| HTML Report    | Human-readable Playwright report |

## Framework Structure

```text
playwright-typescript-automation-framework/
│
├── tests/
│   ├── ui/
│   │   └── home.spec.ts
│   └── api/
│       └── booking-api.spec.ts
│
├── pages/
│   └── HomePage.ts
│
├── integrations/
│   └── api/
│       └── BookingApiClient.ts
│
├── data/
│   └── booking-test-data.json
│
├── utils/
│   ├── env.ts
│   └── logger.ts
│
├── fixtures/
│
├── reports/
│
├── .github/
│   └── workflows/
│       └── playwright-ci.yml
│
├── playwright.config.ts
├── package.json
├── tsconfig.json
├── .gitignore
└── README.md
```

## Key Features

* Playwright with TypeScript
* UI automation testing
* API automation testing
* Page Object Model design pattern
* API client layer for reusable API methods
* External test data using JSON
* Environment-based configuration
* Test tagging using `@smoke`, `@regression`, `@ui`, and `@api`
* HTML, JUnit, and JSON report generation
* GitHub Actions CI workflow
* Manual test suite selection from GitHub Actions
* Report artifacts uploaded in GitHub Actions

## Installation

Clone the repository:

```bash
git clone <repository-url>
```

Navigate to the project folder:

```bash
cd playwright-typescript-automation-framework
```

Install dependencies:

```bash
npm install
```

Install Playwright browsers:

```bash
npx playwright install
```

## Running Tests

Run all tests:

```bash
npx playwright test
```

Run smoke tests:

```bash
npx playwright test --grep @smoke
```

Run regression tests:

```bash
npx playwright test --grep @regression
```

Run UI tests:

```bash
npx playwright test --grep @ui
```

Run API tests:

```bash
npx playwright test --grep @api
```

Run tests in headed mode:

```bash
npx playwright test --headed
```

Run tests using Playwright UI mode:

```bash
npx playwright test --ui
```

## Reports

This framework generates multiple report formats.

| Report Type            | Location                         |
| ---------------------- | -------------------------------- |
| Playwright HTML Report | `reports/playwright-html-report` |
| JUnit Report           | `reports/junit/results.xml`      |
| JSON Report            | `reports/json/results.json`      |

Open the HTML report:

```bash
npx playwright show-report reports/playwright-html-report
```

## Environment Configuration

Environment URLs are maintained in:

```text
utils/env.ts
```

Current configuration:

```ts
export const ENV = {
  UI_BASE_URL: process.env.UI_BASE_URL || 'https://automationintesting.online',
  API_BASE_URL: process.env.API_BASE_URL || 'https://restful-booker.herokuapp.com',
};
```

The UI base URL is configured in `playwright.config.ts`:

```ts
use: {
  baseURL: ENV.UI_BASE_URL,
}
```

This allows UI tests to use relative paths such as:

```ts
await page.goto('/');
```

## GitHub Actions CI

The framework includes a GitHub Actions workflow:

```text
.github/workflows/playwright-ci.yml
```

The workflow runs on:

* Push to `main`
* Pull request to `main`
* Manual execution using `workflow_dispatch`

For normal push and pull request events, the workflow runs smoke tests:

```bash
npx playwright test --grep @smoke
```

For manual execution, the user can select:

* smoke
* regression
* api
* ui
* all

The workflow also uploads these artifacts:

* Playwright HTML report
* JUnit report
* JSON report

## Test Tagging Strategy

| Tag           | Purpose                             |
| ------------- | ----------------------------------- |
| `@smoke`      | Critical tests for quick validation |
| `@regression` | Broader functional coverage         |
| `@ui`         | UI automation tests                 |
| `@api`        | API automation tests                |

Example:

```ts
test('@smoke @ui should open the application home page', async ({ page }) => {
  // test steps
});
```

## Current Test Coverage

| Test Type | Scenario                   |
| --------- | -------------------------- |
| UI        | Open application home page |
| API       | Get booking IDs            |
| API       | Create a new booking       |

## Future Enhancements

Planned enhancements include:

* Jira integration
* Automatic Jira comments with test results
* Automatic defect creation for failed tests
* Allure reporting
* Docker-based execution
* Accessibility testing
* Visual comparison testing
* Authentication/session management using Playwright storage state
* Test data cleanup strategy
* CI pipeline optimization using caching
