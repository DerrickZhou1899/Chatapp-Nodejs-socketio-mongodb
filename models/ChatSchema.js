const mongoose = require("mongoose");
const Schema = mongoose.Schema;
//người gửi, nội dung
const chatSchema = new Schema({
    name: String,
    message: String
});
let Chat = mongoose.model("Chat",chatSchema);
module.exports = Chat;