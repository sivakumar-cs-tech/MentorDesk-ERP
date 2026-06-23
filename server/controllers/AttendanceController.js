const Attendance = require("../models/Attendance");


// CREATE ATTENDANCE

const createAttendance = async (req, res) => {

try {

const attendance = new Attendance(req.body);

await attendance.save();

res.status(201).json({

success:true,

message:"Attendance Added Successfully",

attendance

});

}

catch(error){

res.status(500).json({

success:false,

message:error.message

});

}

};



// GET ALL ATTENDANCE

const getAttendance = async (req,res)=>{

try{

const attendance=

await Attendance

.find()

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

attendance.length,

attendance

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




// GET STUDENT ATTENDANCE

const getStudentAttendance = async (

req,

res

)=>{

try{

const attendance=

await Attendance

.find({

studentId:

req.params.studentId

})

.populate(

"studentId"

)

.sort({

date:-1

});


res.status(200)

.json({

success:true,

count:

attendance.length,

attendance

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




// UPDATE ATTENDANCE

const updateAttendance = async (

req,

res

)=>{

try{


const attendance=

await Attendance

.findByIdAndUpdate(

req.params.id,

req.body,

{

new:true,

runValidators:true

}

);


if(!attendance){

return res.status(404)

.json({

success:false,

message:

"Attendance Not Found"

});

}


res.status(200)

.json({

success:true,

message:

"Attendance Updated Successfully",

attendance

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



module.exports={

createAttendance,

getAttendance,

getStudentAttendance,

updateAttendance

};