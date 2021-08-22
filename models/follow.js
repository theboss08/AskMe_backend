const mongoose = require('mongoose');

const schema = new mongoose.Schema({
	follows : {
		type : String,
		required : true,
	},
	followed_by : {
		type : String,
		required : true,
	}
}, {
	timestamps : true,
})

const Follow = mongoose.model('FOLLOW', schema);

module.exports = Follow;