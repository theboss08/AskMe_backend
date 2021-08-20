const mongoose = require('mongoose');

const schema = new mongoose.Schema({
	body : {
		type : String,
		required : true,
	},
	answer_id : {
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

const Answer_comment = mongoose.model('ANSWER_COMMENT', schema);

module.exports = Answer_comment;