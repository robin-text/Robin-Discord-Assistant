# Robin
## Discord Assistant

## Features

- Branch Commands
- Commit Commands
- Issue Commands
- PR Commands
- Repo Commands
- Help and Login

## Setup

### Users
To invite Robin to your team's Discord Server follow this [invite link](https://discord.com/api/oauth2/authorize?client_id=800926894282637344&permissions=92160&scope=bot)
- Select the server and select "Coninute"
- For Robin to to be fully functional, Robin must be able to send and manage messages and embed links. Select "Authorize".
- Robin should now be ready and listenning in the server.

### Developers 
- Download this repository and in the project directory:
```sh
npm install
```
- Now visit Discord's [developer portal applications](https://discord.com/developers/applications). In here, create a new application with the name "Robin". On the sidebar, click bot. In the bot page, Add a bot and then copy the bot token.
- In the project repository, create a file named .env. In .env, create a variable name BOTTOKEN and set it to your bot token. "BOTTOKEN={bot token here}.
- To run the bot, make sure to follow the instructions for users and invite the bot to a sever. However the invite link to your own bot can be retrieved under the OAuth2 tab in the Discord developer portal. Once the bot is in your server, run:
```sh
node ./bot.js
```

## Commands

- All commands that start with "#" are detected and parsed by Robin.
- Arguements that are lists are seperated by commas.
- If it is your first time interacting with Robin, you must set the repository owner name and repositry name which are under settings commands
- Some commands require repository write access so you must use the sign in command under settings

### Branch
|  Command | Arguments |
| ------ | ------ |
| #MergeBranch | [Base] [Head] [Message] |

### Commit
|  Command | Arguments |
| ------ | ------ |
| #GetBuildStatus | [Number] |

### Issue
|  Command | Arguments |
| ------ | ------ |
| #AddLabelToIssue | [Labels] [Issue Number] |
| #AddUserToIssue | [Users] [Issue Number] |
| #CloseIssue | [Issue Number] |
| #CreateIssue | [Title] [Optional Labels] [Optional Assignees] |
| #CreateIssueComment | [Issue Number] [Comment] |
| #GetAssigneeIssues | [Assignee] |
| #GetIssueAssignees | [Issue Number] |
| #GetIssuesWithLabel | [Label] |
| #GetNumAssignedOpenIssues |  |
| #GetOldestIssue | |
| #NumIssues | |

### PR
| Command | Arguments |
| ------ | ------ |
| #ApprovePR | [PR number] |
| #CreatePR | [Title] [Base] [Head] |
| #GetMedianReviewTime | |
| #GetPROwners |  |
| #GetReviewers | [PR Number] |
| #MergePR | [PR Number] [Message] |
| #NumPRs |  |

### Repo
| Command | Arguments |
| ------ | ------ |
| #GetLabels |  |
| #GetLastContributor |  |
| #GetUnassignedTasks | |

### Settings
| Command | Arguments |
| ------ | ------ |
| #SetOwnerName | [Owner] |
| #SetRepoName | [Repo Name]  |
| #SignIn | |

### Help
| Command | Arguments |
| ------ | ------ |
| #Help |  |
| #Help | [Branch] |
| #Help | [Commit] |
| #Help | [Issue] |
| #Help | [PR] |
| #Help | [Repo] |
| #Help | [Settings] |
