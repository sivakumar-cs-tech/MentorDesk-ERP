const mongoose = require("mongoose");

const topicSchema = new mongoose.Schema(

{

moduleId:{

type:mongoose.Schema.Types.ObjectId,

ref:"Module",

required:true

},

topicName:{

type:String,

required:true,

trim:true

},

order:{

type:Number,

required:true

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

"Topic",

topicSchema

);