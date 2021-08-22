const express = require('express');
const cookieParser = require('cookie-parser')
const user = require('./routes/user');
const question = require('./routes/question');
const answer = require('./routes/answer');
const question_comment = require('./routes/question_comment');
const answer_comment = require('./routes/answer_comment');
const follow = require('./routes/follow');
require('dotenv').config();
const app = express();
require('./database/db');

let port = process.env.PORT;

app.use(express.json());
app.use(cookieParser());

app.use('/user', user);
app.use('/question', question);
app.use('/answer', answer);
app.use('/question_comment', question_comment);
app.use('/answer_comment', answer_comment);
app.use('/connection', follow);

app.listen(port, () => {
	console.log(`server is running at port ${port}`);
});