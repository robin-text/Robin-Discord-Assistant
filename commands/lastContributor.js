const axios = require('axios')
const API = 'https://api.github.com'
const Discord = require('discord.js')

const findBranchSHA = function (response, branch) {
  const responseData = response.data
  for (let i = 0; i < responseData.length; i++) {
    const nameLower = responseData[i].name.toLowerCase()
    if (nameLower.localeCompare(branch) == 0) {
      return responseData[i].commit.sha
    }
  }
  console.error('no branch match found')
  return branch
}

const findFile = async function (response, file) {
  const all_paths = []
  const responseData = response.data.tree
  const blob_name = []
  for (var i = 0; i < responseData.length; i++) {
    const data = responseData[i]
    if (data.type === 'blob') {
      blob_name.push(data.path)
    }
  }
  for (var i = 0; i < blob_name.length; i++) {
    const nameLower = blob_name[i].toLowerCase()
    const fileLower = file.toLowerCase()
    const path_files = nameLower.split('/')
    if (path_files.indexOf(fileLower) > -1) { all_paths.push(blob_name[i]) }
  }

  return all_paths
}

const findLastContributor = function (response) {
  const responseData = response.data
  const committer = responseData[0].commit.author.name
  return committer
}

module.exports = async function (args, repo, owner, token) {
  let message = ''
  const file = args.file
  let branch = args.branch

  const headers = {
    Authorization: `token ${token}`,
    Accept: 'application/vnd.github.v3+json'
  }

  if (branch === undefined) {
    const repoResult = await axios.get(`${API}/repos/${owner}/${repo}`, token)
    branch = repoResult.data.default_branch
  }

  let result = await axios.get(`${API}/repos/${owner}/${repo}/branches?per_page=100`, { headers })

  const branch_sha = findBranchSHA(result, branch)

  // result = await axios.get(`${API}repo/gitTree/${owner}/${repo}/${branch_sha}/1`)
  result = await axios.get(`${API}/repos/${owner}/${repo}/git/trees/${branch_sha}?recursive=1`, { headers })

  const paths = await findFile(result, file)

  if (paths.length < 1) {
    message = `The file ${file} in the ${branch} doesn't seem to exist.`
  }

  if (paths.length === 1) {
    // result = await axios.get(`${API}commit/path/${owner}/${repo}/${encodeURI(paths[0])}`)
    result = await axios.get(`${API}/repos/${owner}/${repo}/commits?path=${encodeURI(paths[0])}`, { headers })
    const contributor = findLastContributor(result)
    console.log(result)
    message = `The last contributor to [${file}](${result.data[0].html_url}) in the ${branch} branch was [${contributor}](${result.data[0].author.html_url}).`
  }

  const embed = new Discord.MessageEmbed().setDescription(message)
  return embed
}
