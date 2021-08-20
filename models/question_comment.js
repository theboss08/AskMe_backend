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
	}
}, {
	timestamps : true,
})

const Question_comment = mongoose.model('QUESTION_COMMENT', schema);

module.exports = Question_comment;