const axios = require('axios');
const API = 'https://robinrestapi.herokuapp.com/';
const Discord = require('discord.js');

module.exports = async function(args, repo, owner, token) {
    var labels = args.labels.split(",")
    const issue_num = args.num;
    var message = `There was a problem adding ${args[0]} to ${issue_num}`;
    const response = await axios.get(`${API}issue/${owner}/${repo}/${issue_num}`);
    console.log(response)

    if (response.status == 200) {
        var existingLabels = response.data.labels;

        for (var i = 0; i < existingLabels.length; i++) {
            labels.push(existingLabels[i].name);
        }

        const body = {
            labels : labels,
        }

        const result = await axios.patch(`${API}issue/${owner}/${repo}/${issue_num}/update`,
            body
        );

        if (result.status == 200) {
            message = `Successfully added ${args.labels} to issue #${issue_num}`;
        }
    }

    const embed = new Discord.MessageEmbed().setDescription(message);
    return embed;
}
