import { Errors } from '../service/Errors.js'
import { MyResponse } from '../service/Respons.js'
import { Service } from '../service/service.js'
import { validationResult } from 'express-validator'

export function getRandomWords(req, res) {

    const result = validationResult(req);
    res.writeHead(200, { 'Content-Type': 'application/json' });

    if (result.isEmpty()) {
        // const data = matchedData(req)
        const data = req.body;
        Service.getRandomWords({ words_coolection_name: data.word_db_nm, count: data.count }).then((result) => {
            res.end(JSON.stringify(result));
        });
    } else {
        res.end(JSON.stringify(MyResponse.buildNullDataErrorObj(Errors.parseValidationErrors(result.array()))));
    }
    return;
}

export function getUserWords(req, res) {
    const result = validationResult(req);
    res.writeHead(200, { 'Content-Type': 'application/json' });

    if (result.isEmpty()) {
        const data = matchedData(req)
        // const data = req.body;
        var param = { user_id: data.user_id }
        if (data.max_score > 0) {
            param.max_score = data.max_score
        }
        Service.getUserWords(param).then((result) => {
            res.end(JSON.stringify(result));
        });
    } else {
        res.end(JSON.stringify(MyResponse.buildNullDataErrorObj(Errors.parseValidationErrors(result.array()))));
    }
    return;
}

export function getUserWordCount(req, res) {
    const result = validationResult(req);
    res.writeHead(200, { 'Content-Type': 'application/json' });

    if (result.isEmpty()) {
        const data = matchedData(req)
        // const data = req.body;
        var param = { user_id: data.user_id }
        if (data.max_score > 0) {
            param.max_score = data.max_score
        }
        Service.getUserWordCount(param).then((result) => {
            res.end(JSON.stringify(result));
        });
    } else {
        res.end(JSON.stringify(MyResponse.buildNullDataErrorObj(Errors.parseValidationErrors(result.array()))));
    }
    return;
}

export function upsertUserWord(req, res) {
    const result = validationResult(req);
    res.writeHead(200, { 'Content-Type': 'application/json' });

    if (result.isEmpty()) {
        const data = matchedData(req)
        // const data = req.body;
        let params = {
            user_id: data.user_id,
            word_id: data.word_id,
            score: data.score,
            word_db: data.word_db,
            word_name: data.word_name
        };
        Service.upsertUnknownWord(params).then((result) => {
            res.end(JSON.stringify(result));
        });
    } else {
        res.end(JSON.stringify(MyResponse.buildNullDataErrorObj(Errors.parseValidationErrors(result.array()))));
    }
    return;
}