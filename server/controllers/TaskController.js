const Task = require("../models/Task");


// CREATE TASK

exports.createTask = async (req, res) => {

  try {

    const task = await Task.create(req.body);

    res.status(201).json({

      success: true,

      message: "Task Added Successfully",

      task

    });

  }

  catch (error) {

    res.status(500).json({

      success: false,

      message: error.message

    });

  }

};



// GET ALL TASKS

exports.getAllTasks = async (req, res) => {

  try {

    const tasks = await Task.find()

      .populate("studentId")

      .populate("courseId")

      .sort({ createdAt: -1 });



    res.status(200).json({

      success: true,

      count: tasks.length,

      tasks

    });

  }

  catch (error) {

    res.status(500).json({

      success: false,

      message: error.message

    });

  }

};




// GET SINGLE TASK

exports.getTaskById = async (req, res) => {

  try {

    const task = await Task.findById(req.params.id)

      .populate("studentId")

      .populate("courseId");



    if (!task) {

      return res.status(404).json({

        success: false,

        message: "Task Not Found"

      });

    }



    res.status(200).json({

      success: true,

      task

    });

  }

  catch (error) {

    res.status(500).json({

      success: false,

      message: error.message

    });

  }

};




// UPDATE TASK

exports.updateTask = async (req, res) => {

  try {

    const task = await Task.findByIdAndUpdate(

      req.params.id,

      req.body,

      {

        new: true,

        runValidators: true

      }

    );



    if (!task) {

      return res.status(404).json({

        success: false,

        message: "Task Not Found"

      });

    }



    res.status(200).json({

      success: true,

      message: "Task Updated Successfully",

      task

    });

  }

  catch (error) {

    res.status(500).json({

      success: false,

      message: error.message

    });

  }

};




// DELETE TASK

exports.deleteTask = async (req, res) => {

  try {

    const task = await Task.findByIdAndDelete(

      req.params.id

    );



    if (!task) {

      return res.status(404).json({

        success: false,

        message: "Task Not Found"

      });

    }



    res.status(200).json({

      success: true,

      message: "Task Deleted Successfully"

    });

  }

  catch (error) {

    res.status(500).json({

      success: false,

      message: error.message

    });

  }

};