const mongoose = require('mongoose');

const whitelistUserSchema = new mongoose.Schema(
    {
        id: String,
        permissionAll: { type: Boolean, default: false},
        permissions: { type: [String], default: []},
    }
);

const whitelistUserModel = mongoose.model('whitelistUsers', whitelistUserSchema);

module.exports = whitelistUserModel;