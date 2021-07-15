const Discord = require('discord.js');
const axios = require("axios");

module.exports = function(app) {
    const embed = new Discord.MessageEmbed()
        .setTitle("Click to Sign In")
        .setURL('https://github.com/login/oauth/authorize/?client_id=d727593907be72d259b8&scope=user%20repo');
    return embed;
}

