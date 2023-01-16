const Discord = require("discord.js")
const { Client, GatewayIntentBits, Partials } = require("discord.js");
const { AutoPoster } = require('topgg-autoposter');
const chalk = require('chalk');
const giveawayModel = require('./schema/giveawayDatabase.js');
const { logErr } = require('./utils/logger.js');

const client = new Client({
  partials: [
    Partials.Message, // for message
    Partials.Channel, // for text channel
    Partials.GuildMember, // for guild member
    Partials.Reaction, // for message reaction
  ],
  intents: [
    GatewayIntentBits.Guilds, // for guild related things
    GatewayIntentBits.GuildInvites, // for guild invite managing
    GatewayIntentBits.GuildMessageReactions
  ],
});

let started = false;

client.once('ready', () => started = true);
const { spawn } = require('child_process');
setTimeout(() => {
  if (!started) {
    console.log('Killing Container, cuz bot stuck :)');
    return spawn('kill', ['1'])
  }
}, 13000)

const fs = require("fs");
const config = require("./config.js");
client.config = config;
client.cooldowns = new Discord.Collection();

const ap = AutoPoster(process.env.TOPGG_TOKEN, client)

ap.on('posted', () => {
  console.log(chalk.greenBright('[TopGG] ')+ 'Posted stats to Top.gg!');
})

const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URI);
const db = mongoose.connection;

// Check the connection
db.on('error', console.error.bind(console, 'Connection error:'));
db.once('open', () => {
  console.log(chalk.greenBright('[🌿 MongoDB]') + ' Connected to MongoDB.');
});

mongoose.set('strictQuery', false);

const { GiveawaysManager } = require("discord-giveaways");
const GiveawayManager = class extends GiveawaysManager {
  // This function is called when the manager needs to get all giveaways which are stored in the database.
  async getAllGiveaways() {
    // Get all giveaways from the database. We fetch all documents by passing an empty condition.
    return await giveawayModel.find().lean().exec();
  }

  // This function is called when a giveaway needs to be saved in the database.
  async saveGiveaway(messageId, giveawayData) {
    // Add the new giveaway to the database
    await giveawayModel.create(giveawayData);
    // Don't forget to return something!
    return true;
  }

  // This function is called when a giveaway needs to be edited in the database.
  async editGiveaway(messageId, giveawayData) {
    // Find by messageId and update it
    await giveawayModel.updateOne({ messageId }, giveawayData).exec();
    // Don't forget to return something!
    return true;
  }

  // This function is called when a giveaway needs to be deleted from the database.
  async deleteGiveaway(messageId) {
    // Find by messageId and delete it
    await giveawayModel.deleteOne({ messageId }).exec();
    // Don't forget to return something!
    return true;
  }
};

// Initialise discord giveaways
client.giveawaysManager = new GiveawayManager(client, {
  default: {
    botsCanWin: false,
    embedColor: "#2F3136",
    reaction: "🎉",
    lastChance: {
      enabled: true,
      content: `🛑 **Last chance to enter** 🛑`,
      threshold: 5000,
      embedColor: '#FF0000'
    }
  }
});

/* Load all events (discord based) */
let totalFileCount = 0;
let tt = false;
let ft = false;

function loadedEvents() {
  if (tt && ft) console.log('\n\n' + chalk.hex('#5865F2')('[EventManager]') + `Loaded ${totalFileCount} Events.`)
}

fs.readdir("./events/discord", async (_err, files) => {
  let fileCount = 0;
  await files.forEach(file => {
    if (!file.endsWith(".js")) return;
    const event = require(`./events/discord/${file}`);
    let eventName = file.split(".")[0];
    console.log(chalk.hex('#5865F2')('[DiscordEvent]') + ` Loaded: ${eventName}`);
    client.on(eventName, event.bind(null, client));
    delete require.cache[require.resolve(`./events/discord/${file}`)];
    fileCount += 1;
  })
  totalFileCount += fileCount
  if (fileCount = files.length) ft = true;
  loadedEvents();
})

fs.readdir("./events/giveaways", async (_err, files) => {
  let fileCount = 0;
  await files.forEach((file) => {
    if (!file.endsWith(".js")) return;
    const event = require(`./events/giveaways/${file}`);
    let eventName = file.split(".")[0];
    console.log(chalk.hex('#FFAC1C')('[GiveawayEvent]') + ` 🎉 Loaded: ${eventName}`);
    client.giveawaysManager.on(eventName, (...file) => event.execute(...file, client)), delete require.cache[require.resolve(`./events/giveaways/${file}`)];
    fileCount += 1;
  })
  totalFileCount += fileCount
  if (fileCount = files.length) tt = true;
  loadedEvents()
})

process.on('unhandledRejection', error => {
  logErr.error(`${error.stack}`, {
        time: new Date(),
  });
  console.log(`UnhandledPromiseRejection : ${error}\n`)
  console.log(chalk.hex('#FFAC1C')(`${error.stack}\n`))
});


client.interactions = new Discord.Collection();
// creating an empty array for registering slash commands
client.slashArr = []
client.slashPrivateArr = []
client.modalHandlers = new Discord.Collection();
/* Load all slash commands */
fs.readdir("./slash/", (_err, files) => {
  files.forEach(file => {
    if (!file.endsWith(".js")) return;
    let props = require(`./slash/${file}`);
    let commandName = file.split(".")[0];
    client.interactions.set(commandName, props);
    if (props.private === true) {
      client.slashPrivateArr.push(props.data)
    } else client.slashArr.push(props.data)
  });
});

fs.readdir("./modalHandler/", (_err, files) => {
  files.forEach(file => {
    if (!file.endsWith(".js")) return;
    let props = require(`./modalHandler/${file}`);
    let handlerName = file.split(".")[0];
    client.modalHandlers.set(handlerName, props);
  });
});

const http = require('http')
http.createServer(function(req, res) {
  res.write("Online :)");
  res.end();
}).listen(8080);


// Login through the client
client.login(config.token);
