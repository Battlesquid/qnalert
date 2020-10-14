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
(async () => {
	await bot.login(process.env.TOKEN);
	await scheduler.once(bot);
	process.exit();
})()
