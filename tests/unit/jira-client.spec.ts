import { test, expect } from '@playwright/test';
import { JiraClient } from '../../integrations/jira/JiraClient';

test('@unit @jira should throw error when Jira configuration is missing', async () => {
  const jiraClient = new JiraClient();

  expect(() => jiraClient.validateConfig()).toThrow(
    'Missing Jira configuration. Please set JIRA_BASE_URL, JIRA_EMAIL, and JIRA_API_TOKEN.'
  );
});