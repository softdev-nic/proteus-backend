const mongoose = require('mongoose')

const MainTaskSchema = mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    dueDate:{
        type:String,
        required:true
    },
    subTasks:[{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Task"
    }]
})

const MainTask = mongoose.model("MainTask",MainTaskSchema)

module.exports = MainTask