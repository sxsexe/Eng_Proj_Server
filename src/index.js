import { Service } from './service/service.js'
import express from 'express'

import { matchedData, query, validationResult, body } from 'express-validator'
import { Errors } from './service/Errors.js'

const port = "8889"
const app = express()

app.use(express.json())



//---------------------------UESR BEGIN-----------------------------

app.post("/register",
    // validate
    body('identifier').trim().notEmpty().escape(),
    body('credential').trim().notEmpty().escape().isLength({ min: 6 }),
    body('identity_type').trim().notEmpty().isNumeric(),
    /*
        req.body = {
            'identifier': '13717542213',
            'credential': 'password',
            'type' : 1
        }
    */
    (req, res) => {
        const result = validationResult(req);
        if (result.isEmpty()) {
            const data = matchedData(req)
            Service.register({ identity_type: data.identity_type, credential: data.credential, identifier: data.identifier }).then((result) => {
                res.end(JSON.stringify(result));
            });
        } else {
            res.end(JSON.stringify(Errors.parseValidationErrors(result.array())));
        }
        return;
    })

app.post("/login",

    // validate
    body('identifier').trim().notEmpty().escape(),

    (req, res) => {
        console.log("login", "req ", req.body)
        const result = validationResult(req);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        if (result.isEmpty()) {
            const data = matchedData(req)
            Service.login({ identifier: data.identifier }).then((result) => {
                res.end(JSON.stringify(result));
            });

        } else {
            res.end(JSON.stringify(Errors.parseValidationErrors(result.array())));
        }
        return;

    })


//------------------------------UESR END------------------------------

app.post("/book_groups",

    // validate
    // body('identifier').trim().notEmpty().escape(),

    (req, res) => {

        console.log("book_groups", "req = ", req.body)
        const result = validationResult(req);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        if (result.isEmpty()) {
            const data = matchedData(req)
            Service.getBookGroups({ user_id: req.body.user_id }).then((result) => {
                res.end(JSON.stringify(result));
            });

        } else {
            res.end(JSON.stringify(Errors.parseValidationErrors(result.array())));
        }
        return;
    })

app.post("/book_infos",

    // validate
    // body('identifier').trim().notEmpty().escape(),

    (req, res) => {
        console.log("book_infos", "req = ", req.body)
        const result = validationResult(req);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        if (result.isEmpty()) {
            // const data = matchedData(req)
            const data = req.body;
            Service.getBookInfos({ user_id: data.user_id, group_id: data.group_id }).then((result) => {
                res.end(JSON.stringify(result));
            });

        } else {
            res.end(JSON.stringify(Errors.parseValidationErrors(result.array())));
        }
        return;
    })


app.post("/add_books",

    (req, res) => {
        console.log("add_books", "req = ", req.body)
        res.writeHead(200, { 'Content-Type': 'application/json' });
        const data = req.body;
        Service.addBooks({ books: data.books }).then((result) => {
            res.end(JSON.stringify(result));
        });
        return;
    }
)

app.post("/del_books",

    (req, res) => {
        console.log("delete_books", "req = ", req.body)
        res.writeHead(200, { 'Content-Type': 'application/json' });
        const data = req.body;
        Service.deleteBooks(data.params).then((result) => {
            res.end(JSON.stringify(result));
        });
        return;
    }
)



//------------------------------BOOKS END------------------------------



app.post("/random_words",

    body('word_db_nm').trim().notEmpty().escape(),
    body('count').isInt().default(1),

    (req, res) => {

        const result = validationResult(req);
        res.writeHead(200, { 'Content-Type': 'application/json' });

        if (result.isEmpty()) {
            const data = matchedData(req)
            // const data = req.body;
            Service.getRandomWords({ words_coolection_name: data.word_db_nm, count: data.count }).then((result) => {
                res.end(JSON.stringify(result));
            });
        } else {
            res.end(JSON.stringify(Errors.parseValidationErrors(result.array())));
        }
        return;
    })

// app.get("/get_word_count", (req, res) => {

//     console.log('req', req.query)
//     Service.getWordCount().then((result) => {
//         res.writeHead(200, { 'Content-Type': 'text/html' });
//         res.end(result.toString());
//         return;
//     })
// })


app.listen(port, () => console.log("server is listening " + port))