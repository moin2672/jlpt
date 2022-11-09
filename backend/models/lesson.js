const mongoose = require('mongoose');

const lessonSchema =  mongoose.Schema({
    lessonName: {type:String, required: true},
    creator:{type:mongoose.Schema.Types.ObjectId, ref:"User", required:true}
});

module.exports = mongoose.model('Lesson', lessonSchema);