const Student = require("../models/Student");

const generateStudentId = require(
  "../utils/generateStudentId"
);


// CREATE STUDENT

const createStudent = async (req, res) => {

  try {

    const studentId = await generateStudentId();

    const student = new Student({

      studentId,

      ...req.body

    });

    await student.save();

    res.status(201).json({

      success: true,

      message: "Student Added Successfully",

      student

    });

  }

  catch (error) {

    res.status(500).json({

      success: false,

      message: error.message

    });

  }

};



// GET ALL STUDENTS

const getStudents = async (req, res) => {

  try {

    const students = await Student

      .find()

      .populate("courseId")

      .sort({

        createdAt: -1

      });


    res.status(200).json({

      success: true,

      count: students.length,

      students

    });

  }

  catch (error) {

    res.status(500).json({

      success: false,

      message: error.message

    });

  }

};




// GET SINGLE STUDENT

const getStudentById = async (req, res) => {

  try {

    const student = await Student

      .findById(req.params.id)

      .populate("courseId");


    if (!student) {

      return res.status(404).json({

        success: false,

        message: "Student Not Found"

      });

    }


    res.status(200).json({

      success: true,

      student

    });

  }

  catch (error) {

    res.status(500).json({

      success: false,

      message: error.message

    });

  }

};




// UPDATE STUDENT

const updateStudent = async (req, res) => {

  try {

    const student = await Student

      .findByIdAndUpdate(

        req.params.id,

        req.body,

        {

          new: true,

          runValidators: true

        }

      );


    if (!student) {

      return res.status(404).json({

        success: false,

        message: "Student Not Found"

      });

    }


    res.status(200).json({

      success: true,

      message: "Student Updated Successfully",

      student

    });

  }

  catch (error) {

    res.status(500).json({

      success: false,

      message: error.message

    });

  }

};




// SOFT DELETE

const inactiveStudent = async (req, res) => {

  try {

    const student = await Student

      .findByIdAndUpdate(

        req.params.id,

        {

          status: "Inactive"

        },

        {

          new: true

        }

      );


    if (!student) {

      return res.status(404).json({

        success: false,

        message: "Student Not Found"

      });

    }


    res.status(200).json({

      success: true,

      message: "Student Inactivated",

      student

    });

  }

  catch (error) {

    res.status(500).json({

      success: false,

      message: error.message

    });

  }

};




// RESTORE STUDENT

const restoreStudent = async (req, res) => {

  try {

    const student = await Student

      .findByIdAndUpdate(

        req.params.id,

        {

          status: "Active"

        },

        {

          new: true

        }

      );


    if (!student) {

      return res.status(404).json({

        success: false,

        message: "Student Not Found"

      });

    }


    res.status(200).json({

      success: true,

      message: "Student Restored",

      student

    });

  }

  catch (error) {

    res.status(500).json({

      success: false,

      message: error.message

    });

  }

};



module.exports = {

  createStudent,

  getStudents,

  getStudentById,

  updateStudent,

  inactiveStudent,

  restoreStudent

};