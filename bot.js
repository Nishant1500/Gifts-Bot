const Discord = require("discord.js")
const { Client, GatewayIntentBits, Partials } = require("discord.js");
const { AutoPoster } = require('topgg-autoposter');
const chalk = require('chalk');

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
const fs = require("fs");
const config = require("./config.js");
client.config = config;

const ap = AutoPoster('Your Top.gg Token', client)

ap.on('posted', () => {
  console.log('Posted stats to Top.gg!')
})


// Initialise discord giveaways
const { GiveawaysManager } = require("discord-giveaways");
client.giveawaysManager = new GiveawaysManager(client, {
  storage: "./storage/giveaways.json",
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
  if(tt && ft) console.log('\n\n' + chalk.hex('#5865F2')('[EventManager]') + `Loaded ${totalFileCount} Events.`)
}

fs.readdir("./events/discord", async (_err, files) => {
  let fileCount = 0;
  await files.forEach(file => {
    if (!file.endsWith(".js")) return;
    const event = require(`./events/discord/${file}`);
    let eventName = file.split(".")[0];
    console.log(chalk.hex('#5865F2')('[DiscordEvent]') +   ` Loaded: ${eventName}`);
    client.on(eventName, event.bind(null, client));
    delete require.cache[require.resolve(`./events/discord/${file}`)];
    fileCount += 1;
  })
  totalFileCount += fileCount
  if(fileCount = files.length) ft = true; 
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
  })
totalFileCount += fileCount
  if(fileCount = files.length) tt = true;
  loadedEvents()
})

process.on('unhandledRejection', error => {
    console.log(`UnhandledPromiseRejection : ${error}\n`)
  console.log(chalk.hex('#FFAC1C')(`${error.stack}\n`))
});
    
    
    
  client.interactions = new Discord.Collection();
// creating an empty array for registering slash commands
client.slashArr = []
/* Load all slash commands */
fs.readdir("./slash/", (_err, files) => {
  files.forEach(file => {
    if (!file.endsWith(".js")) return;
    let props = require(`./slash/${file}`);
    let commandName = file.split(".")[0];
    client.interactions.set(commandName, props);
    client.slashArr.push(props.data)
  });
});


// Login through the client
client.login(config.token);
