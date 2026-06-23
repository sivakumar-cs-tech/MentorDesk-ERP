import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import "../styles/layout.css";

const MainLayout = ({ children }) => {
  return (
    <>
      <Sidebar />
      <div className="main-content">
        <Navbar />
        <div className="page-content">{children}</div>
      </div>
    </>
  );
};

export default MainLayout;
