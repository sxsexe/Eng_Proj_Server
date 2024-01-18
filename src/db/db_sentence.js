
import { DB_URL } from './db_common.js';

import mongodb from 'mongodb'
const MongoClient = mongodb.MongoClient;

const url = DB_URL;
const client = new MongoClient(url)

const dbName = "setting";
const collectionName = "one_sentence_a_day";


export default {
    async add(obj) {
        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection(collectionName);
        let rs = {};
        try {
            rs = await collection.insertOne(obj);
        } catch (error) {
            console.error(error)
        } finally {
            client.close();
        }
        return rs;
    },
    async get(day) {
        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection(collectionName);
        const obj = await collection.findOne({ '_id': day });
        client.close();
        return obj;
    }

}