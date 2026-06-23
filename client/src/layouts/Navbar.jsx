import {

Bell,

Search,

Settings

}

from "lucide-react";

import "../styles/navbar.css";


const Navbar=()=>{

return(

<div className="navbar">


<div className="navbar-left">

<h2>

Welcome Back 👋

</h2>


<p>

MentorDesk ERP

</p>

</div>




<div className="navbar-right">


<div className="search-box">

<Search size={18}/>


<input

type="text"

placeholder="Search..."

/>

</div>





<div className="icon-box">

<Bell size={20}/>

</div>





<div className="icon-box">

<Settings size={20}/>

</div>





<div className="profile">

A

</div>



</div>



</div>

)

}


export default Navbar;