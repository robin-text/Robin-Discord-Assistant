require('dotenv').config()

const User = require('./models/user.js')
const Discord = require('discord.js')
const client = new Discord.Client()
// const guildId = '697997529312133220'
const guildId = ''
const express = require('express')
const app = express()
const port = process.env.PORT || 5000
const axios = require('axios')

const approvepr = require('./commands/approvePR.js')
const getreviewers = require('./commands/reviewers.js')
const createissue = require('./commands/createIssue.js')
const closeissue = require('./commands/closeIssue.js')
const addlabel = require('./commands/addLabelToIssue.js')
const adduser = require('./commands/addUserToIssue.js')
const addcomment = require('./commands/createIssueComment.js')
const labels = require('./commands/labels.js')
const assignees = require('./commands/issueAssignees.js')
const issueswithlabel = require('./commands/issuesWithLabel.js')
const assigneeissues = require('./commands/assigneeIssues.js')
const medianreviewtime = require('./commands/medianReviewTime.js')
const mergebranch = require('./commands/mergeBranch.js')
const mergepr = require('./commands/mergePR.js')
const numissues = require('./commands/numIssues.js')
const createpr = require('./commands/createPR.js')
const numpr = require('./commands/numPR.js')
const prowners = require('./commands/PROwners.js')
const oldestissue = require('./commands/oldestIssue.js')
const numassignedopenissues = require('./commands/numAssignedOpenIssues.js')
const lastcontributor = require('./commands/lastContributor.js')
const unassignedtasks = require('./commands/unassignedTasks.js')
const buildstatus = require('./commands/buildStatus.js')
const help = require('./commands/help.js')
const signin = require('./commands/signin.js')
const set = require('./commands/set.js')

// connect to mongodb
const mongoose = require('mongoose')
const dbURI = 'mongodb+srv://liubenjamin:Ake%25bKsFi5EQn%21s%2A@cluster0.etia0.mongodb.net/Cluster0?retryWrites=true&w=majority'
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })

const commandlist = {
  approvepr,
  getreviewers,
  createissue,
  closeissue,
  addlabel,
  adduser,
  addcomment,
  labels,
  assignees,
  issueswithlabel,
  assigneeissues,
  medianreviewtime,
  mergebranch,
  mergepr,
  numissues,
  createpr,
  numpr,
  prowners,
  oldestissue,
  numassignedopenissues,
  lastcontributor,
  unassignedtasks,
  buildstatus,
  help,
  signin,
  set
}

const getApp = (guildId) => {
  const app = client.api.applications(client.user.id)
  if (guildId) {
    app.guilds(guildId)
  }
  return app
}

// client.on('message', (msg) => {
//   const id = msg.author.id
//   if (msg.content.charAt(0) === '/' && (!userRepos.get(id) || !userOwners.get(id))) {
//     msg.channel.send('Please sign in with `/signin` and set your configuration with `/set`.')
//   }
// })

