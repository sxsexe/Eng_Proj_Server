import express from 'express'
import { body } from 'express-validator'
import { CronJob } from 'cron';
import { JobOneSentence } from './service/job_one_sentence.js'
import { createSecntenceToday, getSentenceToday, getUserBooks, login, register } from './routes/route_user.js'
import { addBooksBackDoor, deleteBooksBackDoor, getBookInfosByGroup } from './routes/route_books.js'
import { getRandomWords, getUserWordCount, getUserWords, upsertUserWord } from './routes/route_words.js'

const job = new CronJob(
    '0 19 05 * * *', // cronTime  
    function () {
        JobOneSentence.addNewSentece();
    }, // onTick
    null, // onComplete
    true, // start
);

const port = "80"
const app = express()
app.use(express.json())
app.listen(port, () => console.log("server is listening " + port))

//------------------------------TEST BEGIN-----------------------------

app.get("/test_job_one_sentence_a_day", (req, res) => createSecntenceToday(req, res))
app.get("/test_get_sentence_a_day", (req, res) => getSentenceToday(req, res))

//------------------------------TEST END------------------------------


//---------------------------UESR BEGIN-----------------------------

app.post("/register",
    // validate
    body('identifier').trim().notEmpty().escape().isLength({ min: 6, max: 16 }),
    body('credential').trim().notEmpty().escape().isLength({ min: 6, max: 16 }),
    body('identity_type').trim().notEmpty().isNumeric(),
    (req, res) => register(req, res))

app.post("/login",
    // validate
    body('identifier').trim().notEmpty().escape(),
    body('credential').trim().notEmpty().escape(),
    (req, res) => login(req, res))

app.post("/upsert_user_word",
    body('user_id').trim().notEmpty().escape(),
    body('word_id').trim().notEmpty().escape(),
    body('word_db').trim().notEmpty().escape(),
    body('word_name').trim().notEmpty().escape(),
    body('score').isInt(),
    (req, res) => upsertUserWord(req, res))

app.post("/count_user_word",
    body('user_id').trim().notEmpty().escape(),
    body('max_score').isNumeric(),
    (req, res) => getUserWordCount(req, res))

app.post("/get_user_words",
    body('user_id').trim().notEmpty().escape(),
    body('max_score').isNumeric(),
    (req, res) => getUserWords(req, res))


//------------------------------UESR END------------------------------

app.post("/book_groups", (req, res) => getBookGroups(req, res))
app.post("/book_infos", (req, res) => getBookInfosByGroup(req, res))
app.post("/get_user_books",
    // validate
    body('user_id').trim().notEmpty().escape(),
    body('is_done').isNumeric(),
    (req, res) => getUserBooks(req, res))

app.post("/add_books", (req, res) => addBooksBackDoor(req, res))
app.post("/del_books", (req, res) => deleteBooksBackDoor(req, res))

//------------------------------BOOKS END------------------------------



app.post("/random_words",
    body('word_db_nm').trim().notEmpty().escape(),
    body('count').isInt().default(1),
    (req, res) => getRandomWords(req, res))

