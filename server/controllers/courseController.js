const Course = require("../models/Course");

const createCourse = async (req, res) => {

    try {

        const course = new Course(req.body);

        await course.save();

        res.status(201).json({

            success: true,

            message: "Course Added Successfully",

            course

        });

    }

    catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};


const getCourses = async (req, res) => {

    try {

        const courses = await Course.find();

        res.status(200).json({

            success: true,

            count: courses.length,

            courses

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

    createCourse,

    getCourses

};