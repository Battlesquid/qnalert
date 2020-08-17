const config = require('../config.json');
const db = require('./database');
const { MessageEmbed } = require('discord.js');
const logger = require('../modules/logger');

const generateEmbeds = async (category, answeredIDs) => {
    const embeds = [];
    const colors = {
        VRC: "#E62525", VEXU: "#952CD1",
        "VAIC-HS": "#4FDE28", "VAIC-U": "#4FDE28",
        VIQC: "#226AE6", Judging: "#E6A122",
        RAD: "#4FDE28"
    }

    for (const id of answeredIDs) {
        const question = await db.collection(category).doc(id).get();
        const { url, title, author, timestamp, tags } = question.data();

        const embed = new MessageEmbed();
        embed
            .setColor(colors[category])
            .setTitle(`New ${category} Q&A Response!`)
            .setDescription(`Asked by ${author} ${timestamp}`)
            .addField("Question: ", `[${title}](${url})`)
            .setFooter(`${tags.length ? "🏷️ " + tags.replace(",", ", ") : "No tags"}`);

        embeds.push(embed);
    }
    return embeds;
}

module.exports.sendQuestions = async (client, category, answeredIDs) => {
    let sent = true;
    const embeds = await generateEmbeds(category, answeredIDs);
    try {
        throw Error("not actually an error just a test")

        const channel = await client.channels.fetch(config.categories[category]);
        embeds.forEach(async embed => await channel.send(embed));
    } catch (e) { logger.error(e), sent = false; }
    return sent;
}
