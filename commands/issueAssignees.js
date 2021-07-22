const axios = require('axios')
const API = 'https://api.github.com'
const Discord = require('discord.js')

module.exports = async function (args, repo, owner, token) {
  const num = args.num

  const headers = {
    Authorization: `token ${token}`,
    Accept: 'application/vnd.github.v3+json'
  }
  const response = await axios.get(`${API}/repos/${owner}/${repo}/issues/${num}`, { headers })
  console.log(response)

  if (typeof response.data === 'undefined') {
    return response
  }

  let message = ''
  const embed = new Discord.MessageEmbed().setDescription(message)
  if (response.data.length === 0) {
    message = `There are no assignees assigned to ${num}`
  } else {
    embed.setTitle(`${response.data.length} assignees for issue #${num}`)
    for (let i = 0; i < response.data.assignees; ++i) {
      message += `\n[${response.data.assignees[i].login}](response.data.assignees[i].html_url)`
    }
  }

  embed.setDescription(message)
  return embed
}
