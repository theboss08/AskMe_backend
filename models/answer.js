const mongoose = require('mongoose');

const schema = new mongoose.Schema({
	body : {
		type : String,
		required : true,
	},
	question_id : {
		type : String,
		required : true,
	},
	user_id : {
		type : String,
		required : true,
	},
	votes : {
		type : Number,
		default : 0,
	}
}, {
	timestamps : true,
})

const Answer = mongoose.model('ANSWER', schema);

module.exports = Answer;