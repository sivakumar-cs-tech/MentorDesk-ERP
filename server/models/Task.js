const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({

studentId:{
type:mongoose.Schema.Types.ObjectId,
ref:"Student",
required:true
},

courseId:{
type:mongoose.Schema.Types.ObjectId,
ref:"Course",
required:true
},

moduleName:{
type:String,
required:true
},

topicName:{
type:String,
required:true
},

startDate:{
type:Date,
required:true
},

endDate:{
type:Date,
required:true
},

duration:{
type:Number,
required:true
},

durationType:{
type:String,
enum:["Minutes","Hours","Days"],
default:"Days"
},

totalQuestions:{
type:Number,
required:true
},

completedQuestions:{
type:Number,
default:0
},

status:{
type:String,

enum:[

"In Progress",

"Pending Practice",

"Practice Completed",

"Completed"

],

default:"In Progress"
},

remarks:{
type:String,
default:""
}

},
{
timestamps:true,
toJSON:{virtuals:true},
toObject:{virtuals:true}
}
);


taskSchema.virtual("remainingQuestions").get(function(){

return this.totalQuestions-this.completedQuestions;

});


module.exports=mongoose.model("Task",taskSchema);