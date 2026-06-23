const Timeline = require("../models/Timeline");

const createTimeline = async (

studentId,

action,

description,

createdBy="Admin"

)=>{

try{

await Timeline.create({

studentId,

action,

description,

createdBy

});

}

catch(error){

console.log(

"Timeline Error :",

error.message

);

}

};

module.exports=createTimeline;