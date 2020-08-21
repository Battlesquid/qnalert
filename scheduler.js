const config = require('./config.json');
const cron = require('node-cron');
const logger = require('./modules/logger');
const { sendQuestions } = require('./modules/messageGenerator');
const { getStoredIDs, removeStoredIDs } = require('./modules/idHandler');
const { getCurrentQuestions } = require('./modules/fetchQuestions');

module.exports.check = async (client, poppables = []) => {
    for (const category of Object.keys(config.categories)) {
        try {
            logger.info(`Fetching unanswered questions for ${category}...`);
            const currentIDs = await getCurrentQuestions(category);

            logger.info(`Fetching stored question queue for ${category}...`);
            const storedIDs = await getStoredIDs(category);

            //solely for testing purposes
            if (poppables.includes(category)) currentIDs.pop();

            const answeredIDs = storedIDs.map(id => !currentIDs.includes(id) ? id : false).filter(id => id);
            logger.alert(`Responses detected (IDs): ${answeredIDs.length ? answeredIDs.join(", ") : "[none]"}`);

            if (!answeredIDs.length) {
                logger.info(`No new reponses for ${category}\n`);
                continue;
            }

            logger.log("alert", `New ${category} responses detected, sending messages.`);
            const sent = await sendQuestions(client, category, answeredIDs);

            if (sent) {
                logger.notify(`Successfully sent messages for ${category}\n`)
                if (!poppables.length) {
                    await removeStoredIDs(category, answeredIDs);
                    logger.info(`Removed IDs ${answeredIDs.join(", ")} from the question queue.\n`)
                }
            } else {
                logger.alert(`Failed to send messages for ${category}, will retry on next scheduled check.\n`);
            }
        } catch (e) { logger.error(`Something weird happened: ${e}`) }
    }
}

module.exports.start = client => {
    if (!cron.validate(config.pollingRate)) {
        console.log("invalid cron time, killing process");
        process.kill();
    }
    cron.schedule(config.pollingRate, () => module.exports.check(client))
}

//solely for testing purposes
module.exports.once = (client, poppables) => module.exports.check(client, poppables);
