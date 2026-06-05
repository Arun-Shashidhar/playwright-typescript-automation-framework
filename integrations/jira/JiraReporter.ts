import fs from 'fs';
import { JiraUtils } from './JiraUtils';

type PlaywrightTestResult = {
  title: string;
  outcome: string;
};

export class JiraReporter {
  private readonly reportPath: string;

  constructor(reportPath: string = 'reports/json/results.json') {
    this.reportPath = reportPath;
  }

  readJsonReport(): any {
    if (!fs.existsSync(this.reportPath)) {
      throw new Error(`Playwright JSON report not found at path: ${this.reportPath}`);
    }

    const reportContent = fs.readFileSync(this.reportPath, 'utf-8');
    return JSON.parse(reportContent);
  }

  extractTestResults(): PlaywrightTestResult[] {
    const report = this.readJsonReport();
    const testResults: PlaywrightTestResult[] = [];

    for (const suite of report.suites || []) {
      this.extractFromSuite(suite, testResults);
    }

    return testResults;
  }

  prepareJiraComments(): string[] {
    const testResults = this.extractTestResults();
    const comments: string[] = [];

    for (const testResult of testResults) {
      const issueKey = JiraUtils.extractIssueKey(testResult.title);

      if (!issueKey) {
        continue;
      }

      const comment = this.buildComment(issueKey, testResult.title, testResult.outcome);
      comments.push(comment);
    }

    return comments;
  }

  private extractFromSuite(suite: any, testResults: PlaywrightTestResult[]): void {
    for (const spec of suite.specs || []) {
      for (const test of spec.tests || []) {
        const title = spec.title;
        const outcome = test.outcome || 'unknown';

        testResults.push({
          title,
          outcome,
        });
      }
    }

    for (const childSuite of suite.suites || []) {
      this.extractFromSuite(childSuite, testResults);
    }
  }

  private buildComment(issueKey: string, testTitle: string, outcome: string): string {
    const status = outcome.toUpperCase();

    return [
      `Jira Issue: ${issueKey}`,
      `Automation Result: ${status}`,
      '',
      `Test: ${testTitle}`,
      `Execution Source: Playwright JSON Report`,
      `Report: Available in GitHub Actions artifacts`,
    ].join('\n');
  }
}