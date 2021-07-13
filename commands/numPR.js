const axios = require('axios');
const API = 'https://robinrestapi.herokuapp.com/';
const Discord = require('discord.js');

module.exports = async function(args, repo, owner) {
    const response = await axios.get(`${API}pr/${owner}/${repo}`);

    if (typeof response.data === "undefined") {
        return response;
    }

    console.log(response)
    const embed = new Discord.MessageEmbed()
        .setDescription(`__${response.data.total_count}__ open pull requests in [${owner}/${repo}](https://github.com/${owner}/${repo}).`)
    return embed;
}
