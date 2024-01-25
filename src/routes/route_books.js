
import { Errors } from '../service/Errors.js'
import { MyResponse } from '../service/Respons.js'
import { Service } from '../service/service.js'
import { validationResult } from 'express-validator'

export function getBookGroups(req, res) {
    console.log("book_groups", "req = ", req.body)
    const result = validationResult(req);
    res.writeHead(200, { 'Content-Type': 'application/json' });
    if (result.isEmpty()) {
        // const data = matchedData(req)
        Service.getBookGroups({ user_id: req.body.user_id }).then((result) => {
            res.end(JSON.stringify(result));
        });

    } else {
        res.end(JSON.stringify(MyResponse.buildNullDataErrorObj(Errors.parseValidationErrors(result.array()))));
    }
    return;
}

export function getBookInfosByGroup(req, res) {
    console.log("book_infos", "req = ", req.body)
    const result = validationResult(req);
    res.writeHead(200, { 'Content-Type': 'application/json' });
    if (result.isEmpty()) {
        // const data = matchedData(req)
        const data = req.body;
        Service.getBookInfosByGroup({ user_id: data.user_id, group_id: data.group_id }).then((result) => {
            res.end(JSON.stringify(result));
        });

    } else {
        res.end(JSON.stringify(MyResponse.buildNullDataErrorObj(Errors.parseValidationErrors(result.array()))));
    }
    return;
}

export function addBooksBackDoor(req, res) {
    console.log("add_books", "req = ", req.body)
    res.writeHead(200, { 'Content-Type': 'application/json' });
    const data = req.body;
    Service.addBooks({ books: data.books }).then((result) => {
        res.end(JSON.stringify(result));
    });
    return;
}

export function deleteBooksBackDoor(req, res) {
    console.log("delete_books", "req = ", req.body)
    res.writeHead(200, { 'Content-Type': 'application/json' });
    const data = req.body;
    Service.deleteBooks(data.params).then((result) => {
        res.end(JSON.stringify(result));
    });
    return;
}