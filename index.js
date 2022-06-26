require("dotenv").config();

const { Client, Intents } = require("discord.js");
const scheduler = require("./modules/scheduler");

const client = new Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES,
    ],
    presence: {
        activity: {
            type: "WATCHING",
            name: "the GDC 👀"
        }
    }
});

(async () => {
    await client.login(process.env.DISCORD_BOT_TOKEN);
    scheduler.start(client);
})();
