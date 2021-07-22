const axios = require('axios')
const API = 'https://api.github.com'
const Discord = require('discord.js')

module.exports = async function (args, repo, owner, token) {
  let message = ''
  const headers = {
    Authorization: `token ${token}`,
    Accept: 'application/vnd.github.v3+json'
  }
  const response = await axios.get(`${API}/repos/${owner}/${repo}/pulls?state=open`, { headers })
  const owners = new Set()
  const embed = new Discord.MessageEmbed()
  if (response.data.length === 0) {
    message = 'There are currently no pull request owners in this repository'
  } else {
    response.data.forEach((owner) => {
      owners.add([owner.user.login, owner.user.html_url])
    })
    embed.setTitle(`${response.data.length} owners`)
    owners.forEach((owner) => {
      message += `\n[${owner[0]}](${owner[1]})`
    })
  }
  embed.setDescription(message)
  return embed
}
