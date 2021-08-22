const express = require('express');
const router = express.Router();
const Answer_comment = require('../models/answer_comment');
const jwt = require('jsonwebtoken');

router.get('/:answer_id', async (req, res) => {
	try {
		const {answer_id} = req.params;
		let comments = await Answer_comment.find({"answer_id" : answer_id});
		res.status(200).json({message : "success", comments});
	}
	catch (err) {
		console.log(err);
		return res.status(500).json({message : "error", body : "Our servers encountered some error. Please try after some time"});
	}
})

router.post('/', async (req, res) => {
	let user_id;
	try {
		const token = req.cookies.token;
		if(!token) {
			return res.status(200).json({message : "error", body : "Token not provided"});
		}
		const check_token = jwt.verify(token, process.env.SECRET_KEY);
		if(check_token){
			user_id = check_token.user_id;
		}
		else {
			return res.status(200).json({message : "error", body : "Invalid Token"});
		}
	} catch (err) {
		console.log(err);
		return res.status(401).json({message : "error", body : "Invalid Token"});
	}
	try {
		let {body, answer_id} = req.body;
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