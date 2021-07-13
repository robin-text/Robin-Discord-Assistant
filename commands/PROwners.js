const axios = require('axios');
const API = 'https://robinrestapi.herokuapp.com/';
const Discord = require('discord.js');

module.exports = async function(args, repo, owner) {
    var message = '';
    const response = await axios.get(`${API}pr/${owner}/${repo}/owners`);

    if (typeof response.data === "undefined") {
        return response;
    }

const embed = new Discord.MessageEmbed();
    if (response.data.length == 0) {
        message = 'There are currently no pull request owners in this repository';
    } else {
        console.log(response.data)
        var names = []
        for (var i = 0; i < response.data.length; ++i) {
            names.push(response.data[i].user.login)
        }
        var set = new Set(names)
        embed.setTitle(`${response.data.length} owners`)
        for (var i = 0; i < response.data.length; ++i) {
            message += `\n[${response.data[i].user.login}](${response.data[i].user.html_url})`
        }
    }

    embed.setDescription(message);
    return embed;
}
