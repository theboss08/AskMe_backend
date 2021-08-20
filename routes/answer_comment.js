const express = require('express');
const router = express.Router();
const Answer_comment = require('../models/answer_comment');

router.get('/:answer_id', async (req, res) => {
	try {
		let comments = Answer_comment.find({"answer_id" : answer_id});
		res.status(200).json({message : "success", comments});
	}
	catch (err) {
		console.log(err);
		return res.status(500).json({message : "error", body : "Our servers encountered some error. Please try after some time"});
	}
})

router.post('/', async (req, res) => {
	try {
		let {body, answer_id, user_id} = req.body;
		let comment = new Answer_comment({body, answer_id, user_id});
		let insert = await comment.save();
		if(insert){
			res.status(200).json({message : "success", body : "Comment posted successfully"});
		}
	}
	catch (err) {
		console.log(err);
		return res.status(500).json({message : "error", body : "Our servers encountered some error. Please try after some time"});
	}
})

module.exports = router;