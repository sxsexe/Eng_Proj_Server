import { Service } from '../service/service.js'
import { Errors } from '../service/Errors.js'
import { MyResponse } from '../service/Respons.js'
import { validationResult, matchedData } from 'express-validator'
import { JobOneSentence } from '../service/job_one_sentence.js'

export function register(req, res) {
    const result = validationResult(req);
    res.writeHead(200, { 'Content-Type': 'application/json' });
    if (result.isEmpty()) {
        const data = matchedData(req)
        Service.register({ identity_type: data.identity_type, credential: data.credential, identifier: data.identifier }).then((result) => {
            res.end(JSON.stringify(result));
        });
    } else {
        res.end(JSON.stringify(MyResponse.buildNullDataErrorObj(Errors.parseValidationErrors(result.array()))));
    }
    return;
}


export function login(req, res) {
    console.log("login", "req ", req.body)
    const result = validationResult(req);
    res.writeHead(200, { 'Content-Type': 'application/json' });
    if (result.isEmpty()) {
        const data = matchedData(req)
        Service.login({ identifier: data.identifier, credential: data.credential }).then((result) => {
            res.end(JSON.stringify(result));
        });

    } else {
        res.end(JSON.stringify(MyResponse.buildNullDataErrorObj(Errors.parseValidationErrors(result.array()))));
    }
    return;
}

export function getSentenceToday(req, res) {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    Service.getSentenceToday().then((value) => {
        res.end(JSON.stringify(value));
    });

    return;
}

export function createSecntenceToday(req, res) {
    JobOneSentence.addNewSentece();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ "rs": 1 }));
    return;
}

export function getUserBooks(req, res) {
    console.log("get_user_books", "req = ", req.body)
    const result = validationResult(req);
    res.writeHead(200, { 'Content-Type': 'application/json' });
    if (result.isEmpty()) {
        // const data = matchedData(req)
        const data = req.body;
        Service.getUserBooks({ user_id: data.user_id, learn_state: data.learn_state }).then((result) => {
            res.end(JSON.stringify(result));
        });

    } else {
        res.end(JSON.stringify(MyResponse.buildNullDataErrorObj(Errors.parseValidationErrors(result.array()))));
    }
    return;
}

export function upsertUserBooksStatus(req, res) {
    console.log("upsertUserBooksStatus", "req = ", req.body)
    const result = validationResult(req);
    res.writeHead(200, { 'Content-Type': 'application/json' });
    if (result.isEmpty()) {
        // const data = matchedData(req)
        const data = req.body;
        var params = {
            user_id: data.user_id,
            book_id: data.book_id,
            learn_state: data.learn_state,
            book_type: data.book_type,
            create_time: data.create_time,
            last_time: data.last_time
        };
        Service.upsertUserBooksStatus(params).then((result) => {
            res.end(JSON.stringify(result));
        });

    } else {
        res.end(JSON.stringify(MyResponse.buildNullDataErrorObj(Errors.parseValidationErrors(result.array()))));
    }
    return;
}