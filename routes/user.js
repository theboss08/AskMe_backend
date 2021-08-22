const express = require('express');
const router = express.Router();
const User = require('../models/user');
const jwt = require('jsonwebtoken');


// route for getting the user details.
router.get('/:id', async (req, res) => {
	let { id } = req.params;
	let user = await User.findOne({"_id" : id});
	if(user){
		let obj = {...user["_doc"]};
		delete obj.password;
		res.status(200).json({message : "success", user : obj});
	}
	else {
		res.status(404).json({message : "error", body : "The user was not found"});
	}
});


// route for user registration
router.post('/register', async (req, res) => {
	const {name, email, password, about, qualification} = req.body;

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

		const user = new User({name, email, password, about, qualification});

		let userRegister = await user.save();

		if(userRegister){
			res.status(200).json({message : "success", body : "User registered successfully"});
		}

	}
	catch(err) {
		console.log(err);
		res.status(500).json({message : 'error', body : 'Our servers encountered some error. Please try after some time'})
	}

});

//route for user login 
router.post('/login', async (req, res) => {
	let {email, password} = req.body;

	let user = await User.findOne({email : email, password : password});
	if(user){
		let token = await jwt.sign({user_id : user._id, user_name : user.name}, process.env.SECRET_KEY, { expiresIn: 60 * 60 * 24 });
		res.cookie('token', token, {
			httpOnly : true,
			sameSite : "Lax",
		});
		res.status(200).json({message : "success", body : "Login Successfull"});
	}
	else {
		return res.status(404).json({message : "error", body : "Incorrect email or password"});
	}

})

router.post('/check_login', async (req, res) => {
	try {
		const token = req.cookies.token;
		if(!token) {
			return res.status(200).json({message : "error", body : "Token not provided"});
		}
		const check_token = jwt.verify(token, process.env.SECRET_KEY);
		if(check_token){
			res.status(200).json({message : "success", body : check_token});
		}
		else {
			res.status(200).json({message : "error", body : "Invalid Token"});
		}
	} catch (err) {
		console.log(err);
		res.status(401).json({message : "error", body : "Invalid Token"});
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

router.put('/', async (req, res) => {
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
	} catch (err) {
		console.log(err);
		res.status(401).json({message : "error", body : "Invalid Token"});
	}


	const {name, email, password, about, qualification} = req.body;

	//checking if required fields
	if(!name || !email || !about || !qualification) {
		return res.status(422).json({
			message : "error",
			body : "Please provide all the necessary details",
		});
	}

	try{
		let update;
		if(password) update = await User.updateOne({"_id" : user_id}, {name, email, password, about, qualification});
		else {
			console.log('no password');
			update = await User.updateOne({"_id" : user_id}, {name, email, about, qualification});
		}
		if(update) {
			res.status(200).json({message : "success", body : "User details updated successfully"});
		}
		else {
			return res.status(500).json({message : "error", body : "Our servers encountered some error. Please try after some time"});
		}
	}
	catch(err) {
		console.log(err);
		res.status(500).json({message : 'error', body : 'Our servers encountered some error. Please try after some time'})
	}
})

router.post('/dashboard', async (req, res) => {
	try {
		const token = req.cookies.token;
		if(!token) {
			return res.status(200).json({message : "error", body : "Token not provided"});
		}
		const check_token = jwt.verify(token, process.env.SECRET_KEY);
		if(check_token){
			let {user_id} = check_token;
			let user = await User.findOne({"_id" : user_id});
			res.status(200).json({message : "success", user : user});
		}
		else {
			res.status(200).json({message : "error", body : "Invalid Token"});
		}
	} catch (err) {
		console.log(err);
		res.status(401).json({message : "error", body : "Invalid Token"});
	}
})

router.post('/logout', (req, res) => {
	res.cookie('token', null, {
		expires: new Date(Date.now()),
		httpOnly : true,
		sameSite : "Lax",
	})
	res.status(200).json({message : "success", body : "Logged Out"});
})

module.exports = router;