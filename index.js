require('dotenv').config();

const { Client } = require('discord.js');
const bot = new Client({
    messageCacheMaxSize: 1, messageSweepInterval: 60, messageCacheLifetime: 120, presence: {
        activity: {
            type: "WATCHING",
            name: `the GDC 👀`
        }
    }
});
require('./scheduler.js')(bot);

bot.login(process.env.TOKEN);