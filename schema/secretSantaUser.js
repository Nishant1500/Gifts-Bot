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
      recipientId: String,
      wishlist: { 
        type: [String],
        default: []
      }
    }],
    startedBy: String,
    started: {type: Boolean, default: false}
  },
);

const secretSantaUserModel = mongoose.model('secretSantaUsers', secretSantaUserSchema);

module.exports = secretSantaUserModel;