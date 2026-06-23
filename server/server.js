const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const connectDB = require("./config/db");
const studentRoutes = require("./routes/studentRoutes");
const courseRoutes = require("./routes/courseRoutes");
const attendanceRoutes = require("./routes/attendanceRoutes");
const taskRoutes = require("./routes/taskRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const timelineRoutes=require("./routes/timelineRoutes");
const reportRoutes = require("./routes/reportRoutes");
const app = express();

// 🔥 Add this line
connectDB();



app.use(cors());

app.use(express.json());
app.use("/api/students", studentRoutes);

app.use("/api/courses", courseRoutes);

app.use("/api/attendance", attendanceRoutes);

app.use("/api/tasks", taskRoutes);

app.use("/api/dashboard", dashboardRoutes);

app.use("/api/timelines", timelineRoutes);

app.use("/api/reports", reportRoutes);

app.get("/", (req, res) => {

  res.send("MentorDesk Server Running 🚀");

});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {

  console.log(`Server running on port ${PORT}`);

});