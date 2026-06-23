const express = require("express");

const router = express.Router();


const {

createAttendance,

getAttendance,

getStudentAttendance,

updateAttendance

}

=

require(

"../controllers/AttendanceController"

);



router.post(

"/",

createAttendance

);


router.get(

"/",

getAttendance

);


router.get(

"/:studentId",

getStudentAttendance

);


router.put(

"/:id",

updateAttendance

);


module.exports = router;