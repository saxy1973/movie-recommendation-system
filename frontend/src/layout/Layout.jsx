import { Outlet } from "react-router-dom";
import Navbar from "../features/navbar/Navbar";

const Layout = () => {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
};

export default Layout;