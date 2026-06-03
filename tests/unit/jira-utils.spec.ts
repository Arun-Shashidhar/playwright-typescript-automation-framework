import { test, expect } from '@playwright/test';
import { JiraUtils } from '../../integrations/jira/JiraUtils';

test('@unit should extract Jira issue key from test title', async () => {
  const testTitle = '@smoke @ui RB-101 should open the application home page';

  const issueKey = JiraUtils.extractIssueKey(testTitle);

  expect(issueKey).toBe('RB-101');
});

test('@unit should return null when no Jira issue key is present', async () => {
  const testTitle = '@smoke @ui should open the application home page';

  const issueKey = JiraUtils.extractIssueKey(testTitle);

  expect(issueKey).toBeNull();
});