const axios = require('axios');
const API = 'https://robinrestapi.herokuapp.com/';
const Discord = require('discord.js');

module.exports = async function(args, repo, owner) {
    var num = args.num;

    const response = await axios.get(`${API}issue/${owner}/${repo}/${num}`);
    console.log('resp')
    console.log(response);
    console.log(response.data.assignees[0]);

    if (typeof response.data === "undefined") {
        return response;
    }

    var message = '';
    const embed = new Discord.MessageEmbed();
    if (response.data.length == 0) {
        message = `There are no assignees assigned to ${num}`
    } else {
        embed.setTitle(`${response.data.length} assignees for issue #${num}`)
        for (var i = 0; i < response.data.assignees; ++i) {
            message += `\n[${response.data.assignees[i].login}](response.data.assignees[i].html_url)`
        }
    }

    embed.setDescription(message);
    return embed;
}
