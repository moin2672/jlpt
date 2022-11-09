const mongoose = require('mongoose');

const contentSchema =  mongoose.Schema({
    japanese:{type:String, required: true},
    eMeaning: {type:String, required: true},
    ePronunciation: {type:String, required: true},
    tMeaning: {type:String},
    tPronunciation: {type:String},
    lessonName: {type:String, required: true},
    lastUpdatedDate: {type:String, required: true},
    creator:{type:mongoose.Schema.Types.ObjectId, ref:"User", required:true}
});

module.exports = mongoose.model('Content', contentSchema);