const axios = require('axios')
const API = 'https://api.github.com'
const Discord = require('discord.js')

module.exports = async function (args, repo, owner, token) {
  const assignee = args.assignee

  const headers = {
    Authorization: `token ${token}`,
    Accept: 'application/vnd.github.v3+json'
  }
  const response = await axios.get(`${API}/repos/${owner}/${repo}/issues?assignee=${assignee}`, { headers })

  if (typeof response.data === 'undefined') {
    return response
  }

  let message = ''
  const embed = new Discord.MessageEmbed()
  if (response.data.length === 0) {
    message = 'There are no open issues assigned to ' + assignee + '.'
  } else {
    embed.setTitle(`${response.data.length} issues assigned to ${assignee}`)
    for (let i = 0; i < response.data.length; ++i) {
      message += `\n[Issue #${response.data[i].number}: ${response.data[i].title}](${response.data[i].html_url})`
    }
  }
  embed.setDescription(message)
  return embed
}
