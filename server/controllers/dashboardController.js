const Student = require("../models/Student");
const Attendance = require("../models/Attendance");
const Task = require("../models/Task");

exports.getDashboardStats = async (req, res) => {

  try {

    // STUDENTS

    const totalStudents = await Student.countDocuments();

    const activeStudents = await Student.countDocuments({
      status: "Active"
    });

    const inactiveStudents = await Student.countDocuments({
      status: "Inactive"
    });


    // TODAY DATE

    const today = new Date();

    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);

    tomorrow.setDate(today.getDate() + 1);


    // ATTENDANCE

    const presentToday = await Attendance.countDocuments({

      date: {

        $gte: today,

        $lt: tomorrow

      },

      status: "Present"

    });


    const absentToday = await Attendance.countDocuments({

      date: {

        $gte: today,

        $lt: tomorrow

      },

      status: "Absent"

    });


    const leaveToday = await Attendance.countDocuments({

      date: {

        $gte: today,

        $lt: tomorrow

      },

      status: "Leave"

    });


    // TASKS

    const totalTasks = await Task.countDocuments();


    const completedTasks = await Task.countDocuments({

      status: "Completed"

    });


    const inProgressTasks = await Task.countDocuments({

      status: "In Progress"

    });


    const pendingPractice = await Task.countDocuments({

      status: "Pending Practice"

    });


    const completionRate =

      totalTasks === 0

        ? 0

        : Math.round(

            (completedTasks / totalTasks) * 100

          );


    // MISSING CHECKOUT

    const missingCheckout = await Attendance.countDocuments({

      status: "Present",

      $or: [

        {

          outTime: ""

        },

        {

          outTime: null

        }

      ]

    });



    res.status(200).json({

      success: true,

      dashboard: {

        totalStudents,

        activeStudents,

        inactiveStudents,

        presentToday,

        absentToday,

        leaveToday,

        totalTasks,

        completedTasks,

        inProgressTasks,

        pendingPractice,

        completionRate,

        missingCheckout

      }

    });

  }

  catch (error) {

    res.status(500).json({

      success: false,

      message: error.message

    });

  }

};