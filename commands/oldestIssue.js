const axios = require('axios')
const API = 'https://api.github.com'
const Discord = require('discord.js')

module.exports = async function (args, repo, owner, token) {
  const headers = {
    Authorization: `token ${token}`,
    Accept: 'application/vnd.github.v3+json'
  }
  let message = ''
  const response = await axios.get(`${API}/search/issues?q=repo:${owner}/${repo}+type:issue+state:open&sort=created&order=asc&page=1}`, { headers })
  const total = response.data.total_count
  const issues = response.data.items
  const oldest = issues[0]
  if (total === 0) {
    message = 'There are no issues in this repository'
  } else {
    message = `The oldest issue is [Issue #${oldest.number}: ${oldest.title}](${oldest.html_url}) by [${oldest.user.login}](${oldest.user.html_url}).`
  }
  return new Discord.MessageEmbed().setDescription(message)
}
