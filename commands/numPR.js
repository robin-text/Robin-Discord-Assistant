const axios = require('axios')
const API = 'https://api.github.com'
const Discord = require('discord.js')

module.exports = async function (args, repo, owner, token) {
  const headers = {
    Authorization: `token ${token}`,
    Accept: 'application/vnd.github.v3+json'
  }
  const response = await axios.get(`${API}/repos/${owner}/${repo}/pulls?state=open&page=1`, { headers })
  return new Discord.MessageEmbed().setDescription(`${response.data.total_count} open pull requests in [${owner}/${repo}](https://github.com/${owner}/${repo}).`)
}
