const mongoose = require('mongoose');

const whitelistSchema = new mongoose.Schema(
    {
        guildId: String,
        permissionAll: { type: Boolean, default: false},
        permissions: { type: [String], default: null},
    }
);

const whitelistModel = mongoose.model('whitelists', whitelistSchema);

module.exports = whitelistModel;