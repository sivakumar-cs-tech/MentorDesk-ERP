const express = require("express");

const router = express.Router();

const {

createStudent,

getStudents,

getStudentById,

updateStudent,

inactiveStudent,

restoreStudent

}

=

require(

"../controllers/studentController"

);


router.post(

"/",

createStudent

);


router.get(

"/",

getStudents

);


router.get(

"/:id",

getStudentById

);


router.put(

"/:id",

updateStudent

);


router.patch(

"/:id/inactive",

inactiveStudent

);


router.patch(

"/:id/restore",

restoreStudent

);


module.exports = router;