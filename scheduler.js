const config = require('./config.json');
const { sendQuestions } = require('./modules/messageGenerator');
const { getStoredIDs, removeStoredIDs } = require('./modules/idHandler');
const { getCurrentQuestions } = require('./modules/fetchQuestions');
const cron = require('node-cron');

module.exports.check = async (client, poppables = []) => {
    for (const category of Object.keys(config.categories)) {
        try {
            const currentIDs = await getCurrentQuestions(category);
            const storedIDs = await getStoredIDs(category);

            //solely for testing purposes
            if (poppables.includes(category)) currentIDs.pop();

            const answeredIDs = storedIDs.map(id => !currentIDs.includes(id) ? id : false).filter(id => id);

            if (!answeredIDs.length) {
                console.log(`No new reponses for ${category}`);
                continue;
            }

            console.log(`New ${category} responses detected, sending messages.`);
            const sent = await sendQuestions(client, category, answeredIDs);

            if (sent) {
                console.log("Successfully sent messages");
                if (!poppables.length) {
                    await removeStoredIDs(category, answeredIDs);
                }
            } else {
                console.log(`Failed to send messages for ${category}, will retry on next scheduled check.`);
            }
        } catch (e) { console.log(e); }
    }
}

module.exports.update = async () => {
    for (const category of Object.keys(config.categories)) {
        try {
            await getCurrentQuestions(category, true);
        } catch (e) { console.log(e); }
    }
}

module.exports.start = client => {
    cron.schedule("*/30 * * * * *", module.exports.check(client))
    cron.schedule("55 9 * * *", module.exports.update())
}

//solely for testing purposes
module.exports.once = (client, poppables) => module.exports.check(client, poppables);
