const express = require('express');
const user = require('./routes/user');
const question = require('./routes/question');
const answer = require('./routes/answer');
const app = express();
require('./database/db');

let port = 8888;

app.use(express.json());

app.use('/user', user);
app.use('/question', question);
app.use('/answer', answer);

app.listen(port, () => {
	console.log(`server is running at port ${port}`);
});