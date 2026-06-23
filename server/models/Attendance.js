const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema(

{

studentId:{

type:mongoose.Schema.Types.ObjectId,

ref:"Student",

required:true

},

date:{

type:Date,

required:true

},

status:{

type:String,

enum:[

"Present",

"Absent",

"Leave"

],

required:true

},

inTime:{

type:String,

default:""

},

outTime:{

type:String,

default:""

},

duration:{

type:Number,

default:0

},

leaveReason:{

type:String,

default:""

},

expectedReturnDate:{

type:Date

},

remarks:{

type:String,

default:""

}

},

{

timestamps:true

}

);

module.exports = mongoose.model(

"Attendance",

attendanceSchema

);