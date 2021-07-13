const axios = require('axios');
const API = 'https://robinrestapi.herokuapp.com/';
const Discord = require('discord.js');

getListOfNames = function(response) {
    var names = [];
    if (typeof response.data === "undefined") {
        return response;
    }
    var responseData = response.data;
    for (var i = 0; i < responseData.length; i++) {
        names.push(responseData[i].name)
    }
    names = new Set(names);
    names = Array.from(names);
    return names;
}

findBranch = function (response, branch) {
    var branchNames = getListOfNames(response)
    for (var i = 0; i < branchNames.length; i++) {
        var nameLower = branchNames[i].toLowerCase();
        if (nameLower.localeCompare(branch) == 0)  {
            return branchNames[i];
        }
    }
    console.error('no branch match found');
    return branch;
}

module.exports = async function(args, repo, owner) {
    const title = args.title;
    var base = args.base;
    if (typeof base === "undefined") {
        base = "master";
    }
    var head = args.head;

    var result = await axios.get(`${API}branch/${owner}/${repo}`);

    base = findBranch(result, base);
    head = findBranch(result, head);

    var message = `There was an error with opening this pull request. Please check if head branch ${head} and base branch ${base} exist`;

    body = {
        title : title,
        head : head,
        base : base
    }

    result = await axios.post(`${API}pr/${owner}/${repo}/create`,
        body
    );

    if (result.status == 200) {
        message = `The pull request was successfully created as P.R. number ${result.data.number}`;
    }

    console.log(result)

    const embed = new Discord.MessageEmbed().setDescription(message);
    return embed;
}
