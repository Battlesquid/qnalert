const db = require('./database');

module.exports.removeStoredIDs = async (category, answeredIDs) => {
    for (const answeredID of answeredIDs)
        await db.collection(category).doc(answeredID).delete();
}

module.exports.getStoredIDs = async collectionName => {
    const collection = await db.collection(collectionName).get();
    return collection.docs.map(doc => doc.id).reverse();
}