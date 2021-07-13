const axios = require('axios');
const API = 'https://robinrestapi.herokuapp.com/';
const Discord = require('discord.js');

module.exports = async function(args, repo, owner) {
    const num = args.num;

    var message = `There was an error with reviewing this pull request`;

    const body = {
        strategy : "APPROVE"
    }

    const result = await axios.post(`${API}pr/${owner}/${repo}/review/${num}`,
        body
    );

    if (result.status == 200) {
        message = `The pull request #${num} was successfully approved`;
    }

    console.log(result)
    const embed = new Discord.MessageEmbed().setDescription(message);
    return embed;
}
