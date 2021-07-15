const Discord = require('discord.js');
const axios = require("axios");
var express = require("express");
var app = express();

module.exports = function(message, args) {
    const embed = new Discord.MessageEmbed()
        .setTitle("Click to Sign In")
        .setURL('https://github.com/login/oauth/authorize/?client_id=9726ec721c7d9c35c5a7&scope=user%20repo');
    return embed;
    app.get('/discord/oauth-callback', async ({ query: {code} }, res) => {
        const body = {
            client_id: process.env.GITHUB_CLIENT_ID,
            client_secret: process.env.GITHUB_CLIENT_SECRET,
            code,
        }
        const options = { headers: { accept: 'application/json'  } };
        let _res = await axios.post('https://github.com/login/oauth/access_token)', body, options)
        let access_token = _res.data.access_token;
        console.log(access_token);
    });
}

