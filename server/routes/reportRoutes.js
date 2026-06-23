const express = require("express");

const router = express.Router();

const {

getOverviewReport,

getStudentPerformance,

getCourseWiseStudents

}

= require("../controllers/reportController");


router.get("/overview", getOverviewReport);

router.get("/performance", getStudentPerformance);

router.get("/coursewise", getCourseWiseStudents);


module.exports = router;