
import db_books from "../db/db_books.js"
import db_words from '../db/db_words.js'
import db_user from '../db/db_user.js'
import db_sentense from "../db/db_sentence.js";
import { Errors } from "./Errors.js";
import { MyResponse } from "./Respons.js";

import moment from 'moment';

import { ObjectId } from 'mongodb'
// const db_ket_words = require("./db/db_ket_words")


export class Service {

    //-----------------------------User API-----------------------------
    /**
     * 
     * @param identity_type 登录类型 1:identifier + Password 2:ThirdApp + token
     * @param credential //密码凭证 password or token
     * @param identifier // 标识 (手机号/第三方应用的唯一标识)
     * @returns 
     */
    static async register({ identity_type, credential, identifier }) {
        const users = await db_user.checkUserExist(identifier, credential);
        var response;
        if (users) {
            response = new MyResponse(Errors.ERROR_UER_EXIST, { 'identifier': identifier });
        } else {
            const result = await db_user.addUser(identity_type, credential, identifier);
            if (result && result.acknowledged) {
                response = new MyResponse(Errors.customErrorObj(Errors.ERROR_NO_ERROR, "add user success"), { "rs": 1 });
            } else {
                response = new MyResponse(Errors.ERROR_UER_ADD_FAILED, null);
            }
        }
        console.log("Service >>>> register resp " + response.getOutput());
        return response;

    }

    static async login({ identifier, credential }) {
        console.log("Service >>>> login req ", identifier)
        const users = await db_user.checkUserExist(identifier, credential);
        var response;
        if (users) {
            response = new MyResponse(Errors.customErrorObj(Errors.ERROR_NO_ERROR, "Login Success"), { 'user': users });
        } else {
            response = new MyResponse(Errors.ERROR_USER_UNREGISTER, { 'identifier': identifier });
        }
        console.log("Service >>>> login resp " + response.getOutput());
        return response;
    }



    //-------------------------------------------------------------------


    //-----------------------------Books API-----------------------------
    static async getBookGroups({ user_id }) {
        const book_groups = await db_books.getBookGroups({ 'user_id': user_id });
        var response = new MyResponse(Errors.ERROR_NO_ERROR, { 'book_groups': book_groups });
        console.log("Service >>>> getBookGroups resp " + response.getOutput());
        return response;
    }

    static async getBookInfosByGroup({ user_id, group_id }) {
        const book_infos = await db_books.getBookInfos({ 'group_id': group_id });
        var response = new MyResponse(Errors.ERROR_NO_ERROR, { 'book_infos': book_infos });
        console.log("Service >>>> getBookInfos resp " + response.getOutput());
        return response;
    }

    static async getUserBooks({ user_id, learn_state }) {
        var param = {
            '_id.user_id': user_id
        }
        if (learn_state) {
            param['learn_state'] = learn_state;
        }
        const user_books = await db_user.getUserBooks(param);

        var tmp_maps = {};
        var book_ids = []
        user_books.forEach((one) => {
            var _book_id = one['_id']['book_id'];
            book_ids.push(new ObjectId(_book_id));
            tmp_maps[_book_id] = one['learn_state'];
        })
        // book_ids = ['65976d49165f19c8ab5e34c0', '65976d49165f19c8ab5e34c3']
        const books = await db_books.getBookByIDs(book_ids);
        books.forEach((one) => {
            var _book_id = one['_id'].toString();
            one['learn_state'] = tmp_maps[_book_id]
        })

        var response = new MyResponse(Errors.ERROR_NO_ERROR, { 'user_books': books });
        console.log("Service >>>> getBookInfos resp " + response.getOutput());
        return response;
    }

    static async upsertUserBooksStatus({ user_id, book_id, learn_state, book_type, last_time, create_time }) {
        var values = {};
        if (create_time) values['create_time'] = create_time;
        if (last_time) values['last_time'] = last_time;
        if (learn_state != null) values['learn_state'] = learn_state;
        if (book_type != null) values['book_type'] = book_type;

        const rs = await db_user.upsertUserBooksStatus(user_id, book_id, values);
        var response = new MyResponse(Errors.ERROR_NO_ERROR, { 'result': rs });
        console.log("Service >>>> upsertUserBooksStatus resp " + response.getOutput());
        return response;
    }

