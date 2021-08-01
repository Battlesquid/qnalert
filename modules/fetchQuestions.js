const { unleak, unformat } = require('./stringUtil');
const { load } = require('cheerio');
const fetch = require('node-fetch');
const db = require('./database');

const getActiveSeason = async () => {
    const response = await fetch(`https://www.robotevents.com/api/v2/seasons?active=true`, {
        headers: {
            "Authorization": `Bearer ${process.env.ROBOT_EVENTS_KEY}`
        }
    });
    const { data } = await response.json();
    const { years_start, years_end } = data.find(program => program.program.code === "VRC");
    return { years_start, years_end };
}

const getPageCount = async url => {
    const response = await fetch(url);
    const html = unleak((await response.text()))
    const $ = load(html);
    const baseCount = parseInt(unleak($('.pagination', '.card-body').find('li').length));
    const pageCount = baseCount - (baseCount > 2 ? 2 : 0) + (baseCount === 0 ? 1 : 0);
    return pageCount;
}

module.exports.getCurrentQuestions = async category => {
    const ids = [];
    const batch = db.batch();

    const { years_start, years_end } = await getActiveSeason();
    const pageCount = await getPageCount(`https://www.robotevents.com/${category}/2020-2021/QA`);
    console.log(pageCount);
    console.log(`https://www.robotevents.com/${category}/2020-2021/QA`);

    for (let i = 1; i <= pageCount; i++) {
        const response = await fetch(`https://www.robotevents.com/${category}/${years_start}-${years_end}/QA?page=${i}`);
        const html = unleak((await response.text()));

        const $ = load(html);
        const questions = $('.card-body').children('h4.title:not(:has(a span))').toArray();

        const promises = questions.map(async question => {
            const url = unleak($(question).children('a').attr('href'));
            const id = url.match(/QA\/(\d+)/)[1];

            const questionRef = db.collection(category).doc(id);
            const questionSnapshot = await questionRef.get();

            if (!questionSnapshot.exists) {
                //ps i hate scraping
                const title = unleak(unformat(unleak($(question).text())));
                const author = unleak(unformat(unleak($(question).nextUntil('hr').children('.details').children('.author').text())));
                const timestamp = unleak(unformat(unleak($(question).nextUntil('hr').children('.details').children('.timestamp').text())));
                const tags = unleak(unformat(unleak($(question).next().next('.tags').text()), false));
                batch.set(questionRef, { title, author, timestamp, tags, url });

            } else {
                //because i'm paranoid of the string memory issue
                const timestamp = unleak(unformat(unleak($(question).nextUntil('hr').children('.details').children('.timestamp').text())));
                batch.update(questionRef, { timestamp })
            }
            ids.push(id);
        })
        await Promise.all(promises);
    }

    await batch.commit();
    return ids;
}
