const axios = require('axios')
const API = 'https://api.github.com'
const Discord = require('discord.js')
const User = require('../models/user.js')

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
    const filter = { discordID: id }
    const update = { owner: owner, repo: repo }
    const opts = { upsert: true }
    await User.updateOne(filter, update, opts)
  } catch (error) {
    console.log(error.response)
    embed.setDescription('Either you don\'t have access to repository or repository is invalid')
  }
  return embed
}
