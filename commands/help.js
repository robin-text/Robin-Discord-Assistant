const Discord = require('discord.js');

module.exports =  function(args, repo, owner) {
    var message = '';
    var type = args.type;

    switch (type) {
        case 'Branch':
            // Branch Commands
            message += "\nCommands related to Branches:\n";
            message += '/MergeBranch [Base] [Head] [Message]\n';                                // MergeBranch
            break;
        case 'Commit':
            // Commit Commands
            message += "\nCommands related to Commits:\n";
            message += '/GetBuildStatus [PR Number]\n';                                        //GetBuildStatus
            break;
        case 'Issue':
            // Issue Commands
            message += "\nCommands related to Issues: Arguments that are lists are seperated by commas\n";
            message += '/AddLabelToIssue [Labels] [Issue Number]\n';                          // AddLabelToIssue
            message += '/AddUserToIssue [Users] [Issue Number]\n';                            // AddUserToIssue
            message += '/CloseIssue [Issue Number]\n';                                        // CloseIssue
            message += '/CreateIssue [Title] [Optional Labels] [Optional Assignees]\n';       // CreateIssue
            message += '/CreateIssueComment [Issue Number] [Comment]\n';                      // CreateIssueComment
            message += '/GetAssigneeIssues [Assignee]\n';                                     // GetAssigneeIssues
            message += '/GetIssueAssignees [Issue Number]\n';                                 // GetIssueAssignees
            message += '/GetIssuesWithLabel [Label]\n';                                       // GetIssuesWithLabel
            message += '/GetNumAssignedOpenIssues\n';                                         // GetNumAssignedOpenIssues
            message += '/GetOldestIssue\n';                                                   // GetOldestIssue
            message += '/NumIssues\n';                                                        // NumIssues
            break;
        case 'PR':
            // PR Commands
            message += "\nCommands related to PRs:\n";
            message += '/ApprovePR [PR number]\n';                          // ApprovePR
            message += '/CreatePR [Title] [Base] [Head]\n';                 // CreatePR
            message += '/GetMedianReviewTime\n';                            // GetMedianReviewTime
            message += '/GetPROwners\n';                                    // GetPROwners
            message += '/GetReviewers [PR Number]\n';                       // GetReviewers
            message += '/MergePR [PR Number] [Message]\n';                  // Merge PR
            message += '/NumPRs\n';                                         // NumPRs
            break;
        case 'Repo':
            // Repository Commands
            message += "\nCommands related to Repos:\n";
            message += '/GetLabels\n';                                      // GetLabels
            message += '/GetLastContributor\n';                             // GetLastContributor
            message += '/GetUnassignedTasks\n';                             // GetUnassignedTasks
            break;
        case 'Settings':
            // User Commands
            message += "\nCommands for setting up session:\n";
            message += '/SetOwnerName [Owner]\n';                          // GiveOwnerName
            message += '/SetRepoName [Repo Name]\n';                       // GiveRepoName
            message += '/SignIn\n';                                        // SignIn
            break;
        default:
            message += '\nMake sure to give set owner and repo names under \'Help Settings\'\n';
            message += '/Help Branch for commands related to branches\n';
            message += '/Help Commit for commands related to commits\n';
            message += '/Help Issue for commands related to issues\n';
            message += '/Help PR for commands related to PRs\n';
            message += '/Help Repo for commands related to repos\n';
            message += '/Help Settings for commands related to setting up session\n';
    }
    return new Discord.MessageEmbed().setDescription(message);
}





    
   







