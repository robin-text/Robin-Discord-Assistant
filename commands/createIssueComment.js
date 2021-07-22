const axios = require('axios')
const API = 'https://api.github.com'
const Discord = require('discord.js')

module.exports = async function (args, repo, owner, token) {
  const num = args.num
  const comment = args.comment

  let message = 'There was an error with updating this issue'

  const headers = {
    Authorization: `token ${token}`,
    Accept: 'application/vnd.github.v3+json'
  }

  const body = {
    body: comment
  }

  const result = await axios.post(`${API}/repos/${owner}/${repo}/issues/${num}/comments`, body, { headers })

  if (result.status === 201) {
    message = `Added comment on issue #${num}`
    return new Discord.MessageEmbed()
      .setAuthor(result.data.user.login, result.data.user.avatar_url, result.data.user.html_url)
      .setTitle(message)
      .setURL(result.data.html_url)
      .setDescription(comment)
  }
}
