const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
	name : {
		type: String,
		required:true,
	},
	email : {
		type : String,
		required : true,
	},
	password : {
		type : String,
		required : true,
	},
	about : {
		type : String,
	},
	qualification : {
		type : String,
	},
	followers : {
		type : Number,
		default : 0,
	}
}, {
	timestamps: true,
});

const User = mongoose.model('USER', userSchema);

module.exports = User;