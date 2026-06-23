const Student = require("../models/Student");

const generateStudentId = async () => {

    const lastStudent = await Student
    .findOne()
    .sort({ createdAt: -1 });

    if (!lastStudent) {

        return "ACEKBSKSTU001";

    }

    const lastId = lastStudent.studentId;

    const number = parseInt(

        lastId.substring(11)

    );

    const nextNumber = number + 1;

    return `ACEKBSKSTU${String(nextNumber)
    .padStart(3,"0")}`;

}

module.exports = generateStudentId;