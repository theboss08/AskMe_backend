const express = require('express');
const router = express.Router();
const Question = require('../models/question');
const User = require('../models/user');
const jwt = require('jsonwebtoken');

router.get('/', async (req, res) => {
	try {
		let questions = await Question.find().limit(10).sort({"views" : -1, "_id" : 1});
		for(let i = 0;i<questions.length;i++){
			let {user_id} = questions[i];
			let user = await User.findOne({"_id" : user_id});
			questions[i] = {...questions[i]["_doc"], asked_by : user.name};
		}
		res.status(200).json({message : "success", questions});
	}
	catch (err) {
		console.log(err);
		res.status(500).json({message : "error", body : "Our servers encountered some error. Please try after some time"});
	}
})

router.get('/all_questions', async (req, res) => {
	try {
		let questions = await Question.find().sort({"views" : -1, "_id" : 1});
		for(let i = 0;i<questions.length;i++){
			let {user_id} = questions[i];
			let user = await User.findOne({"_id" : user_id});
			questions[i] = {...questions[i]["_doc"], asked_by : user.name};
		}
		res.status(200).json({message : "success", questions});
	}
	catch (err) {
		console.log(err);
		res.status(500).json({message : "error", body : "Our servers encountered some error. Please try after some time"});
	}
})

router.get('/:id', async (req, res) => {
	try{
		let {id} = req.params;
		let question = await Question.findOne({"_id" : id});
		if(question){
			let user = await User.findOne({"_id" : question.user_id});
			question = {...question["_doc"], asked_by : user.name};
			res.status(200).json({message : "success", question});
		}
		else {
			return res.status(404).json({message : "error", body : "Sorry but the question you are looking for was not found."});
		}
	}
	catch(err) {
		console.log(err);
		res.status(500).json({message : "error", body : "Our servers encountered some error. Please try after some time"});
	}
})

router.post('/', async (req, res) => {

	// checking if user is authenticated and if true fetching it's user id
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


	// inserting in database
	const {body} = req.body;
	if(!body || !user_id){
		return res.status(402).json({message : "error", body : "Please input all fields"});
	}
	try{
		const question = new Question({body, user_id});
		let postQuestion = await question.save();
		if(postQuestion){
			res.status(200).json({message : "success", body : "Question posted successfully"});
		}
		else {
			return res.status(500).json({message : "error", body : "Sorry but the question was not posted. Please try again."});
		}
	}
	catch (err) {
		console.log(err);
		return res.status(500).json({message : "error", body : "Our servers encountered some error. Please try after some time"});
	}
})

router.put('/:id', async (req, res) => {
	let {body} = req.body;
	let {id} = req.params;
	try {
		let updateQuestion = await Question.updateOne({"_id" : id}, {body});
		if(updateQuestion){
			res.status(200).json({message : "success", body : "Question updated successfully"});
		}
		else {
			res.status(404).json({message : "error", body : "Question not found"});
		}
	}
	catch (err) {
		console.log(err);
		return res.status(500).json({message : "error", body : "Our servers encountered some error. Please try after some time"});
	}
})

router.delete('/:id', async(req, res) => {
	try {
		let {id} = req.params;
		//valid user to be checked
		let del = await Question.deleteOne({"_id" : id});
		if(del) {
			res.status(200).json({message : "success", body : "Question deleted successfully"});
		}
		else {
			re.status(404).json({message : "error", body : "Question not found"});
		}
	}
	catch (err) {
		console.log(err);
		return res.status(500).json({message : "error", body : "Our servers encountered some error. Please try after some time"});
	}
})

router.post('/questions', async (req, res) => {
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
			res.status(200).json({message : "error", body : "Invalid Token"});
		}
		let questions = await Question.find({"user_id" : user_id});
		res.status(200).json({message : "success", questions});
	} catch (err) {
		console.log(err);
		res.status(401).json({message : "error", body : "Invalid Token"});
	}
})

router.put('/views/:question_id', async (req, res) => {
	try{
		let {question_id} = req.params;
		let update = await Question.updateOne({"_id" : question_id}, {$inc : {views : 1}});
		if(update){
			res.status(200).json({message : "success"});
		}
		else res.status(500).json({message : "error"});
	} catch (err) {
		console.log(err);
		return res.status(500).json({message : "error", body : "Our servers encountered some error. Please try after some time"});
	}
})

module.exports = router;