const express = require('express');
const router = express.Router();
const User = require('../models/user');


// route for getting the user details.
router.get('/:id', async (req, res) => {
	let { id } = req.params;
	let user = await User.findOne({"_id" : id});
	if(user){
		res.status(200).json({message : "success", user});
	}
	else {
		res.status(404).json({message : "error", body : "The user was not found"});
	}
});


// route for user registration
router.post('/register', async (req, res) => {
	const {name, email, password, about, qualification, followers} = req.body;

	//checking if required fields
	if(!name || !email || !password) {
		return res.status(422).json({
			message : "error",
			body : "Please provide all the necessary details",
		});
	}

	try{
		let userExist = await User.findOne({email : email});

		if(userExist){
			return res.status(422).json({message : "error", body : "Email already exist"});
		}

		const user = new User({name, email, password, about, qualification, followers});

		let userRegister = await user.save();

		if(userRegister){
			res.status(200).json({message : "success", body : "User registered successfully"});
		}

	}
	catch(err) {
		res.status(500).json({message : 'error', body : 'Our servers encountered some error. Please try after some time'})
		console.log(err);
	}

});

//route for user login 
router.post('/login', async (req, res) => {
	let {email, password} = req.body;

	let user = await User.findOne({email : email, password : password});

	if(user){
		
	}
	else {
		return res.status(404).json({message : "error", body : "Incorrect email or password"});
	}

})

router.delete('/:id', async (req, res) => {
	let {id} = req.params;
	let user = await User.findOne({"_id" : id});
	if(user){
		let del = await User.deleteOne({"_id" : id});
		if(del) {
			res.status(200).json({message : "success", body : "User removed successfully"});
		}
		else {
			res.status(500).json({message : "error", body : "Our server encountered an error. Please try again after some time"});
		}
	}
	else {
		return res.status(404).json({message : "error", body : "The user doesn't exist"});
	}
})

router.put('/:id', async (req, res) => {
	const {name, password, about, qualification} = req.body;
	const {id} = req.params;

	//checking if required fields
	if(!name || !password || !about || !qualification) {
		return res.status(422).json({
			message : "error",
			body : "Please provide all the necessary details",
		});
	}

	try{
		let userExist = await User.findOne({"_id" : id});

		if(userExist){
			let update = await User.updateOne({"_id" : id}, {name, password, about, qualification});
			if(update) {
				res.status(200).json({message : "success", body : "User details updated successfully"});
			}
			else {
				return res.status(500).json({message : "error", body : "Our servers encountered some error. Please try after some time"});
			}
		}
		else {
			return res.status(404).json({message : "error", body : "User doesn't exist"});
		}

	}
	catch(err) {
		res.status(500).json({message : 'error', body : 'Our servers encountered some error. Please try after some time'})
		console.log(err);
	}
})

module.exports = router;