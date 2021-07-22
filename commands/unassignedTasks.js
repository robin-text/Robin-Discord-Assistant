const axios = require('axios')
const API = 'https://api.github.com'
const Discord = require('discord.js')

module.exports = async function (args, repo, owner, token) {
  let message = ''
  const headers = {
    Authorization: `token ${token}`,
    Accept: 'application/vnd.github.v3+json'
  }
  const response = await axios.get(`${API}/search/issues?q=repo:${owner}/${repo}+type:issue+state:open&page=1`, { headers })
  if (response.data.length === 0) {
    message = 'There are currently no unassigned tasks in this repository.'
  } else {
    const issues = response.data.items
    const unassigned = issues.filter((issue) => issue.assignee == null)
    unassigned.forEach((issue) => {
      message += `\n[Issue #${issue.number}: ${issue.title}](${issue.html_url}) by [${issue.user.login}](${issue.user.html_url}).`
    })
    return new Discord.MessageEmbed().setDescription(message)
  }
}
