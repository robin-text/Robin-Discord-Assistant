const Discord = require('discord.js');
module.exports = function(message, args) {
    const embed = new Discord.MessageEmbed()
        .setTitle("Click to Sign In")
        .setURL('https://github.com/login/oauth/authorize/?client_id=9726ec721c7d9c35c5a7&scope=user%20repo');
    return embed;
}

