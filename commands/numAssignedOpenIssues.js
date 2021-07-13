const axios = require('axios');
const API = 'https://robinrestapi.herokuapp.com/';
const Discord = require('discord.js');

module.exports = async function(args, repo, owner) {
    var message = '';
    var pageNum = 1;
    var result = await axios.get(`${API}issue/${owner}/${repo}/${pageNum}/100`);
    var responses = [];

    var count = result.data.total_count;
    var responseData = result.data.items;

    if (count == 0) {
        return "There are no issues in this repository";
    }

    while (count > 0) {
        count -= 100;
        responses.push(result);
        pageNum++;
        result = await axios.get(`${API}issue/${owner}/${repo}/${pageNum}/100`);
    }

    if (responses.length > 0) {
        var total = 0;
        for (const response of responses) {
            if (typeof response.data === "undefined") {
                return response;
            }
            var responseData = response.data.items;
            for (var i = 0; i < responseData.length; i++) {
                if (responseData[i].assignee !== null) {
                    total++;
                }
            }
        }
        message = `There are ${total} assigned, open issues in this repository`;
    }

    const embed = new Discord.MessageEmbed().setDescription(message);
    return message;
}
