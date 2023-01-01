const config = require('../config.js');
module.exports = {
  giveaway:
    (config.everyoneMention ? "@everyone\n\n" : "") +
    "🎉 **GIVEAWAY** 🎉",
  giveawayEnded:
    (config.everyoneMention ? "@everyone\n\n" : "") +
    "🎉 **GIVEAWAY ENDED** 🎉",
  drawing:  `⏳ Ends: **{timestamp}**`,
  inviteToParticipate: `React with 🎉 to participate!`,
  winMessage: "🎉 Congratulations, {winners}! You won **{this.prize}**!",
  embedFooter: "{this.winnerCount} winner(s)",
  noWinner: "Giveaway cancelled, no valid participations.",
  hostedBy: "👤 Host: {this.hostedBy}",
  winners: "✨ Winner(s): ",
  endedAt: "Ended at"
}
