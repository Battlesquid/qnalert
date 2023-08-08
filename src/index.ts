import { Client, Intents } from "discord.js";

const client: Client = new Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES,
    ],
    presence: {
        activities: [{
            type: "WATCHING",
            name: "the GDC 👀"
        }]
    }
});

export const loadClient = () => {
    return client.login(process.env.DISCORD_BOT_TOKEN);
}