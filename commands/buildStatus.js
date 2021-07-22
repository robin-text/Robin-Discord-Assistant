const axios = require('axios')
const API = 'https://api.github.com'
const Discord = require('discord.js')

convertDate = function (time) {
  const date = new Date(time)
  const day = date.getDate()
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const dateStr = year + '-' + month + '-' + day
  return dateStr
}

module.exports = async function (args, repo, owner, token) {
  const num = args.num
  let response, message
  const headers = {
    Authorization: `token ${token}`,
    Accept: 'application/vnd.github.v3+json'
  }
  try {
    response = await axios.get(`${API}/repos/${owner}/${repo}/pulls/${num}`, { headers })
  } catch (err) {
    console.log(err)
    return `There was an error getting PR number ${num}.`
  }
  const pr_sha = response.data.head.sha
  const author = response.data.user.login

  try {
    response = await axios.get(`${API}/repos/${owner}/${repo}/statuses/${pr_sha}`, { headers })
  } catch (err) {
    console.log(err)
    return `There was an error getting PR number ${num}.`
  }

  const responseData = response.data

  if (responseData.length > 0) {
    const desc = responseData[0].description
    const time = convertDate(responseData[0].created_at)
    console.log(responseData[0].created_at)

    message = `For PR ${num}, ${desc} at ${time}. It was created by ${author}.`
  } else message = `The repository ${repo} by ${user} doesn't seem to have an integrated CI, at least for PR ${pr_num}.`
  const embed = new Discord.MessageEmbed().setDescription(message)
  return embed
}
