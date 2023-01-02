const mongoose = require('mongoose');

const secretSantaUserSchema = new mongoose.Schema(
  {
    guildId: String,
    participants: [{
        userId: String,
        timestamp: {
          type: [Number], default: Date.now()
        }
      }],
  },
);

const secretSantaUserModel = mongoose.model('secretSantaUsers', secretSantaUserSchema);

module.exports = secretSantaUserModel;