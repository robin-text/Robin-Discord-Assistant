const axios = require('axios')
const API = 'https://api.github.com'
const Discord = require('discord.js')

getListOfNames = function (response) {
  let names = []
  if (typeof response.data === 'undefined') {
    return response
  }
  const responseData = response.data
  for (let i = 0; i < responseData.length; i++) {
    names.push(responseData[i].name)
  }
  names = new Set(names)
  names = Array.from(names)
  return names
}

findBranch = function (response, branch) {
  const branchNames = getListOfNames(response)
  for (let i = 0; i < branchNames.length; i++) {
    const nameLower = branchNames[i].toLowerCase()
    if (nameLower.localeCompare(branch) == 0) {
      return branchNames[i]
    }
  }
  console.error('no branch match found')
  return branch
}

module.exports = async function (args, repo, owner, token) {
  const title = args.title
  let base = args.base
  if (typeof base === 'undefined') {
    base = 'master'
  }
  let head = args.head

  const headers = {
    Authorization: `token ${token}`,
    Accept: 'application/vnd.github.v3+json'
  }

  // let result = await axios.get(`${API}branch/${owner}/${repo}`)
  let result = await axios.get(`${API}/repos/${owner}/${repo}/branches`, { headers })
  console.log(result)

  base = findBranch(result, base)
  head = findBranch(result, head)

  let message = `There was an error with opening this pull request. Please check if head branch ${head} and base branch ${base} exist`

  const body = {
    title: title,
    head: head,
    base: base,
    maintainer_can_modify: true
  }

  result = await axios.post(`${API}/repos/${owner}/${repo}/pulls`, body, { headers })
  console.log(result)

  if (result.status === 200) {
    message = `The pull request was successfully created as P.R. number ${result.data.number}`
  }

  console.log(result)

  return new Discord.MessageEmbed().setDescription(message)
}
