const db = require("./database");
const { getUnansweredQuestions } = require("vex-qna-archiver");

module.exports.current = async () => {
    const batch = db.firestore.batch();

    const questions = await getUnansweredQuestions();

    const promises = questions.map(async (q) => {
        const { id, category, title, author, timestamp, tags, url } = q;
        const ref =  db.ref(category, id);
        const snapshot = await ref.get();

        if (snapshot.exists) {
            batch.update(ref, { timestamp: q.timestamp });
        } else {
            batch.set(ref, {
                id, title, author, timestamp, tags, url
            });
        }
    });

    await Promise.all(promises);
    
    await batch.commit();

    return questions;
};

module.exports.diff = (oldQuestions, newQuestions) => {
    const filtered = oldQuestions.filter(o => {
        return !newQuestions.find(n => n.id === o.id);
    });
    return filtered;
};

module.exports.getStored = async (category) => {
    const snapshot = await db.ref(category).get();
    return snapshot.docs.map(q => q.data());
};

module.exports.remove = async (category, questions) => {
    return Promise.all(
        questions.map(async (q) => db.ref(category, q.id).delete())
    );
};
