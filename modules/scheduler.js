const config = require("../util/conf");
const cron = require("node-cron");
const logger = require("../util/logger");
const alerter = require("../modules/alerter");
const questions = require("../modules/questions");
const groupby = require("../util/groupby");

module.exports.check = async (client, testCategories = []) => {
    logger.info("Getting current questions...");

    const currentQuestions = await questions.current();
    const categories = groupby(currentQuestions, "category");

    for (const category in categories) {
        logger.info(`Processing unanswered questions for ${category}...`);

        try {
            logger.info(`Fetching stored question queue for ${category}...`);
            const storedQuestions = await questions.getStored(category);

            //solely for testing purposes
            if (testCategories.includes(category)) {
                storedQuestions.pop();
            }

            const answeredQuestions = questions.diff(categories[category], storedQuestions);

            if (!answeredQuestions.length) {
                logger.info(`No new reponses for ${category}\n`);
                continue;
            } else {
                logger.log("alert", `${answeredQuestions.length} ${category} responses detected, sending alert.`);
            }

            const sent = await alerter.alert(client, category, answeredQuestions);

            if (sent) {
                logger.log("notify", `Successfully sent alerts for ${category}\n`);
                if (!testCategories.length) {
                    await questions.remove(category, answeredQuestions);
                    logger.info(`Removed IDs ${answeredQuestions.join(", ")} from the question queue.\n`);
                }
            } else {
                logger.log("alert", `Failed to send alerts for ${category}, will retry on next scheduled check.\n`);
            }
        } catch (e) {
            logger.error(`An error occured: ${e}`);
        }
    }
};

module.exports.start = client => {
    if (!cron.validate(config.get().pollingRate)) {
        console.log("invalid cron time, exiting");
        process.exit(1);
    }
    cron.schedule(config.get().pollingRate, () => module.exports.check(client));
};

//solely for testing purposes
module.exports.once = (client, testCategories) => module.exports.check(client, testCategories);
