const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema(

{

courseName:{

type:String,

required:true,

trim:true,

unique:true

},

courseCode:{

type:String,

required:true,

trim:true,

uppercase:true,

unique:true

},

duration:{

type:Number,

required:true

},

durationType:{

type:String,

enum:["Days","Weeks","Months","Years"],

default:"Months"

},

description:{

type:String,

default:""

},

status:{

type:Boolean,

default:true

}

},

{

timestamps:true

}

);

module.exports = mongoose.model(

"Course",

courseSchema

);