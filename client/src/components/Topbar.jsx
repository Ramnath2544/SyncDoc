import { Navbar, NavbarToggle, NavbarCollapse, NavbarLink, Button } from "flowbite-react";
import { Link, useLocation } from "react-router-dom";

export default function Topbar() {
  const path = useLocation().pathname;

  return (
    <Navbar className="border-b-2">
      <Link to="/" className="self-center whitespace-nowrap text-sm sm:text-xl font-semibold dark:text-white">
        <span className="px-2 py-1 bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 rounded-lg text-white">
          Sync
        </span>
        Doc
      </Link>

      <div className="flex md:order-2 gap-2">
        <Link to="/login">
          <Button 
            className="border border-blue-500 text-blue-600 bg-white hover:bg-gradient-to-r hover:from-cyan-500 hover:to-blue-500 hover:text-white hover:border-transparent transition-all duration-300 dark:bg-gray-800 dark:text-blue-400"
          >
            Sign In
          </Button>
        </Link>
        <NavbarToggle />
      </div>

      <NavbarCollapse>
        <NavbarLink active={path === "/"} as={"div"}>
          <Link to="/">Home</Link>
        </NavbarLink>
        <NavbarLink active={path === "/dashboard"} as={"div"}>
          <Link to="/dashboard">Dashboard</Link>
        </NavbarLink>
      </NavbarCollapse>
    </Navbar>
  );
}