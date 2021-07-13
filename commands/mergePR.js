const axios = require('axios');

const API = 'https://robinrestapi.herokuapp.com/';

// module.exports = async function(message, args) {
module.exports = async function(args, repo, owner) {
    var num = args[num];
    var merge_message = args[merge_message];
    var result =  await axios.get(`${API}pr/sha/${owner}/${repo}/${num}`);
    console.log(result);


    var sha = result.data.head.sha;
    result = await api.mergePR(user, repo, num, sha, merge_message);
    result =  await axios.get(`${API}pr/${owner}/${repo}/merge/${num}`);


    var message = `There was an error with this merge.`;
    if (result.status == 200) {
        message = `Merge of pull request number ${num} was successful`;
    }
    else if (result.response.status == 405) {
        message = `Pull request number ${num} is not mergeable. Please
            resolve conflicts, make sure the p r exists, and then try again`;
    }

    return message
}
