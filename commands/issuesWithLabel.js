const axios = require('axios')
const API = 'https://api.github.com'
const Discord = require('discord.js')

module.exports = async function (args, repo, owner, token) {
  const label = args.label
  let message = ''

  // for (var i = 0; i < args.length; i++) {
  //     label += args[i];
  //     if (args.length > 1){
  //         label += ' ';
  //     }
  // }

  const headers = {
    Authorization: `token ${token}`,
    Accept: 'application/vnd.github.v3+json'
  }
  const response = await axios.get(`${API}/repos/${owner}/${repo}/issues?labels=${label}`, { headers })
  console.log(response.data)

  if (typeof response.data === 'undefined') {
    return response
  }

  const embed = new Discord.MessageEmbed()
  if (response.data.length === 0) {
    message = `There are no open issues labeled with ${label}`
  } else {
    embed.setTitle(`${response.data.length} issues with label ${label}`)
    for (let i = 0; i < response.data.length; ++i) {
      const entry = response.data[i]
      message += `\n [Issue #${entry.number}: ${entry.title}](${entry.html_url})`
    }
  }
  embed.setDescription(message)
  return embed
}
