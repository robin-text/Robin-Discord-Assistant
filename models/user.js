const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    discordID: {
        type: String,
        required: true
    },
    githubToken: {
        type: String,
        required: true
    },
    owner: {
        type: String,
        required: false
    },
    repo: {
        type: String,
        required: false
    }
})

const User = mongoose.model('User', userSchema);
module.exports = User;