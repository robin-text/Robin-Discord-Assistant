const axios = require('axios');
const API = 'https://robinrestapi.herokuapp.com/';
const Discord = require('discord.js');

module.exports = async function(args, repo, owner) {
    var labels = [], assignees = [];
    if (args.labels) {
        labels = args.labels.split(",");
    }
    if (args.assignees) {
        assignees = args.assignees.split(",");
    }
    const body = {
        title : args.title,
        labels : labels,
        assignees : assignees
    }
    const result = await axios.post(`${API}issue/${owner}/${repo}/create`,
        body
    );
    if (result.status == 200) {
        const embed = new Discord.MessageEmbed()
            .setAuthor(result.data.user.login, result.data.user.avatar_url, result.data.user.html_url)
            .setTitle(`Issue opened: #${result.data.number} ${result.data.title}`)
            .setURL(result.data.html_url)
        return embed
    }
}
