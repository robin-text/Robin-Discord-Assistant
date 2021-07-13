const axios = require('axios');
const API = 'https://robinrestapi.herokuapp.com/';
const Discord = require('discord.js');

module.exports = async function(args, repo, owner) {
    const response = await axios.get(`${API}issue/${owner}/${repo}/1/100`);

    if (typeof response.data === "undefined") {
        return response;
    }

    const embed = new Discord.MessageEmbed()
        .setDescription(`__${response.data.total_count}__ open issues in [${owner}/${repo}](https://github.com/${owner}/${repo}).`)
    return embed;
}
