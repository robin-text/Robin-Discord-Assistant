const axios = require('axios');
const API = 'https://robinrestapi.herokuapp.com/';
const Discord = require('discord.js');

module.exports = async function(args, repo, owner, token) {
    var assignees = args.assignees.split(",")
    const issue_num = args.num;
    var message = `There was a problem adding ${args[0]} to ${issue_num}`;
    const response = await axios.get(`${API}issue/${owner}/${repo}/${issue_num}`);

    if (response.status == 200) {
        var existingAssignees = response.data.assignees;

        for (var i = 0; i < existingAssignees.length; i++) {
            assignees.push(existingAssignees[i].login);
        }

        const body = {
            assignees : assignees,
            token  : token
        }

        const result = await axios.patch(`${API}issue/${owner}/${repo}/${issue_num}/update`,
            body
        );

        if (result.status == 200) {
            message = `Successfully added ${args.assignees} to issue #${issue_num}`;
        }
    }

    const embed = new Discord.MessageEmbed().setDescription(message);
    return embed;
}
