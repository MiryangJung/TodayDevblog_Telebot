const mongoose = require("mongoose");
mongoose.set('useCreateIndex', true);

const listSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    auth :{type:String},
    title :{type:String},
    date :{type:String},
    link :{type:String},
    view :{type:Number, default:0}
});


module.exports = mongoose.model("List", listSchema);