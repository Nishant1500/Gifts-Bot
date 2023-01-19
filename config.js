require('dotenv').config()

const conf = {
  "token": process.env.BOT_TOKEN, 
  "prefix": process.env.PREFIX,
  "everyoneMention": false,
  "copyright": "©️ Gifts Bot"
}

module.exports = conf;
