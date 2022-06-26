const config = require("../util/conf");
const logger = require("../util/logger");
const { MessageEmbed } = require("discord.js");

const generateEmbeds = async (category, questions) => {
    const embeds = [];
    const colors = {
        "VRC": "#E62525",
        "VEXU": "#952CD1",
        "VAIC": "#4FDE28",
        "VIQC": "#226AE6",
        "Judging": "#E6A122"
    };

    const MAX_EMBEDS_PER_MSG = 10;
    const msgCount = Math.ceil(questions.length / MAX_EMBEDS_PER_MSG);

    for (let i = 0; i < msgCount; i++) {
        const start = i * MAX_EMBEDS_PER_MSG;
        const end = Math.min(questions.length, start + MAX_EMBEDS_PER_MSG);
        const group = questions
            .slice(start, end)
            .map(async question => {
                const { url, title, author, timestamp, tags } = question;

                return new MessageEmbed()
                    .setColor(colors[category])
                    .setTitle(`New ${category} Q&A Response!`)
                    .setDescription(`Asked by ${author} ${timestamp}`)
                    .addField("Question: ", `[${title}](${url})`)
                    .setFooter({
                        text: `${tags.length ? "🏷️ " + tags.join(", ") : "No tags"}`
                    });
            });

        embeds.push(group);
    }

    return await Promise.all(embeds.map(async g => Promise.all(g)));
};

module.exports.alert = async (client, category, questions) => {
    const groups = await generateEmbeds(category, questions);

    try {
        const channel = await client.channels.fetch(config.get().categories[category]);

        const promises = [];
        groups.forEach(group => promises.push(channel.send({ embeds: [...group] })));

        await Promise.all(promises);
        return true;
    } catch (e) {
        logger.error(Object.getOwnPropertyNames(e).map(p => `error.${p} : ${e[p]}`).join("\n"));
        return false;
    }
};
