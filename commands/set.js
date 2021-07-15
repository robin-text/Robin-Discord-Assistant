const axios = require('axios');
const API = 'https://robinrestapi.herokuapp.com/';
const Discord = require('discord.js');
const sqlite = require('sqlite3').verbose()

module.exports = async function(options, id, userOwners, userRepos, db) {
    var owner = options[0].value
    var repo = options[1].value
    userOwners.set(id, owner);
    userRepos.set(id, repo);
    let insertdata = db.prepare(`INSERT INTO data VALUES(?,?,?)`);
    insertdata.run("idhere", owner, repo);
    insertdata.finalize();
    db.close();
    // add webhook stuff here
    // result = await axios.get(`https://api.github.com/repos/${owner}/${repo}`);
    // console.log(result.status);
    // console.log(result);
    //
    description = `Now set to [${owner}/${repo}](https://github.com/${owner}/${repo})`;
    const embed = new Discord.MessageEmbed()
        .setDescription(description)
    return embed
}
