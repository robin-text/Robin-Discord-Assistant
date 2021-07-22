const axios = require('axios')
const API = 'https://api.github.com'
const Discord = require('discord.js')

const get_all_branches = async (token) => {
  let response
  const branches = []
  try {
    const request_url = `${API}/repos/${owner}/${repo}/branches?per_page=100`
    const headers = {
      Authorization: `token ${token}`,
      Accept: 'application/vnd.github.v3+json'
    }
    response = await axios.get(request_url, { headers })
  } catch (err) {
    console.log(err)
    return []
  }

  response.data.forEach((branch) => {
    branches.push(branch.name)
  })

  return branches
}

module.exports = async function (args, repo, owner, token) {
  const base = args.base
  const head = args.head
  const commit_message = args.message

  let message = `There was an error with this merge. Please check if head branch ${head} and base branch ${base} exist`

  try {
    const allBranches = await get_all_branches(token)
    if (!allBranches.includes(base) || !allBranches.includes(head)) {
      return message
    }

    const body = {
      base: base,
      head: head,
      commit: commit_message
    }

    const headers = {
      Authorization: `token ${token}`,
      Accept: 'application/vnd.github.v3+json'
    }
    await axios.post(`${API}/repos/${owner}/${repo}/merges`, body, { headers })
    message = `Merge of head ${head} into base ${base} was successful`
  } catch (error) {
    console.log(error)
  }
  return new Discord.MessageEmbed().setDescription(message)
}
