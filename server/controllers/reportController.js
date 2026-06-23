const Student = require("../models/Student");
const Attendance = require("../models/Attendance");
const Task = require("../models/Task");


// OVERVIEW REPORT

exports.getOverviewReport = async (req, res) => {

try {

const totalStudents = await Student.countDocuments();

const activeStudents = await Student.countDocuments({
status:"Active"
});

const inactiveStudents = await Student.countDocuments({
status:"Inactive"
});


const totalAttendance = await Attendance.countDocuments();

const presentCount = await Attendance.countDocuments({
status:"Present"
});

const absentCount = await Attendance.countDocuments({
status:"Absent"
});

const leaveCount = await Attendance.countDocuments({
status:"Leave"
});


const totalTasks = await Task.countDocuments();

const completedTasks = await Task.countDocuments({
status:"Completed"
});

const inProgressTasks = await Task.countDocuments({
status:"In Progress"
});

const pendingPractice = await Task.countDocuments({
status:"Pending Practice"
});

res.status(200).json({

success:true,

report:{

students:{

totalStudents,

activeStudents,

inactiveStudents

},

attendance:{

totalAttendance,

presentCount,

absentCount,

leaveCount

},

tasks:{

totalTasks,

completedTasks,

inProgressTasks,

pendingPractice

}

}

});

}

catch(error){

res.status(500).json({

success:false,

message:error.message

});

}

};




// STUDENT PERFORMANCE REPORT

exports.getStudentPerformance = async(req,res)=>{

try{

const students=await Student.find()

.populate("courseId");

const report=[];


for(let student of students){

const totalTasks=await Task.countDocuments({

studentId:student._id

});


const completedTasks=await Task.countDocuments({

studentId:student._id,

status:"Completed"

});


const totalAttendance=await Attendance.countDocuments({

studentId:student._id

});


const presentAttendance=await Attendance.countDocuments({

studentId:student._id,

status:"Present"

});


const attendancePercentage=

totalAttendance===0

?0

:((presentAttendance/totalAttendance)*100).toFixed(2);



const taskPercentage=

totalTasks===0

?0

:((completedTasks/totalTasks)*100).toFixed(2);


let grade="C";

if(attendancePercentage>=90 && taskPercentage>=90)

grade="A";

else if(attendancePercentage>=75 && taskPercentage>=75)

grade="B";



report.push({

studentId:student.studentId,

name:student.name,

course:

student.courseId

?student.courseId.courseName

:"-",


attendancePercentage,

taskPercentage,

grade

});

}


res.status(200).json({

success:true,

count:report.length,

report

});

}

catch(error){

res.status(500).json({

success:false,

message:error.message

});

}

};






// COURSE WISE STUDENTS REPORT

exports.getCourseWiseStudents=async(req,res)=>{

try{

const report=await Student.aggregate([

{

$lookup:{

from:"courses",

localField:"courseId",

foreignField:"_id",

as:"course"

}

},

{

$unwind:"$course"

},

{

$group:{

_id:"$course.courseName",

totalStudents:{

$sum:1

}

}

},

{

$sort:{

totalStudents:-1

}

}

]);



res.status(200).json({

success:true,

count:report.length,

report

});

}

catch(error){

res.status(500).json({

success:false,

message:error.message

});

}

};
