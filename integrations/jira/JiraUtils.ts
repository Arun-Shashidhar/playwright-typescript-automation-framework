export class JiraUtils {
  static extractIssueKey(testTitle: string): string | null {
    const jiraKeyPattern = /\b[A-Z][A-Z0-9]+-\d+\b/;
    const match = testTitle.match(jiraKeyPattern);

    return match ? match[0] : null;
  }
}