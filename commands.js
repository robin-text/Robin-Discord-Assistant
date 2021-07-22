require('dotenv').config()

const ApprovePR = require('./commands/approvePR.js')
const GetReviewers = require('./commands/reviewers.js')
const CreateIssue = require('./commands/createIssue.js')
const CloseIssue = require('./commands/closeIssue.js')
const AddLabelToIssue = require('./commands/addLabelToIssue.js')
const AddUserToIssue = require('./commands/addUserToIssue.js')
const CreateIssueComment = require('./commands/createIssueComment.js')
const GetLabels = require('./commands/labels.js')
const GetIssueAssignees = require('./commands/issueAssignees.js')
const GetIssuesWithLabel = require('./commands/issuesWithLabel.js')
const SetOwnerName = require('./commands/SetOwnerName.js')
const SetRepoName = require('./commands/SetRepoName.js')
const GetAssigneeIssues = require('./commands/assigneeIssues.js')
const GetMedianReviewTime = require('./commands/medianReviewTime.js')
const MergeBranch = require('./commands/mergeBranch.js')
const MergePR = require('./commands/mergePR.js')
const NumIssues = require('./commands/numIssues.js')
const CreatePR = require('./commands/createPR.js')
const NumPRs = require('./commands/numPR.js')
const GetPROwners = require('./commands/PROwners.js')
const GetOldestIssue = require('./commands/oldestIssue.js')
const GetNumAssignedOpenIssues = require('./commands/numAssignedOpenIssues.js')
const GetLastContributor = require('./commands/lastContributor.js')
const GetUnassignedTasks = require('./commands/unassignedTasks.js')
const GetBuildStatus = require('./commands/buildStatus.js')
const Help = require('./commands/help.js')
const SignIn = require('./commands/signin.js')
const set = require('./commands/set.js')

const commands = { ApprovePR, GetReviewers, CreateIssue, CloseIssue, AddLabelToIssue, AddUserToIssue, CreateIssueComment, GetLabels, GetAssigneeIssues, GetIssuesWithLabel, SetOwnerName, SetRepoName, GetIssueAssignees, GetMedianReviewTime, MergeBranch, MergePR, NumIssues, CreatePR, NumPRs, GetPROwners, GetOldestIssue, GetNumAssignedOpenIssues, GetLastContributor, GetUnassignedTasks, GetBuildStatus, Help, SignIn, set }

module.exports = async function (message, userRepos, userOwners, userTokens) {
  const args = message.content.split(' ')
  let command = args.shift()

  if (command.charAt(0) === '>') {
    message.channel.startTyping()
    // console.log("Valid Robin Command");
    console.log('starts with >')
    command = command.substring(1)
    console.log(command)

    if (!commands.hasOwnProperty(command)) {
      message.channel.send('invalid command')
    } else if (command === 'set') {
      reply = await commands[command](args, message.author.id, userOwners, userRepos)
      message.channel.send(reply)
    } else if (!userRepos.get(message.author.id) || !userOwners.get(message.author.id)) {
      reply = 'please set repo and owner with `>set`'
      await message.channel.send(reply)
    }
    // else if (command === "SetRepoName") {
    //     await commands[command](args, message.author.id, userRepos);
    //     message.channel.send(`Set Repo name to ${args[0]}`);
    // }
    // else if (command === "SetOwnerName") {
    //     await commands[command](args, message.author.id, userOwners);
    //     message.channel.send(`Set Owner name to ${args[0]}`);
    // }
    else {
      reply = await commands[command](args, userRepos.get(message.author.id), userOwners.get(message.author.id), userTokens.get(message.author.id))
      // /reply = 'none';
      // /if (!userRepos.get(message.author.id)) {
      // /    reply = "\nPlease set the Repository name with #SetRepoName [name]\n";
      // /}
      // /if (!userOwners.get(message.author.id)) {
      // /    reply += "Please set the Owner name with #SetOwnerName [name]\n";
      // /}
      // /if (userRepos.get(message.author.id) && userOwners.get(message.author.id)){
      // /    reply = await commands[command](args,
      // /                                    userRepos.get(message.author.id),
      // /                                    userOwners.get(message.author.id),
      // /                                    userTokens.get(message.author.id));
      // /}
      // if (reply.length > 0)
      await message.channel.send(reply)
    }
    message.channel.stopTyping()
  }
  // check if it is a text channel
  // if (message.channel.type != 'dm'){
  //     await message.channel.bulkDelete(20, true)
  //     .then(messages => console.log(`Bulk deleted ${messages.size} messages`))
  //     .catch(console.error);
  // }
}
