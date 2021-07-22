const axios = require('axios')
const API = 'https://api.github.com'
const Discord = require('discord.js')

module.exports = async function (args, repo, owner, token) {
  const headers = {
    Authorization: `token ${token}`,
    Accept: 'application/vnd.github.v3+json'
  }
  const response = await axios.get(`${API}/search/issues?q=repo:${owner}/${repo}+type:issue+state:open&page=1&per_page=100`, { headers })
  return new Discord.MessageEmbed().setDescription(`${response.data.total_count} open issues in [${owner}/${repo}](https://github.com/${owner}/${repo}).`)
}
