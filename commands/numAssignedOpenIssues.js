const axios = require('axios')
const API = 'https://api.github.com'
const Discord = require('discord.js')

module.exports = async function (args, repo, owner, token) {
  let message = ''
  const headers = {
    Authorization: `token ${token}`,
    Accept: 'application/vnd.github.v3+json'
  }
  let response = await axios.get(`${API}/search/issues?q=repo:${owner}/${repo}+type:issue+state:open`, { headers })
  const all = response.data.total_count
  response = await axios.get(`${API}/search/issues?q=repo:${owner}/${repo}+type:issue+state:open+no:assignee`, { headers })
  const unassigned = response.data.total_count
  message = `There are ${all - unassigned} assigned, open issues in this repository`

  return new Discord.MessageEmbed().setDescription(message)
}
