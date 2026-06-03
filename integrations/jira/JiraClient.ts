import { ENV } from '../../utils/env';

export class JiraClient {
  private readonly baseUrl: string;
  private readonly email: string;
  private readonly apiToken: string;

  constructor() {
    this.baseUrl = ENV.JIRA_BASE_URL;
    this.email = ENV.JIRA_EMAIL;
    this.apiToken = ENV.JIRA_API_TOKEN;
  }

  private getAuthHeader(): string {
    const token = Buffer.from(`${this.email}:${this.apiToken}`).toString('base64');
    return `Basic ${token}`;
  }

  validateConfig(): void {
    if (!this.baseUrl || !this.email || !this.apiToken) {
      throw new Error(
        'Missing Jira configuration. Please set JIRA_BASE_URL, JIRA_EMAIL, and JIRA_API_TOKEN.'
      );
    }
  }

  async addComment(issueKey: string, comment: string): Promise<Response> {
    this.validateConfig();

    const response = await fetch(`${this.baseUrl}/rest/api/3/issue/${issueKey}/comment`, {
      method: 'POST',
      headers: {
        Authorization: this.getAuthHeader(),
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        body: {
          type: 'doc',
          version: 1,
          content: [
            {
              type: 'paragraph',
              content: [
                {
                  type: 'text',
                  text: comment,
                },
              ],
            },
          ],
        },
      }),
    });

    return response;
  }
}