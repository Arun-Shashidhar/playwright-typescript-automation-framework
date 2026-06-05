import fs from 'fs';
import { JiraUtils } from './JiraUtils';
import { JiraClient } from './JiraClient';

type PlaywrightTestResult = {
  title: string;
  outcome: string;
};

type JiraCommentPayload = {
  issueKey: string;
  comment: string;
};

export class JiraReporter {
  private readonly reportPath: string;
  private readonly jiraClient: JiraClient;

  constructor(reportPath: string = 'reports/json/results.json') {
    this.reportPath = reportPath;
    this.jiraClient = new JiraClient();
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
    return this.prepareJiraCommentPayloads().map((payload) => payload.comment);
  }

  prepareJiraCommentPayloads(): JiraCommentPayload[] {
    const testResults = this.extractTestResults();
    const payloads: JiraCommentPayload[] = [];

    for (const testResult of testResults) {
      const issueKey = JiraUtils.extractIssueKey(testResult.title);

      if (!issueKey) {
        continue;
      }

      const comment = this.buildComment(issueKey, testResult.title, testResult.outcome);

      payloads.push({
        issueKey,
        comment,
      });
    }

    return payloads;
  }

  async publishJiraComments(): Promise<void> {
    const payloads = this.prepareJiraCommentPayloads();

    if (payloads.length === 0) {
      console.log('No Jira issue keys found in Playwright test results.');
      return;
    }

    for (const payload of payloads) {
      console.log(`Publishing Jira comment for issue: ${payload.issueKey}`);

      const response = await this.jiraClient.addComment(payload.issueKey, payload.comment);

      if (!response.ok) {
        const errorBody = await response.text();

        throw new Error(
          `Failed to publish Jira comment for ${payload.issueKey}. ` +
            `Status: ${response.status()}. Response: ${errorBody}`
        );
      }

      console.log(`Successfully published Jira comment for issue: ${payload.issueKey}`);
    }
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
    const status = this.mapOutcomeToStatus(outcome);

    return [
      `Jira Issue: ${issueKey}`,
      `Automation Result: ${status}`,
      '',
      `Test: ${testTitle}`,
      `Execution Source: Playwright JSON Report`,
      `Report: Available in GitHub Actions artifacts`,
    ].join('\n');
  }

  private mapOutcomeToStatus(outcome: string): string {
    if (outcome === 'expected') {
      return 'PASSED';
    }

    if (outcome === 'unexpected') {
      return 'FAILED';
    }

    if (outcome === 'flaky') {
      return 'FLAKY';
    }

    if (outcome === 'skipped') {
      return 'SKIPPED';
    }

    return outcome.toUpperCase();
  }
}