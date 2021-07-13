const axios = require('axios');
const API = 'https://robinrestapi.herokuapp.com/';
const Discord = require('discord.js');

// getListOfNames = function(response, info) {
getListOfNames = function(response) {
    var names = [];
    if (typeof response.data === "undefined") {
        return response;
    }
    var responseData = response.data;
    for (var i = 0; i < responseData.length; i++) {
        // eval(info);
        names.push(responseData[i].name)
    }
    names = new Set(names);
    names = Array.from(names);
    return names;
}

findBranch = function (response, branch) {
    // var branchNames = getListOfNames(response, 'names.push(responseData[i].name)')
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
    var base = args.base;
    var head = args.head;
    var commit_message = args.message;

    var result = await axios.get(`${API}branch/${owner}/${repo}`);

    base = findBranch(result, base);
    head = findBranch(result, head);

    var message = `There was an error with this merge. Please check if head branch ${head} and base branch ${base} exist`;

    body = {
        base : base,
        head : head,
        commit : commit_message
    }

    result = await axios.post(`${API}branch/${owner}/${repo}/merge`,
        body
    );

    if (result.status == 200) {
        message = `Merge of head ${head} into base ${base} was successful`;
    }
    console.log(result)

    const embed = new Discord.MessageEmbed().setDescription(message);
    return embed;
}
