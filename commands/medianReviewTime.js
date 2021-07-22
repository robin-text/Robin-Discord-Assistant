const axios = require('axios')
const API = 'https://api.github.com'
const Discord = require('discord.js')

const calcDate = function (num, time, date) {
  let offset = 14 // offset time unit in days, default two weeks
  let monthOffset = 0
  let yearOffset = 0
  if (typeof num !== 'undefined' && typeof time !== 'undefined') {
    if (time.localeCompare('weeks') == 0) {
      offset = num * 7
    } else if (time.localeCompare('months') == 0) {
      monthOffset = num % 12 + 1
      yearOffset = Math.floor(num / 12)
      offset = 0
    } else {
      offset = num
    }
  } else if (typeof date !== 'undefined') {
    return date
  }
  const d = new Date()
  d.setDate(d.getDate() - offset - 1) // calculate start date
  console.log('offsets ', offset, monthOffset, yearOffset)
  console.log('0' + (d.getUTCMonth() + 1 - monthOffset))
  const month = ('0' + (d.getUTCMonth() + 1 - monthOffset)).slice(-2)
  const day = ('0' + (d.getUTCDate())).slice(-2)
  const year = d.getUTCFullYear() - yearOffset
  const startDate = year + '-' + month + '-' + day
  return startDate
}

const parsePRList = function (responses, dateParsed) {
  const times = []
  for (const response of responses) {
    if (typeof response.data === 'undefined') {
      return response
    }
    const responseData = response.data.items
    for (let i = 0; i < responseData.length; i++) {
      const closed = new Date(responseData[i].closed_at)
      const created = new Date(responseData[i].created_at)
      times.push((closed.getTime() - created.getTime()) / 8.64e+7) // convert ms to days
      // console.log(times[i]);
    }
  }
  const message = `For pull requests closed since ${dateParsed}, the median pull request time was ${times[Math.floor(times.length / 2)].toFixed(1)} days, or ${(times[Math.floor(times.length / 2)] * 24).toFixed(2)} hours`
  return message
}

module.exports = async function (args, repo, owner, token) {
  const num = 0
  const time = 0
  const date = 0
  let message = ''
  let pageNum = 1
  const responses = []
  const dateParsed = calcDate(num, time, date)
  const headers = {
    Authorization: `token ${token}`,
    Accept: 'application/vnd.github.v3+json'
  }
  const request_url = `${API}/search/issues?q=repo:${owner}/${repo}+type:pr+state:closed+closed:>=${date}&page=${pageNum}&per_page=100`
  let result = await axios.get(request_url, { headers })
  if (result.status !== 200) {
    message = 'There seems to be a problem getting the start date to calculate the median review time.'
  }
  let count = result.data.total_count

  if (count === 0) {
    message = `No pull requests have been closed since ${dateParsed}`
  }
  while (count > 0) {
    count -= 100
    responses.push(result)
    pageNum++
    result = await axios.get(request_url, { headers })
  }
  if (responses.length > 0) {
    message = parsePRList(responses, dateParsed)
  }
  return new Discord.MessageEmbed().setDescription(message)
}
