import {

LayoutDashboard,

Users,

BookOpen,

CalendarCheck,

ClipboardList,

Clock3,

BarChart3,

Settings

}

from "lucide-react";

import "../styles/sidebar.css";



const Sidebar=()=>{

return(

<div className="sidebar">


<div className="logo-section">

<h1>

MentorDesk

</h1>

<p>

Training ERP

</p>

</div>




<div className="menu">


<div className="menu-item active">

<LayoutDashboard size={22}/>

<span>

Dashboard

</span>

</div>



<div className="menu-item">

<Users size={22}/>

<span>

Students

</span>

</div>




<div className="menu-item">

<BookOpen size={22}/>

<span>

Courses

</span>

</div>




<div className="menu-item">

<CalendarCheck size={22}/>

<span>

Attendance

</span>

</div>




<div className="menu-item">

<ClipboardList size={22}/>

<span>

Tasks

</span>

</div>




<div className="menu-item">

<Clock3 size={22}/>

<span>

Timeline

</span>

</div>




<div className="menu-item">

<BarChart3 size={22}/>

<span>

Reports

</span>

</div>



<div className="menu-item">

<Settings size={22}/>

<span>

Settings

</span>

</div>



</div>



<div className="sidebar-footer">

<p>

Version 1.0

</p>

</div>


</div>

)

}



export default Sidebar;