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
scheduler.start(bot);
// scheduler.once(bot, ["VRC", "VEXU"]);

bot.login(process.env.TOKEN);