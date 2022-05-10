const admin = require("firebase-admin");

admin.initializeApp({
    credential: admin.credential.cert(JSON.parse(process.env.FIREBASE_AUTH)),
    databaseURL: "https://q-abeta.firebaseio.com"
});

module.exports = {
    firestore: admin.firestore(),
    ref: (collection, document) => {
        if(document) {
            return module.exports.firestore.collection(collection).doc(document);
        }
        return module.exports.firestore.collection(collection);
    }
};
