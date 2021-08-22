const express = require('express');
const router = express.Router();
const Follow = require('../models/follow');
const User = require('../models/user');
const jwt = require('jsonwebtoken');

router.post('/check', async (req, res) => {
	try {
		let {follows} = req.body;
		let followed_by;
		const token = req.cookies.token;
		if(!token) {
			return res.status(200).json({message : "error", body : "Token not provided"});
		}
		const check_token = jwt.verify(token, process.env.SECRET_KEY);
		if(check_token){
			followed_by = check_token.user_id;
		}
		else {
			res.status(200).json({message : "error", body : "Invalid Token"});
		}

		let check = await Follow.findOne({"follows" : follows, "followed_by" : followed_by}).countDocuments();


		if(check === 1){
			res.status(200).json({message : "success", body : "true"});
		}
		else {
			res.status(200).json({message : "success", body : "false"});
		}

	} catch (err) {
		console.log(err);
		res.status(500).json({message : 'error', body : 'Our servers encountered some error. Please try after some time'});
	}
})

router.post('/follow', async (req, res) => {

	let followed_by;
	try {
		const token = req.cookies.token;
		if(!token) {
			return res.status(200).json({message : "error", body : "Token not provided"});
		}
		const check_token = jwt.verify(token, process.env.SECRET_KEY);
		if(check_token){
			followed_by = check_token.user_id;
		}
		else {
			res.status(200).json({message : "error", body : "Invalid Token"});
		}
	} catch (err) {
		console.log(err);
		res.status(401).json({message : "error", body : "Invalid Token"});
	}

	try {
		const {follows} = req.body;
		const insert = await Follow.updateOne({"follows" : follows, "followed_by" : followed_by}, {"follows" : follows, "followed_by" : followed_by}, {upsert : true});
		if(insert) {
			let update = await User.updateOne({"_id" : follows}, {$inc : {followers : 1}});
			if(update) res.status(200).json({message : "success", body : "Your are now following him"});
		}
		else {
			res.status(500).json({message : "error", body : "Our servers encountered some error. Please try after some time"});
		}
	}
	catch (err) {
		console.log(err);
		res.status(500).json({message : 'error', body : 'Our servers encountered some error. Please try after some time'});
	}
})

router.post('/unfollow', async (req, res) => {
	let followed_by;
	let {follows} = req.body;
	try {
		const token = req.cookies.token;
		if(!token) {
			return res.status(200).json({message : "error", body : "Token not provided"});
		}
		const check_token = jwt.verify(token, process.env.SECRET_KEY);
		if(check_token){
			followed_by = check_token.user_id;
		}
		else {
			res.status(200).json({message : "error", body : "Invalid Token"});
		}
	} catch (err) {
		console.log(err);
		res.status(401).json({message : "error", body : "Invalid Token"});
	}

	try {
		const del = await Follow.deleteMany({"follows" : follows, "followed_by" : followed_by});
		if(del) {
			let update = await User.updateOne({"_id" : follows}, {$inc : {followers : -1}});
			res.status(200).json({message : "success", body : "Unfollowed Successfully"});
		}
	} catch (err) {
		console.log(err);
		res.status(500).json({message : 'error', body : 'Our servers encountered some error. Please try after some time'});
	}
})

module.exports = router;