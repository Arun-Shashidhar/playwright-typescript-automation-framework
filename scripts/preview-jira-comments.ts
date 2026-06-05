import { JiraReporter } from '../integrations/jira/JiraReporter';

const jiraReporter = new JiraReporter();

const comments = jiraReporter.prepareJiraComments();

console.log('Prepared Jira comments:');
console.log('-----------------------');

for (const comment of comments) {
  console.log(comment);
  console.log('-----------------------');
}