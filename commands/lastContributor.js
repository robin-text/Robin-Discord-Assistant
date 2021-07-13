const axios = require('axios');
const API = 'https://robinrestapi.herokuapp.com/';
const Discord = require('discord.js');

findBranchSHA = function (response, branch) {
    var responseData = response.data;
    for (var i = 0; i < responseData.length; i++) {
        var nameLower = responseData[i].name.toLowerCase();
        if (nameLower.localeCompare(branch) == 0)
        {
            return responseData[i].commit.sha
        }
    }
    console.error('no branch match found');
    return branch;
}

findFile = async function (response, file) {
    var all_paths = [];
    var responseData = response.data.tree;
    var blob_name = [];
    for(var i = 0; i < responseData.length; i++)
    {
        var data = responseData[i];
        if (data.type  === 'blob')
        {
            blob_name.push(data.path);
        }
    }
    for(var i = 0; i < blob_name.length; i++)
    {
        var nameLower = blob_name[i].toLowerCase();
        var fileLower = file.toLowerCase();
        var path_files = nameLower.split("/");
        if( path_files.indexOf(fileLower) > -1 )
            all_paths.push(blob_name[i]);
    }

    return all_paths;
}

findLastContributor = function (response) {
    var responseData = response.data;
    var committer = responseData[0].commit.author.name;
    return committer
}

module.exports = async function(args, repo, owner) {
    var message = '';
    var file = args.file;
    var branch = args.branch;

    if (branch == undefined) {
        var repoResult = await axios.get(`${API}repo/${owner}/${repo}`);
        branch = repoResult.data.default_branch;
    }

    var result = await axios.get(`${API}branch/${owner}/${repo}`);

    var branch_sha = findBranchSHA(result, branch);

    result = await axios.get(`${API}repo/gitTree/${owner}/${repo}/${branch_sha}/1`);

    var paths = await findFile(result, file);

    var message = ''

    if (paths.length < 1)
    {
        message = `The file ${file} in the ${branch} doesn't seem to exist.`;
    }

    if (paths.length == 1)
    {
        result =  await axios.get(`${API}commit/path/${owner}/${repo}/${encodeURI(paths[0])}`);
        var contributor = findLastContributor(result);
        console.log(result)
        message =  `The last contributor to [${file}](${result.data[0].html_url}) in the ${branch} branch was [${contributor}](${result.data[0].author.html_url}).`;
        console.log(result.data[0].committer)
        console.log(result.data[0].author)
        console.log(message)
    }

    const embed = new Discord.MessageEmbed().setDescription(message);
    return embed;
}
