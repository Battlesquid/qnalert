import admin from "firebase-admin";

export interface FirebaseConfig {
    serviceToken: string;
    databaseURL: string;
}

export class FirebaseClient {
    private firestore: FirebaseFirestore.Firestore;

    constructor(config: FirebaseConfig) {
        admin.initializeApp({
            credential: admin.credential.cert(JSON.parse(config.serviceToken)),
            databaseURL: config.databaseURL
        });
        this.firestore = admin.firestore();
    }

    getCollectionRef(collection: string) {
        return this.firestore.collection(collection);
    }

    getDocumentRef(collection: string, document: string) {
        return this.getCollectionRef(collection).doc(document);
    }
}