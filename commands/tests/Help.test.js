
const Help = require("../help.js");

var expectedDefault = ''
expectedDefault += '\nMake sure to give set owner and repo names under \'Help Settings\'\n';
expectedDefault += '#Help Branch for commands related to branches\n';
expectedDefault += '#Help Commit for commands related to commits\n';
expectedDefault += '#Help Issue for commands related to issues\n';
expectedDefault += '#Help PR for commands related to PRs\n';
expectedDefault += '#Help Repo for commands related to repos\n';
expectedDefault += '#Help Settings for commands related to setting up session\n';

var expectedBranch = '';
expectedBranch += "\nCommands related to Branches:\n";
expectedBranch += '#MergeBranch [base] [head] [message]\n';            // MergeBranch

var expectedCommit = '';
expectedCommit += "\nCommands related to Commits:\n";
expectedCommit += '#GetBuildStatus [commit SHA]\n';                    //GetBuildStatus 

var expectedIssue = '';
expectedIssue += "\nCommands related to Issues:\n";
expectedIssue += '#AddLabelToIssue [label] [issue number]\n';         // AddLabelToIssue
expectedIssue += '#AddUserToIssue [user] [issue]\n';                  // AddUserToIssue        
expectedIssue += '#CloseIssue [issue number] [comment]\n';            // CloseIssue
expectedIssue += '#CreateIssue [title] [labels] [assignees]\n';       // CreateIssue
expectedIssue += '#CreateIssueComment [issue number] [comment]\n';    // CreateIssueComment
expectedIssue += '#GetAssigneeIssues [assignee]\n';                   // GetAssigneeIssues
expectedIssue += '#GetIssueAssignees [issue number]\n';               // GetIssueAssignees
expectedIssue += '#GetIssuesWithLabel [label]\n';                     // GetIssuesWithLabel
expectedIssue += '#GetNumAssignedOpenIssues\n';                       // GetNumAssignedOpenIssues
expectedIssue += '#GetOldestIssue\n';                                 // GetOldestIssue
expectedIssue += '#NumIssues\n';                                      // NumIssues

var expectedPR = '';
expectedPR += "\nCommands related to PRs:\n";
expectedPR += '#ApprovePR [PR number] [comment]\n';              // ApprovePR
expectedPR += '#CreatePR [title] [head branch] [base branch]\n';   // CreatePR
expectedPR += '#GetMedianReviewTime\n';                            // GetMedianReviewTime
expectedPR += '#GetPROwners\n';                                    // GetPROwners
expectedPR += '#GetReviewers [PR number]\n';                       // GetReviewers
expectedPR += '#MergePR [PR number] [message]\n';                  // Merge PR
expectedPR += '#NumPRs\n';                                         // NumPRs

var expectedRepo = '';
expectedRepo += "\nCommands related to Repos:\n";
expectedRepo += '#GetLabels [issue number]\n';                       // GetLabels
expectedRepo += '#GetLastContributor\n';                             // GetLastContributor   
expectedRepo += '#GetUnassignedTasks\n';                             // GetUnassignedTasks

var expectedSettings = '';
expectedSettings += "\nCommands for setting up session:\n";
expectedSettings += '#SetOwnerName [owner]\n';                          // GiveOwnerName
expectedSettings += '#SetRepoName [repo name]\n';                       // GiveRepoName
expectedSettings += '#SetGithubToken [token]\n';                        // SetGithubToken

test("returns default message", async() => {
    const args = [];
    let  content = Help(args);
    
    expect(content).toBe(expectedDefault);
});

test("returns Branch message", () => {
    const args = ["Branch"];

    let  content = Help(args);

    expect(content).toBe(expectedBranch);
});

test("returns Commit message", () => {
    const args = ["Commit"];

    let  content = Help(args);

    expect(content).toBe(expectedCommit);
});

test("returns Issue message", () => {
    const args = ["Issue"];

    let  content = Help(args);

    expect(content).toBe(expectedIssue);
});

test("returns PR message", () => {
    const args = ["PR"];

    let  content = Help(args);

    expect(content).toBe(expectedPR);
});

test("returns Repo message", () => {
    const args = ["Repo"];

    let  content = Help(args);

    expect(content).toBe(expectedRepo);
});

test("returns Settings message", () => {
    const args = ["Settings"];

    let  content = Help(args);

    expect(content).toBe(expectedSettings);
});

test("tests for multiple options", () => {
    const args = ["Settings", "Branch", "Repo"];
    const args2 = ["PR", "Branch", "Repo", "Commit"];

    let content = Help(args);

    let expected = expectedSettings + expectedBranch + expectedRepo;

    expect(content).toBe(expected);

    let content2 = Help(args2);
    let expected2 = expectedPR + expectedBranch + expectedRepo + expectedCommit;

    expect(content2).toBe(expected2);
});
