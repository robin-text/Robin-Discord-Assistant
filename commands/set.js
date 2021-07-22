const axios = require('axios')
const API = 'https://api.github.com'
const Discord = require('discord.js')

module.exports = async function (options, id, token) {
  const owner = options[0].value
  const repo = options[1].value
  const description = `Now set to [${owner}/${repo}](https://github.com/${owner}/${repo})`
  const embed = new Discord.MessageEmbed().setDescription(description)
  try {
    const headers = {
      Authorization: `token ${token}`,
      Accept: 'application/vnd.github.v3+json'
    }
    await axios.get(`${API}/repos/${owner}/${repo}`, { headers })
  } catch (error) {
    console.log(error.response)
    embed.setDescription('Either you don\'t have access to repository or repository is invalid')
  }
  return embed
}
