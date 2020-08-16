require('dotenv').config();

const { Client } = require('discord.js');
const bot = new Client({
    messageCacheMaxSize: 1,
    messageSweepInterval: 60,
    messageCacheLifetime: 30,
    presence: {
        activity: {
            type: "WATCHING",
            name: `the GDC 👀`
        }
    }
});
const scheduler = require('./scheduler');
scheduler.once(bot, ["VIQC", "Judging"]);

// scheduler.start(client);

bot.login(process.env.TOKEN);