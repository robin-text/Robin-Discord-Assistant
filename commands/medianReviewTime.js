const axios = require('axios');
const API = 'https://robinrestapi.herokuapp.com/';
const Discord = require('discord.js');

calcDate = function(num, time, date) {
    var offset = 14;    //offset time unit in days, default two weeks
    var monthOffset = 0;
    var yearOffset = 0;
    if (typeof num !== "undefined" && typeof time !== "undefined") {
        if (time.localeCompare("weeks") == 0) {
            offset = num * 7;
        }
        else if (time.localeCompare("months") == 0) {
            monthOffset = num % 12 + 1;
            yearOffset = Math.floor(num / 12);
            offset = 0;
        }
        else {
            offset = num;
        }
    }
    else if (typeof date !== "undefined"){
        return date;
    }
    var d = new Date();
    d.setDate(d.getDate() - offset - 1);    //calculate start date
    console.log("offsets ", offset, monthOffset, yearOffset)
    console.log('0' + (d.getUTCMonth()  + 1 - monthOffset))
    var month = ('0' + (d.getUTCMonth() + 1 - monthOffset)).slice(-2);
    var day = ('0' + (d.getUTCDate())).slice(-2);
    var year = d.getUTCFullYear() - yearOffset;
    var startDate = year + '-' + month + '-' + day;
    return startDate;
}

parsePRList = function (responses, dateParsed) {
    var times = [];
    for (const response of responses) {
        if (typeof response.data === "undefined") {
            return response;
        }
        var responseData = response.data.items;
        for (var i = 0; i < responseData.length; i++) {
            var closed = new Date(responseData[i].closed_at);
            var created = new Date(responseData[i].created_at);
            times.push((closed.getTime() - created.getTime()) / 8.64e+7);   //convert ms to days
            // console.log(times[i]);
        }
    }
    var message = `For pull requests closed since ${dateParsed}, the median pull request time was ${times[Math.floor(times.length / 2)].toFixed(1)} days, or ${(times[Math.floor(times.length / 2)]*24).toFixed(2)} hours`;
    return message;
}

module.exports = async function(args, repo, owner, token) {
    var num = args[0];
    var time = args[1];
    var date = args[2];
    var message = '';
    var pageNum = 1;
    var responses = [];
    var dateParsed = calcDate(num, time, date);
    var result = await axios.get(`${API}pr/${owner}/${repo}/${dateParsed}/${pageNum}`);
    if (result.status !== 200)
    {
        message = `There seems to be a problem getting the start date to calculate the median review time.`
    }
    var count = result.data.total_count;

    if (count == 0) {
        message = `No pull requests have been closed since ${dateParsed}`;
    }
    while (count > 0) {
        count -= 100;
        responses.push(result);
        pageNum++;
        result = await axios.get(`${API}pr/${owner}/${repo}/${dateParsed}/${pageNum}`);
    }
    if (responses.length > 0) {
        message = parsePRList(responses, dateParsed);
    }
    const embed = new Discord.MessageEmbed().setDescription(message);
    return embed;
}

