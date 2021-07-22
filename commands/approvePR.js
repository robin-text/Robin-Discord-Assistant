const axios = require('axios')
const API = 'https://api.github.com'
const Discord = require('discord.js')

module.exports = async function (args, repo, owner, token) {
  const num = args.num

  let message = 'There was an error with reviewing this pull request.'

  const headers = {
    Authorization: `token ${token}`,
    Accept: 'application/vnd.github.v3+json'
  }

  const body = {
    strategy: 'APPROVE'
  }

  const result = await axios.post(`${API}/repos/${owner}/${repo}/pulls/${num}/reviews`, body, { headers })

  if (result.status === 200) {
    message = `The pull request #${num} was successfully approved`
  }

  return new Discord.MessageEmbed().setDescription(message)
}
