const axios = require('axios');
const API = 'https://robinrestapi.herokuapp.com/';
const Discord = require('discord.js');

convertDate = function(time) {
    var date = new Date(time);
    var day = date.getDate();
    var year = date.getFullYear();
    var month = date.getMonth()+1;
    var dateStr = year+"-"+month+"-"+day;
    return dateStr
}

module.exports = async function(args, repo, owner) {
    pr_num = args[0];
    var response = await axios.get(`${API}pr/${owner}/${repo}/${pr_num}`);

    if (response.status != 200) {
        return `There was an error getting PR number ${pr_num}.`;
    }
    var pr_sha = response.data.head.sha;
    var author = response.data.user.login;

    var result = await axios.get(`${API}commit/${owner}/${repo}/${pr_sha}`);
    var responseData = result.data;

    var message = ''

    if (responseData.length > 0)
    {
        var desc = responseData[0].description;
        var time = convertDate(responseData[0].created_at);

        message = `For PR ${pr_num}, ${desc} at ${time}. It was created by ${author}.`;
    }

    else message = `The repository ${repo} by ${user} doesn't seem to have an integrated CI, at least for PR ${pr_num}.`;
    const embed = new Discord.MessageEmbed().setDescription(message);
    return embed;
}
