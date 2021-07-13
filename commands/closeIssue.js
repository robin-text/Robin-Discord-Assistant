const axios = require('axios');
const API = 'https://robinrestapi.herokuapp.com/';
const Discord = require('discord.js');

module.exports = async function(args, repo, owner) {
    const num = args.num;

    var body = {
        state: "closed",
    }

    const result = await axios.patch(`${API}issue/${owner}/${repo}/${num}/update`,
        body
    );

    if (result.status == 200) {
        message = `Issue closed: #${num} ${result.data.title}`
    }

    if (result.status == 200) {
        const embed = new Discord.MessageEmbed()
            .setAuthor(result.data.user.login, result.data.user.avatar_url, result.data.user.html_url)
            .setTitle(`Issue closed: #${result.data.number} ${result.data.title}`)
            .setURL(result.data.html_url)
        return embed
    } else {
        return new Discord.MessageEmbed().setDescription('error')
    }
}
