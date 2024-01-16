// import { createRequire } from 'module';
// const { MongoClient } = createRequire("mongodb")

import { DB_URL } from './db_common.js';
import mongodb, { ObjectId } from 'mongodb'
const MongoClient = mongodb.MongoClient;

const url = DB_URL;
const client = new MongoClient(url)

const dbName = "books";
const collectionBookInfo = "book_info";
const collectionBookGroups = "book_groups";

export default {
    async getBookGroups(params) {
        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection(collectionBookGroups);
        const bookGroups = await collection.find().sort({ 'order': 1 }).toArray();
        client.close();
        return bookGroups;
    },

    async getBookByIDs(ids) {
        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection(collectionBookInfo);
        const books = await collection.find({ _id: { $in: ids } }).toArray();
        client.close();
        return books;
    },

    async getBookInfos(params) {
        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection(collectionBookInfo);
        const bookInfos = await collection.find(params).toArray();
        client.close();
        return bookInfos;
    },

    async addBooks(bookInfos) {
        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection(collectionBookInfo);
        const rs = await collection.insertMany(bookInfos)
        client.close();
        return rs;
    },

    async deleteBooks(params) {
        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection(collectionBookInfo);
        const rs = await collection.deleteMany(params)
        client.close();
        return rs;
    }


}