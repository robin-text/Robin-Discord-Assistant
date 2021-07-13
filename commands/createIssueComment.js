const axios = require('axios');
const API = 'https://robinrestapi.herokuapp.com/';
const Discord = require('discord.js');

module.exports = async function(args, repo, owner) {
    const issueNum = args.num;
    const comment = args.comment;

    console.log(issueNum, comment);

    var message = `There was an error with updating this issue`;

    var body = {
        body: comment
    }

    const result = await axios.post(`${API}issue/${owner}/${repo}/${issueNum}/comment`,
        body
    );

    if (result.status == 200) {
        message = `Added comment on issue #${issueNum}`;
        const embed = new Discord.MessageEmbed()
            .setAuthor(result.data.user.login, result.data.user.avatar_url, result.data.user.html_url)
            .setTitle(message)
            .setURL(result.data.html_url)
            .setDescription(comment)
        return embed;
    }
}
