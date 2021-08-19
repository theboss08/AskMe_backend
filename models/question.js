const mongoose = require('mongoose');

const schema = new mongoose.Schema({
	body : {
		type : String,
		required : true
	},
	user_id : {
		type : String,
		required : true,
	},
	views : {
		type : Number,
		default : 0,
	}
}, {
	timestamps : true,
});

const Question = mongoose.model('QUESTION', schema);

module.exports = Question;