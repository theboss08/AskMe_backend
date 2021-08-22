const express = require('express');
const router = express.Router();
const Answer = require('../models/answer');
const User = require('../models/user');
const Answer_comment = require('../models/answer_comment');
const jwt = require('jsonwebtoken');

// route for creating new answers
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


	let {body, question_id} = req.body;
	if(!body || !question_id || !user_id){
		return res.status(402).json({message : "error", body : "Please fill all the fields"});
	}
	try {
		let answer = new Answer({body, question_id, user_id});
		let insert = await answer.save();
		if(insert) {
			res.status(200).json({message : "success", body : "Answer posted successfully"});
		}
		else {
			res.status(500).json({message : "error", body : "Sorry, Please try again."});
		}
	}
	catch (err) {
		console.log(err);
		return res.status(500).json({message : "error", body : "Our servers encountered some error. Please try after some time"});
	}
})

//getting all the answers for a question id
router.get('/:question_id', async (req, res) => {

	let user_id;
	try {
		const token = req.cookies.token;
		if(!token) {
			user_id = '';
		}
		else {
			const check_token = jwt.verify(token, process.env.SECRET_KEY);
			if(check_token){
				user_id = check_token.user_id;
			}
			else {
				return res.status(200).json({message : "error", body : "Invalid Token"});
			}
		}
	} catch (err) {
		console.log(err);
		return res.status(401).json({message : "error", body : "Invalid Token"});
	}

	let {question_id} = req.params;
	try {
		let answers = await Answer.find({"question_id" : question_id}).sort({votes : -1, _id : 1});
		for(let i = 0;i<answers.length;i++){
			let user = await User.findOne({"_id" : answers[i].user_id});
			answers[i] = {...answers[i]["_doc"], answered_by : user.name};
			let search = answers[i].voted_by.indexOf(user_id);
			if(search !== -1) answers[i] = {...answers[i], liked : true};
			else answers[i] = {...answers[i], liked : false};
			delete answers[i].voted_by
		}
		res.status(200).json({message : "success", body : "All answers fetched", answers});
	}
	catch (err) {
		console.log(err);
		return res.status(500).json({message : "error", body : "Our servers encountered some error. Please try after some time"});
	}
})

router.put('/:answer_id', async (req, res) => {

	// check if answer is answered by the same user
	let {answer_id} = req.params;
	let {body} = req.body;
	try {
		let update = await Answer.updateOne({"_id" : answer_id}, {body});
		if(update) {
			res.status(200).json({message : "success", body : "Answer updated successfully"});
		}
		else {
			return res.status(404).json({message : "error", body : "Answer not found"});
		}
	}
	catch (err) {
		console.log(err);
		return res.status(500).json({message : "error", body : "Our servers encountered some error. Please try after some time"});
	}
})

router.delete('/:answer_id', async (req, res) => {
	//check if the user id of the answer is same as the user id who is making the request

	try {
		let {answer_id} = req.params;
		let del = await Answer.deleteOne({"_id" : answer_id});
		if(del) {
			res.status(200).json({message : "success", body : "Answer deleted successfully"});
		}
		else {
			res.status(500).json({message : "error", body : "Please try again"});
		}
	}
	catch (err) {
		console.log(err);
		return res.status(500).json({message : "error", body : "Our servers encountered some error. Please try after some time"});
	}
})

router.post('/upvote/:answer_id', async (req, res) => {
	let user_id;
	const {answer_id} = req.params;
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

		console.log(answer_id);

		let update = await Answer.updateOne({"_id" : answer_id}, {$inc : {votes : 1}, $push : {voted_by : user_id}});

		if(update) {
			res.status(200).json({message : "success", body : "Upvoted"});
		}

	} catch (err) {
		console.log(err);
		return res.status(401).json({message : "error", body : "Invalid Token"});
	}
})

router.post('/downvote/:answer_id', async (req, res) => {
	let user_id;
	const {answer_id} = req.params;
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

		let update = await Answer.updateOne({"_id" : answer_id}, {$inc : {votes : -1}, $pull : {voted_by : user_id}});

		if(update) {
			res.status(200).json({message : "success", body : "Upvoted"});
		}

	} catch (err) {
		console.log(err);
		return res.status(401).json({message : "error", body : "Invalid Token"});
	}
})

module.exports = router;