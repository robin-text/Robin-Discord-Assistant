const axios = require('axios')
const API = 'https://api.github.com'
const Discord = require('discord.js')

// module.exports = async function(message, args) {
module.exports = async function (args, repo, owner, token) {
  const num = args.num
  const merge_message = args.merge_message
  const headers = {
    Authorization: `token ${token}`,
    Accept: 'application/vnd.github.v3+json'
  }
  let response = await axios.get(`${API}/repos/${owner}/${repo}/pulls/${num}`)

  const sha = response.data.head.sha
  const body = { sha: sha, commit_message: merge_message }
  response = await axios.put(`${API}/repos/${owner}/${repo}/pulls/${num}/merge`, body, { headers })

  let message = 'There was an error with this merge.'
  if (response.status === 200) {
    message = `Merge of pull request number ${num} was successful`
  } else if (response.response.status === 405) {
    message = `Pull request number ${num} is not mergeable. Please
            resolve conflicts, make sure the p r exists, and then try again`
  }

  return new Discord.MessageEmbed().setDescription(message)
}
