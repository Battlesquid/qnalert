const db = require('./database');
const { MessageEmbed } = require('discord.js');

const generateEmbeds = async (category, answeredIDs) => {
    const embeds = [];
    const colors = {
        VRC: "#E62525", VEXU: "#952CD1",
        VIQC: "#226AE6", Judging: "#E6A122"
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
    const channels = await db.collection("subscribed").get();
    const flatChannels = channels.docs.map(doc => doc.data().channel);
    const embeds = await generateEmbeds(category, answeredIDs);

    for (const channelID of flatChannels) {
        const channel = await client.channels.fetch(channelID);
        embeds.forEach(async embed => await channel.send(embed));
    }
}
