const axios = require('axios')
const API = 'https://api.github.com'
const Discord = require('discord.js')

module.exports = async function (args, repo, owner, token) {
  const labels = args.labels.split(',')
  const num = args.num
  // fix error message
  let message = `There was a problem adding ${args[0]} to ${num}`

  const headers = {
    Authorization: `token ${token}`,
    Accept: 'application/vnd.github.v3+json'
  }

  const response = await axios.get(`${API}/repos/${owner}/${repo}/issues/${num}/labels`, { headers })

  if (response.status === 200) {
    const body = {
      labels: labels
    }

    const result = await axios.post(`${API}/repos/${owner}/${repo}/issues/${num}/labels`, body, { headers })

    if (result.status === 200) {
      message = `Successfully added ${args.labels} to issue #${num}`
    }
  }
  return new Discord.MessageEmbed().setDescription(message)
}
