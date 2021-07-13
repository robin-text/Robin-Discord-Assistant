const axios = require('axios');
const API = 'https://robinrestapi.herokuapp.com/';
const Discord = require('discord.js');

module.exports = async function(args, repo, owner) {
    var assignee = args.assignee;

    const response = await axios.get(`${API}issue/${owner}/${repo}/assignee/${assignee}`);

    if (typeof response.data === "undefined") {
        return response;
    }

    var message = '';
    const embed = new Discord.MessageEmbed();
    if (response.data.length == 0) {
        message = 'There are no open issues assigned to ' + assignee + '.';
    } else {
        embed.setTitle(`${response.data.length} issues assigned to ${assignee}`);
        for (var i = 0; i < response.data.length; ++i) {
            message += `\n[Issue #${response.data[i].number}: ${response.data[i].title}](${response.data[i].html_url})`
        }
    }
    embed.setDescription(message);
    return embed;
}
