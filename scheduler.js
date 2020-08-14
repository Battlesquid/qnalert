const util = require('./modules/util');
const { sendQuestions } = require('./modules/messageGenerator');
const { getStoredIDs, removeStoredIDs } = require('./modules/idHandler');
const { getCurrentQuestions } = require('./modules/fetchQuestions');

const cron = require('node-cron');

module.exports = client => {
    cron.schedule("*/5 * * * * *", async function check() {
        for (const category of ["VRC", "VEXU", "VIQC", "Judging"]) {
            try {
                const currentIDs = await getCurrentQuestions(category, pageCount);
                const storedIDs = await getStoredIDs(category);
                const answeredIDs = storedIDs.map(id => !currentIDs.includes(id) ? id : false).filter(id => id);

                if (!answeredIDs.length) {
                    console.log("No new responses");
                    continue;
                }

                await sendQuestions(client, category, answeredIDs);
                await removeStoredIDs(category, answeredIDs);
            } catch (e) { console.log(e); }
        }
    });
    cron.schedule("55 9 * * *", async function update() {
        const { years_start, years_end } = await util.getActiveSeason();

        for (const category of ["VRC", "VEXU", "Judging", "VIQC"]) {
            try {
                await getCurrentQuestions(category, `https://www.robotevents.com/${category}/${years_start}-${years_end}/QA`, true);
            } catch (e) { console.log(e); }
        }
    })
}


