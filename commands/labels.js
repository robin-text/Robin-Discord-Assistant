const axios = require('axios')
const API = 'https://api.github.com'
const Discord = require('discord.js')

module.exports = async function (args, repo, owner, token) {
  let message = 'The available labels in this repository are '
  const headers = {
    Authorization: `token ${token}`,
    Accept: 'application/vnd.github.v3+json'
  }
  const response = await axios.get(`${API}/repos/${owner}/${repo}/labels`, { headers })
  const embed = new Discord.MessageEmbed()

  if (typeof response.data === 'undefined' || response.data.length === 0) {
    embed.setTitle('No issues with labels')
  } else {
    embed.setTitle(`${response.data.length} labels`)
    for (let i = 0; i < response.data.length; ++i) {
      const entry = response.data[i]
      message += `\n${entry.name}`
    }
  }

  embed.setDescription(message)
  return embed
}
