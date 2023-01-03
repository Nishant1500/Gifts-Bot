const mongoose = require('mongoose');

const secretSantaUserSchema = new mongoose.Schema(
  {
    guildId: String,
    participants: [{
        userId: String,
        timestamp: {
          type: Number, default: Date.now(),
        }
      }],
    choosen: [{
      userId: String,
      recipientId: String
    }],
    startedBy: String,
    started: {type: Boolean, default: false}
  },
);

const secretSantaUserModel = mongoose.model('secretSantaUsers', secretSantaUserSchema);

module.exports = secretSantaUserModel;