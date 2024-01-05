import { DB_URL } from './db_common.js';

import moment from 'moment';

import mongodb from 'mongodb'


const MongoClient = mongodb.MongoClient;

const url = DB_URL;
const client = new MongoClient(url)

const dbName = "user";
const collectionName = "user_info";


export default {
    async checkUserExist(identifier) {
        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection(collectionName);
        console.log("DB ", "checkUserExist identifier = " + identifier)
        const users = await collection.findOne({ auths: { $elemMatch: { 'identifier': { $eq: identifier } } } });
        // const users = await collection.find().toArray();
        client.close();
        return users;
    },

    async addUser(identity_type, credential, identifier) {
        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection(collectionName);
        console.log("DB ", "addUser identifier = " + identifier + ", credential = " + credential + ", type = " + identity_type);


        var jsonParam = {
            "name": '',
            "avatar": '',
            "type": 0,
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

        const result = await collection.insertOne(jsonParam);
        // const users = await collection.find().toArray();
        client.close();
        return result;
    }



}