client.on('ready', async () => {
  // const commands = await getApp(guildId).commands.get()

  await getApp(guildId).commands.post({
    data: {
      name: 'createissue',
      description: 'creates a new issue',
      options: [
        {
          name: 'title',
          description: 'title of issue',
          required: true,
          type: 3
        },
        {
          name: 'labels',
          description: 'name of label(s)',
          required: false,
          type: 3
        },
        {
          name: 'assignees',
          description: 'name of assignee(s)',
          required: false,
          type: 3
        }
      ]
    }
  })

  await getApp(guildId).commands.post({
    data: {
      name: 'set',
      description: 'configure the repo owner and name',
      options: [
        {
          name: 'owner',
          description: 'username of owner',
          required: true,
          type: 3
        },
        {
          name: 'repo',
          description: 'name of repo',
          required: true,
          type: 3
        }
      ]
    }
  })

  await getApp(guildId).commands.post({
    data: {
      name: 'numpr',
      description: 'gets the number of pull requests'
    }
  })

  await getApp(guildId).commands.post({
    data: {
      name: 'numissues',
      description: 'gets the number of issues'
    }
  })

  await getApp(guildId).commands.post({
    data: {
      name: 'mergepr',
      description: 'merges the pull request',
      options: [
        {
          name: 'num',
          description: 'pull request number',
          required: true,
          type: 3
        },
        {
          name: 'merge_message',
          description: 'message',
          required: true,
          type: 3
        }
      ]
    }
  })

  await getApp(guildId).commands.post({
    data: {
      name: 'unassignedtasks',
      description: 'gets the number of unassigned tasks'
    }
  })

  await getApp(guildId).commands.post({
    data: {
      name: 'reviewers',
      description: 'gets the list of reviewers'
    }
  })

  await getApp(guildId).commands.post({
    data: {
      name: 'oldestissue',
      description: 'gets the oldest issue'
    }
  })

  await getApp(guildId).commands.post({
    data: {
      name: 'numassignedopenissues',
      description: 'gets the number of issues that are assigned and open'
    }
  })

  await getApp(guildId).commands.post({
    data: {
      name: 'medianreviewtime',
      description: 'gets the median review time'
    }
  })

  await getApp(guildId).commands.post({
    data: {
      name: 'lastcontributor',
      description: 'gets the last contributor',
      options: [
        {
          name: 'file',
          description: 'filename',
          required: true,
          type: 3
        },
        {
          name: 'branch',
          description: 'branch name',
          required: true,
          type: 3
        }
      ]
    }
  })

  await getApp(guildId).commands.post({
    data: {
      name: 'labels',
      description: 'gets the labels'
    }
  })

  await getApp(guildId).commands.post({
    data: {
      name: 'issueswithlabel',
      description: 'gets the issues that have this label',
      options: [
        {
          name: 'label',
          description: 'label name',
          required: true,
          type: 3
        }
      ]
    }
  })

  await getApp(guildId).commands.post({
    data: {
      name: 'assignees',
      description: 'gets the assignees for an issue',
      options: [
        {
          name: 'num',
          description: 'issue number',
          required: true,
          type: 3
        }
      ]
    }
  })

  await getApp(guildId).commands.post({
    data: {
      name: 'buildstatus',
      description: 'gets the build status of number?'
    }
  })

  await getApp(guildId).commands.post({
    data: {
      name: 'prowners',
      description: 'gets the list of pull request owners'
    }
  })

  await getApp(guildId).commands.post({
    data: {
      name: 'assigneeissues',
      description: 'gets the issues of an assignee',
      options: [
        {
          name: 'assignee',
          description: 'name of the user',
          required: true,
          type: 3
        }
      ]
    }
  })

  await getApp(guildId).commands.post({
    data: {
      name: 'signin',
      description: 'authorize the application'
    }
  })

  await getApp(guildId).commands.post({
    data: {
      name: 'help',
      description: 'information about commands',
      options: [
        {
          name: 'type',
          description: 'type of command',
          required: false,
          type: 3
        }
      ]
    }
  })

  await getApp(guildId).commands.post({
    data: {
      name: 'createpr',
      description: 'creates a pull request',
      options: [
        {
          name: 'title',
          description: 'title of the pull request',
          required: true,
          type: 3
        },
        {
          name: 'head',
          description: 'name of head branch',
          required: true,
          type: 3
        },
        {
          name: 'base',
          description: 'name of base branch',
          required: false,
          type: 3
        }
      ]
    }
  })

  await getApp(guildId).commands.post({
    data: {
      name: 'addcomment',
      description: 'add comment to an issue',
      options: [
        {
          name: 'num',
          description: 'issue number',
          required: true,
          type: 3
        },
        {
          name: 'comment',
          description: 'your comment',
          required: true,
          type: 3
        }
      ]
    }
  })

  await getApp(guildId).commands.post({
    data: {
      name: 'closeissue',
      description: 'close an issue',
      options: [
        {
          name: 'num',
          description: 'issue number',
          required: true,
          type: 3
        }
      ]
    }
  })

  await getApp(guildId).commands.post({
    data: {
      name: 'approvepr',
      description: 'approve a pull request',
      options: [
        {
          name: 'num',
          description: 'pull request number',
          required: true,
          type: 3
        }
      ]
    }
  })

  await getApp(guildId).commands.post({
    data: {
      name: 'adduser',
      description: 'add user to an issue',
      options: [
        {
          name: 'num',
          description: 'issue number',
          required: true,
          type: 3
        },
        {
          name: 'assignees',
          description: 'the assignees you want to add to the issue',
          required: true,
          type: 3
        }
      ]
    }
  })

  await getApp(guildId).commands.post({
    data: {
      name: 'addlabel',
      description: 'add label to an issue',
      options: [
        {
          name: 'num',
          description: 'issue number',
          required: true,
          type: 3
        },
        {
          name: 'labels',
          description: 'the labels you want to add to the issue',
          required: true,
          type: 3
        }
      ]
    }
  })

  await getApp(guildId).commands.post({
    data: {
      name: 'mergebranch',
      description: 'merges head into base',
      options: [
        {
          name: 'head',
          description: 'name of head branch',
          required: true,
          type: 3
        },
        {
          name: 'base',
          description: 'name of base branch',
          required: true,
          type: 3
        },
        {
          name: 'message',
          description: 'merge message',
          required: true,
          type: 3
        }
      ]
    }
  })

  console.log('bot ready')
  client.ws.on('INTERACTION_CREATE', async (interaction) => {
    const command = interaction.data.name.toLowerCase()
    const options = interaction.data.options
    const id = interaction.member.user.id
    let reply = ''
    console.log(command)
    console.log(options)
    const args = {}
    if (options) {
      for (const o of options) {
        args[o.name] = o.value
      }
    }
    console.log('args', args)
    const data = await User.findOne({ discordID: id }).exec()
    if (!data || command === 'signin') {
      reply = await commandlist.signin(id, app)
    } else if (command === 'set') {
      reply = await commandlist[command](options, id, data.githubToken)
    } else if (!data.repo || !data.owner) {
      reply = 'Before using any commands, sign in with `/signin` and set your configuration with `/set`.'
    } else if (command in commandlist) {
      reply = await commandlist[command](args, data.repo, data.owner, data.githubToken)
    }
    send(interaction, reply)
  })
})

const send = async (interaction, response) => {
  let data = {
    content: response
  }
  if (typeof response === 'object') {
    data = await createAPIMessage(interaction, response)
  }
  client.api.interactions(interaction.id, interaction.token).callback.post({
    data: {
      type: 4,
      data
    }
  })
}

const createAPIMessage = async (interaction, content) => {
  const { data, files } = await Discord.APIMessage.create(
    client.channels.resolve(interaction.channel_id),
    content
  ).resolveData().resolveFiles()
  return { ...data, files }
}

app.listen(port, err => {
  if (err) {
    return console.log('ERROR', err)
  }
  console.log(`Listening on port ${port}`)
})

client.login(process.env.BOTTOKEN)
