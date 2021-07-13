const axios = require('axios');
const API = 'https://robinrestapi.herokuapp.com/';
const Discord = require('discord.js');

module.exports = async function(args, repo, owner) {
    var label = args.label;
    var message = ''

    // for (var i = 0; i < args.length; i++) {
    //     label += args[i];
    //     if (args.length > 1){
    //         label += ' ';
    //     }
    // }

    const response = await axios.get(`${API}issue/${owner}/${repo}/labeled/${label}`);
    console.log(response.data)

    if (typeof response.data === "undefined") {
        return response;
    }


    var message = '';
    const embed = new Discord.MessageEmbed();
    if (response.data.length == 0) {
        message = `There are no open issues labeled with ${label}`;
    } else {
        embed.setTitle(`${response.data.length} issues with label ${label}`)
        for (var i = 0; i < response.data.length; ++i) {
            entry = response.data[i];
            message += `\n [Issue #${entry.number}: ${entry.title}](${entry.html_url})`
        }
    }
    embed.setDescription(message);
    return embed;
}
