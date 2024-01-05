
import { DB_URL } from './db_common.js';

import mongodb from 'mongodb'
const MongoClient = mongodb.MongoClient;

const url = DB_URL;
const client = new MongoClient(url)

const dbName = "books";
// const collectionName = "ket_words";


export default {
    async getKetWordsCount(collectionName) {
        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection(collectionName);
        const count = await collection.countDocuments()
        client.close();
        return count;
    },

    async getRandomWords(collectionName, count) {
        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection(collectionName);
        const pipeline = [
            { $sample: { size: parseInt(count) } }
        ];
        const word = await collection.aggregate(pipeline).toArray();
        client.close();
        return word;
    }
}