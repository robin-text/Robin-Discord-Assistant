const axios = require('axios')
const API = 'https://api.github.com'
const Discord = require('discord.js')

module.exports = async function (args, repo, owner, token) {
  const assignees = args.assignees.split(',')
  const num = args.num
  // fix error message
  let message = `There was a problem adding ${args[0]} to ${num}`

  const headers = {
    Authorization: `token ${token}`,
    Accept: 'application/vnd.github.v3+json'
  }

  const response = await axios.get(`${API}/repos/${owner}/${repo}/issues/${num}`, { headers })

  if (response.status === 200) {
    const body = {
      assignees: assignees
    }

    const result = await axios.post(`${API}/repos/${owner}/${repo}/issues/${num}/assignees`, body, { headers })

    if (result.status === 201) {
      message = `Successfully added ${args.assignees} to issue #${num}`
    }
  }
  return new Discord.MessageEmbed().setDescription(message)
}
