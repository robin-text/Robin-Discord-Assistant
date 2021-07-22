const axios = require('axios')
const API = 'https://api.github.com'
const Discord = require('discord.js')

module.exports = async function (args, repo, owner, token) {
  let labels = []; let assignees = []
  if (args.labels) {
    labels = args.labels.split(',')
  }
  if (args.assignees) {
    assignees = args.assignees.split(',')
  }

  const headers = {
    Authorization: `token ${token}`,
    Accept: 'application/vnd.github.v3+json'
  }

  const body = {
    title: args.title,
    labels: labels,
    assignees: assignees
  }
  const result = await axios.post(`${API}/repos/${owner}/${repo}/issues`, body, { headers })
  if (result.status === 201) {
    return new Discord.MessageEmbed()
      .setAuthor(result.data.user.login, result.data.user.avatar_url, result.data.user.html_url)
      .setTitle(`Issue opened: #${result.data.number} ${result.data.title}`)
      .setURL(result.data.html_url)
  }
}
