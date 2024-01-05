
import { response } from "express";
import db_books from "../db/db_books.js"
import db_words from '../db/db_words.js'
import db_user from '../db/db_user.js'
import { Errors } from "./Errors.js";
import { MyResponse } from "./Respons.js";
// const db_ket_words = require("./db/db_ket_words")


export class Service {

    //--------------------User API-----------------------------
    static async _checkUserExisted({ identifier }) {
        const users = await db_user.checkUserExist(identifier);
        return users;
    }


    static async _addUser({ identity_type, credential, identifier }) {

        const result = await db_user.addUser(identity_type, credential, identifier);
        return result;
    }

    /**
     * 
     * @param identity_type 登录类型 1:Phone + Password 2:Phone+Code 3:Weixin
     * @param credential //密码凭证 password or token
     * @param identifier // 标识 (手机号/第三方应用的唯一标识)
     * @returns 
     */
    static async register({ identity_type, credential, identifier }) {
        const users = await db_user.checkUserExist(identifier);
        var response;
        if (users) {
            response = new MyResponse(Errors.ERROR_UER_EXIST, { 'identifier': identifier });
        } else {
            const result = await db_user.addUser(identity_type, credential, identifier);
            if (result && result.acknowledged) {
                response = new MyResponse(Errors.customErrorObj(Errors.ERROR_NO_ERROR, "add user success"), null);
            } else {
                response = new MyResponse(Errors.ERROR_UER_ADD_FAILED, null);
            }
        }
        console.log("Service >>>> register resp " + response.getOutput());
        return response;

    }

    static async login({ identifier }) {
        console.log("Service >>>> login req ", identifier)
        const users = await db_user.checkUserExist(identifier);
        var response;
        if (users) {
            response = new MyResponse(Errors.customErrorObj(Errors.ERROR_NO_ERROR, "Login Success"), { 'user': users });
        } else {
            response = new MyResponse(Errors.ERROR_LOGIN_FAILED, { 'identifier': identifier });
        }
        console.log("Service >>>> login resp " + response.getOutput());
        return response;
    }



    //------------------------------------------------------------


    //--------------------Books API-----------------------------
    static async getBookGroups({ user_id }) {
        const book_groups = await db_books.getBookGroups({ 'user_id': user_id });
        var response = new MyResponse(Errors.ERROR_NO_ERROR, { 'book_groups': book_groups });
        console.log("Service >>>> getBookGroups resp " + response.getOutput());
        return response;
    }

    static async getBookInfos({ user_id, group_id }) {
        const book_infos = await db_books.getBookInfos({ 'group_id': group_id });
        var response = new MyResponse(Errors.ERROR_NO_ERROR, { 'book_infos': book_infos });
        console.log("Service >>>> getBookInfos resp " + response.getOutput());
        return response;
    }

    static async addBooks({ books }) {
        const add_result = await db_books.addBooks(books);
        var response = new MyResponse(Errors.ERROR_NO_ERROR, { 'add_result': add_result });
        console.log("Service >>>> addBooks resp " + response.getOutput());
        return response;
    }
    static async deleteBooks(params) {
        const del_result = await db_books.deleteBooks(params);
        var response = new MyResponse(Errors.ERROR_NO_ERROR, { 'del_result': del_result });
        console.log("Service >>>> deleteBooks resp " + response.getOutput());
        return response;
    }

    //------------------------------------------------------------


    //--------------------Words API-----------------------------
    static async getRandomWords({ words_coolection_name, count = 1 }) {
        const word = await db_words.getRandomWords(words_coolection_name, count)
        var response = new MyResponse(Errors.ERROR_NO_ERROR, { 'words': word });
        console.log("Service >>>> getRandomWords resp " + response.getOutput());
        return response;
    }

    static async getWordCount(words_coolection_name) {
        const count = await db_words.getKetWordsCount(words_coolection_name)
        return count
    }
    //------------------------------------------------------------
}
