const axios = require('axios')
const API = 'https://api.github.com'
const Discord = require('discord.js')

module.exports = async function (args, repo, owner, token) {
  const num = args.num

  const message = 'There was an error with closing this issue.'

  const headers = {
    Authorization: `token ${token}`,
    Accept: 'application/vnd.github.v3+json'
  }

  const body = {
    state: 'closed'
  }

  const result = await axios.patch(`${API}/repos/${owner}/${repo}/issues/${num}`, body, { headers })

  if (result.status === 200) {
    return new Discord.MessageEmbed()
      .setAuthor(result.data.user.login, result.data.user.avatar_url, result.data.user.html_url)
      .setTitle(`Issue closed: #${result.data.number} ${result.data.title}`)
      .setURL(result.data.html_url)
  } else {
    return new Discord.MessageEmbed().setDescription(message)
  }
}
