require('dotenv').config();

const { Client } = require('discord.js');
const bot = new Client({
    messageCacheMaxSize: 1,
    messageSweepInterval: 120,
    messageCacheLifetime: 30,
    presence: {
        activity: {
            type: "WATCHING",
            name: "the GDC 👀"
        }
    }
});

const scheduler = require('./scheduler');
scheduler.once(bot);
// scheduler.start(bot);

bot.login(process.env.TOKEN);