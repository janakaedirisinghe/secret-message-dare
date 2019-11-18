const mongoose = require('mongoose');

const messageSchema = mongoose.Schema({
    _id : mongoose.Schema.Types.ObjectId,
    user: { type:mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    message: {type: String , required:true}

});
module.exports = mongoose.model('Message',messageSchema);
