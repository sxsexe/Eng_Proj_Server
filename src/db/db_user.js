import { DB_URL } from './db_common.js';

import moment from 'moment';

import mongodb from 'mongodb'


const MongoClient = mongodb.MongoClient;

const url = DB_URL;
const client = new MongoClient(url)

const DB = "user";
const CN_UserInfo = "user_info";
const CN_UserBooks = "user_books";
const CN_UserWords = "user_words";


export default {
    async checkUserExist(identifier, credential) {
        await client.connect();
        const db = client.db(DB);
        const collection = db.collection(CN_UserInfo);
        console.log("DB ", "checkUserExist identifier = " + identifier + ", credential = " + credential)
        const users = await collection.findOne({ auths: { $elemMatch: { 'identifier': { $eq: identifier }, 'credential': { $eq: credential } } } });
        // const users = await collection.find().toArray();
        client.close();
        return users;
    },

    async addUser(identity_type, credential, identifier) {
        await client.connect();
        const db = client.db(DB);
        const collection = db.collection(CN_UserInfo);
        console.log("DB ", "addUser identifier = " + identifier + ", credential = " + credential + ", type = " + identity_type);


        var jsonParam = {
            "name": '',
            "avatar": '',
            "vip_type": 0,
            "update_time": '',
            "create_time": moment().format('YYYY-MM-DD HH:mm:ss'),
            "auths": [
                {
                    "identity_type": identity_type,
                    "credential": credential,
                    "identifier": identifier
                }
            ]
        }

        // username + pwd
        if (identity_type == 1) {
            jsonParam.name = identifier
        }

        const result = await collection.insertOne(jsonParam);
        // const users = await collection.find().toArray();
        client.close();
        return result;
    },

    async getUserBooks(params) {
        await client.connect();
        const db = client.db(DB);
        const collection = db.collection(CN_UserBooks);
        console.log("DB ", "getUserBooks params = ", params)
        const userBooks = await collection.find(params, { projection: { 'book_id': 1, '_id': 0 } }).toArray();
        // const users = await collection.find().toArray();
        client.close();
        return userBooks;
    },


    async upsertUserWord(user_id, word_id, word_name, score, word_db) {
        await client.connect();
        const db = client.db(DB);
        const collection = db.collection(CN_UserWords);
        const query = { "_id": { "user_id": user_id, "word_id": word_id } };
        const newValues = { $set: { "score": score, "word_db": word_db, "word_name": word_name } };
        const result = await collection.updateOne(query, newValues, { upsert: true })
        client.close();
        return result;
    },

    async getUserWordCount(user_id, max_score) {
        await client.connect();
        const db = client.db(DB);
        const collection = db.collection(CN_UserWords);
        const result = await collection.countDocuments({ "_id.user_id": { $eq: user_id }, "score": { $lt: max_score } });
        client.close();
        return result;
    },

    async getUserWords(user_id, max_score) {
        await client.connect();
        const db = client.db(DB);
        const collection = db.collection(CN_UserWords);
        const result = await collection.find({ "_id.user_id": { $eq: user_id }, "score": { $lt: max_score } }).toArray();
        client.close();
        return result;
    }

}