const axios = require('axios');
const API = 'https://robinrestapi.herokuapp.com/';
const Discord = require('discord.js');

module.exports = async function(args, repo, owner) {
    var message = '';
    const issue_num = args[0];

    response = await axios.get(`${API}PR/${owner}/${repo}/${issue_num}`);
    responseData = response.data;

    var approvals = [];
    var changes = [];
    for (var i = 0; i < responseData.length; i++) {
        if (responseData[i].state === "APPROVED") {
            approvals.push(responseData[i].user.login);
        }
        else if (responseData[i].state === "REQUEST_CHANGES") {
            changes.push(responseData[i].user.login);
        }
    }

    if (approvals.length > 0) {
        var namesApproved = approvals.join(", ");
        message += '\nThe users who have approved this pull request are '
        message += namesApproved;
        message += '\n';
    }

    if (changes.length > 0) {
        var namesChanges = changes.join(", ");
        message += '\nThe users who have requested changes for this pull request are ';
        message += namesChanges;
        message += '\n';
    }

    if (message === '') {
        message = "\nNo one has reviewed this pull request.\n";
    }
    const embed = new Discord.MessageEmbed().setDescription(message);
    return embed;
}
