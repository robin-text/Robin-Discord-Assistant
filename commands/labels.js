const axios = require('axios');
const { response } = require('msw');
const API = 'https://robinrestapi.herokuapp.com/';
const Discord = require('discord.js');


module.exports = async function(args, repo, owner) {
    var message = 'The available labels in this repository are ';
    var response = await axios.get(`${API}repo/labels/${owner}/${repo}`);
    var message = ''
    const embed = new Discord.MessageEmbed();

    if (typeof response.data === "undefined" || response.data.length == 0) {
        embed.setTitle('No issues with labels');
    } else {
        embed.setTitle(`${response.data.length} labels`);
        for (var i = 0; i < response.data.length; ++i) {
            entry = response.data[i];
            message += `\n${entry.name}`
        }
    }

    embed.setDescription(message);
    return embed;
}
