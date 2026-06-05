import { JiraReporter } from '../integrations/jira/JiraReporter';

async function publishJiraComments() {
  const jiraReporter = new JiraReporter();

  await jiraReporter.publishJiraComments();
}

publishJiraComments().catch((error) => {
  console.error('Failed to publish Jira comments.');
  console.error(error);
  process.exit(1);
});