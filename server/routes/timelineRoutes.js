const express=require("express");

const router=express.Router();


const{

createTimeline,

getAllTimelines,

getStudentTimeline

}

=

require(

"../controllers/timelineController"

);



router.post(

"/",

createTimeline

);


router.get(

"/",

getAllTimelines

);


router.get(

"/:studentId",

getStudentTimeline

);


module.exports=router;