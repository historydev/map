import {MongoClient} from "mongodb";

const url = 'mongodb+srv://historydev:aasus2001@map1.gufrr.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';
const client = new MongoClient(url);
const dbName = 'map';

export default {
    query: async function (collectionName) {
        await client.connect();
        const db = client.db(dbName);
        return db.collection(collectionName);
    },
    client: client
}