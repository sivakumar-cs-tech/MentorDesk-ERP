const Timeline=require("../models/Timeline");
// CREATE

exports.createTimeline=async(req,res)=>{

try{

const timeline=

await Timeline.create(

req.body

);


res.status(201)

.json({

success:true,

message:

"Timeline Added Successfully",

timeline

});

}

catch(error){

res.status(500)

.json({

success:false,

message:error.message

});

}

};
// GET ALL

exports.getAllTimelines=async(req,res)=>{

try{

const timelines=

await Timeline.find()

.populate(

"studentId"

)

.sort({

createdAt:-1

});


res.status(200)

.json({

success:true,

count:

timelines.length,

timelines

});

}

catch(error){

res.status(500)

.json({

success:false,

message:error.message

});

}

};

// GET BY STUDENT

exports.getStudentTimeline=async(req,res)=>{

try{


const timelines=

await Timeline.find({

studentId:

req.params.studentId

})

.populate(

"studentId"

)

.sort({

createdAt:-1

});


res.status(200)

.json({

success:true,

count:

timelines.length,

timelines

});

}

catch(error){

res.status(500)

.json({

success:false,

message:error.message

});

}

};