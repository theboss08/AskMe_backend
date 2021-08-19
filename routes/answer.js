const express = require('express');
const router = express.Router();
const Answer = require('../models/answer');

// route for creating new answers
router.post('/', async (req, res) => {

	//for now using request body for getting user id
	//later we are going to use cookies and verify with jsonwebtoken
	let {body, question_id, user_id} = req.body;
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
	let {question_id} = req.params;
	try {
		let answers = await Answer.find({"question_id" : question_id});
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

module.exports = router;