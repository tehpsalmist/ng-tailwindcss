workflow "Issue Notification" {
  on = "issues"
  resolves = ["HTTP client"]
}

action "HTTP client" {
  uses = "Ilshidur/action-slack@5b3a58f5e0ff655ca9c17a22516efdf9d0de36bf"
  secrets = ["SLACK_WEBHOOK"]
  args = "<@UFW8AGT3L> Issue activity is ensuing."
}

workflow "Issue Comment" {
  on = "issue_comment"
  resolves = ["GitHub Action for Slack"]
}

action "GitHub Action for Slack" {
  uses = "Ilshidur/action-slack@5b3a58f5e0ff655ca9c17a22516efdf9d0de36bf"
  secrets = ["SLACK_WEBHOOK"]
  args = "<@UFW8AGT3L> Someone is commenting on your stuff"
}
