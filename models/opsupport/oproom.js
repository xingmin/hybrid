var mongoose = require('mongoose');
var conn = require('../../db/mongoose'),
	Schema = mongoose.Schema,
	OpRoom = new Schema({
		name: {
			type: String,
			unique: true,
			required: true
		},
		deletedFlag: {
			type: Number,
			default: 0
		},
		created: {
			type: Date,
			default: Date.now
		}
	});
OpRoom.virtual('OpRoomId').get(function () {
	return this.id;
});
module.exports = conn.model('OpRoom', OpRoom);