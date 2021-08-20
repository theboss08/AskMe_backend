const express = require('express');
const router = express.Router();
const Question_comment = require('../models/question_comment');

router.get('/:question_id', async (req, res) => {
	try {
		let comments = await Question_comment.find({"question_id" : question_id});
		res.status(200).json({message : "success", comments});
	}
	catch (err) {
		console.log(err);
		return res.status(500).json({message : "error", body : "Our servers encountered some error. Please try after some time"});
	}
})

router.post('/', async (req, res) => {
	let {body, question_id, user_id} = req.body;
	if(!body || !question_id) {
		return res.status(402).json({message : "error", body : "Please enter all  the fields"});
	}
	try {
		let comment = new Question_comment({body, question_id, user_id});
		let insert = await comment.save();
		if(insert){
			res.status(200).json({message : "success", body : "Comment inserted successfully"});
		}
	}
	catch (err) {
		console.log(err);
		return res.status(500).json({message : "error", body : "Our servers encountered some error. Please try after some time"});
	}
})

module.exports = router;