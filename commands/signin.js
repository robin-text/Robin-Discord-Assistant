const Discord = require('discord.js')
const User = require('../models/user.js')
const axios = require('axios')

module.exports = function (id, app) {
  const embed = new Discord.MessageEmbed()
    .setTitle('Click to Sign In')
    .setDescription(`<@${id}>`)
    .setURL('https://github.com/login/oauth/authorize/?client_id=d727593907be72d259b8&scope=user%20repo')

  app.get('/discord/oauth-callback', async ({ query: { code } }, res) => {
    const body = {
      client_id: process.env.GITHUB_CLIENT_ID,
      client_secret: process.env.GITHUB_CLIENT_SECRET,
      code
    }
    const options = { headers: { accept: 'application/json' } }
    axios.post('https://github.com//login/oauth/access_token', body, options)
      .then((_res) => _res.data.access_token)
      .then(async (token) => {
        console.log('token', token)
        const filter = { discordID: id }
        const update = { githubToken: token }
        const opts = { upsert: true }
        await User.updateOne(filter, update, opts)
        res.redirect('discord://')
      })
      .catch((err) => { console.log(err) })
  })

  return embed
}
