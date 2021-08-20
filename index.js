const express = require('express');
const user = require('./routes/user');
const question = require('./routes/question');
const answer = require('./routes/answer');
const question_comment = require('./routes/question_comment');
const answer_comment = require('./routes/answer_comment');
const app = express();
require('./database/db');

let port = 8888;

app.use(express.json());

app.use('/user', user);
app.use('/question', question);
app.use('/answer', answer);
app.use('/question_comment', question_comment);
app.use('/answer_comment', answer_comment);

app.listen(port, () => {
	console.log(`server is running at port ${port}`);
});