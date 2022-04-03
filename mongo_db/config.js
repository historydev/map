import {MongoClient} from "mongodb";

const url = 'mongodb+srv://historydev:aasus2001@map1.gufrr.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';
const dbName = 'map';

export default class Connection {
    constructor() {
        this.client = new MongoClient(url);
        this.collection = undefined;
    }

    async query(collectionName) {
        await this.client.connect();
        const db = this.client.db(dbName);
        this.collection = await db.collection(collectionName);
        return this.collection
    }

    async find(collection, item, options = {}, sort = {}) {
        return await this.collection.find(item, options).sort(sort).toArray();
    }

}