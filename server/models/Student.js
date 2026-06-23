const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(

{

studentId:{

type:String,

required:true,

unique:true

},

photo:{

type:String,

default:""

},

name:{

type:String,

required:true,

trim:true

},

phone:{

type:String,

required:true,

unique:true

},

parentPhone:{

type:String,

default:""

},

courseId:{

type:mongoose.Schema.Types.ObjectId,

ref:"Course",

required:true

},

joinDate:{

type:Date,

required:true

},

courseEndDate:{

type:Date,

required:true

},

extraMonths:{

type:Number,

default:0

},

status:{

type:String,

enum:["Active","Completed"],

default:"Active"

},

googleReview:{

type:Boolean,

default:false

},

justdialReview:{

type:Boolean,

default:false

},

referredBy:{

type:mongoose.Schema.Types.ObjectId,

ref:"Student",

default:null

},

notes:{

type:String,

default:""

}

},

{

timestamps:true

}

);

module.exports = mongoose.model(

"Student",

studentSchema

);