    static async addBooks({ books }) {
        const add_result = await db_books.addBooks(books);
        var response = new MyResponse(Errors.ERROR_NO_ERROR, { 'result': add_result });
        console.log("Service >>>> addBooks resp " + response.getOutput());
        return response;
    }
    static async deleteBooks(params) {
        const del_result = await db_books.deleteBooks(params);
        var response = new MyResponse(Errors.ERROR_NO_ERROR, { 'result': del_result });
        console.log("Service >>>> deleteBooks resp " + response.getOutput());
        return response;
    }

    //-------------------------------------------------------------------


    //-----------------------------Words API-----------------------------
    static async getRandomWords({ words_coolection_name, count = 1 }) {
        const words = await db_words.getRandomWords(words_coolection_name, count);
        words.forEach((word) => {
            word['db_name'] = words_coolection_name
        })
        var response = new MyResponse(Errors.ERROR_NO_ERROR, { 'words': words });
        console.log("Service >>>> getRandomWords resp " + response.getOutput());
        return response;
    }

    static async getWordCount(words_coolection_name) {
        const count = await db_words.getKetWordsCount(words_coolection_name)
        var response = new MyResponse(Errors.ERROR_NO_ERROR, { 'count': count });
        console.log("Service >>>> getWordCount resp " + response.getOutput());
        return count;
    }

    /**
     * 
     * @param {*} user_id 
     * @param {*} word_id 
     * @param {*} word_score  0 : 完全忘记   50 ： 模模糊糊   80 : So Easy
     */
    static async upsertUnknownWord({ user_id, word_id, word_name, score, word_db }) {
        const rs = await db_user.upsertUserWord(user_id, word_id, word_name, score, word_db);
        var response = new MyResponse(Errors.ERROR_NO_ERROR, { 'result': rs });
        console.log("Service >>>> upsertUnknownWord resp " + response.getOutput());
        return response;
    }

    /**
     * 
     * @param {*} user_id 
     * @param {*} max_score  指定分数以下的生词
     * @returns count
     */
    static async getUserWordCount({ user_id, max_score = 80 }) {
        console.log("getUserWordCount user_id =" + user_id + ", max_score = " + max_score);
        const rs = await db_user.getUserWordCount(user_id, max_score);
        var response = new MyResponse(Errors.ERROR_NO_ERROR, { 'count': rs });
        console.log("Service >>>> getUserWordCount resp " + response.getOutput());
        return response;
    }


    /**
     * 
     * @param {*} user_id 
     * @param {*} max_score  指定分数以下的生词
     * @returns  return user unknown word list
     */
    static async getUserWords({ user_id, max_score = 80 }) {
        console.log("getUserWords user_id =" + user_id + ", max_score = " + max_score);
        const rs = await db_user.getUserWords(user_id, max_score);

        var collectionIdMaps = {};
        rs.forEach((element) => {
            var word_db_name = element.word_db;
            if (word_db_name in collectionIdMaps) {
                collectionIdMaps[word_db_name].push(new ObjectId(element._id.word_id));
            } else {
                collectionIdMaps[word_db_name] = [];
                collectionIdMaps[word_db_name].push(new ObjectId(element._id.word_id))
            }
        })

        let words = [];
        for (let key in collectionIdMaps) {
            let _ids = collectionIdMaps[key]
            let _words = await db_words.getWordByIDs(key, _ids);
            words.push(..._words);
        }

        let response = new MyResponse(Errors.ERROR_NO_ERROR, { 'words': words });
        console.log("Service >>>> getUserWords resp " + response.getOutput());
        return response;
    }

    //-------------------------------------------------------------------


    //-----------------------------Sentence API-----------------------------


    static async addOneSentence({ en, ch, day, from }) {
        console.log("addOneSentence en =" + en + ", ch = " + ch + ", day = " + day);
        let param = {
            "_id": day,
            'en': en,
            "ch": ch,
            'from': from
        }
        const rs = await db_sentense.add(param);
        var response = new MyResponse(Errors.ERROR_NO_ERROR, { 'rs': rs });
        console.log("Service >>>> addOneSentence resp " + response.getOutput());
        return response;
    }

    static async getSentenceToday() {
        let day = moment().format('YYYY-MM-DD');
        console.log("getSentenceToday day =" + day);
        const rs = await db_sentense.get(day);
        var response = new MyResponse(Errors.ERROR_NO_ERROR, { 'rs': rs });
        console.log("Service >>>> getSentenceToday resp " + response.getOutput());
        return response;
    }

    //-------------------------------------------------------------------
}
