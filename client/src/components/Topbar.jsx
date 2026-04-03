import { Navbar, NavbarToggle, NavbarCollapse, NavbarLink, Button, Dropdown, Avatar, DropdownItem, DropdownHeader, DropdownDivider } from 'flowbite-react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux'; // 

export default function Topbar() {
  const path = useLocation().pathname;
  const { currentUser } = useSelector((state) => state.user); 
  return (
    <Navbar className='border-b-2'>
      {/* Brand Logo */}
      <Link to='/' className='self-center whitespace-nowrap text-sm sm:text-xl font-semibold dark:text-white'>
        <span className='px-2 py-1 bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 rounded-lg text-white'>
          Sync
        </span>
        Doc
      </Link>

      <div className='flex md:order-2 gap-2 items-center'>
        {currentUser ? (
          <Dropdown
            arrowIcon={false}
            inline
            label={
              <Avatar alt='user' img={currentUser.profilePicture} rounded />
            }
          >
            <DropdownHeader>
              <span className='block text-sm'>@{currentUser.username}</span>
              <span className='block text-sm font-medium truncate'>{currentUser.email}</span>
            </DropdownHeader>
            <Link to='/dashboard'>
              <DropdownItem>Dashboard</DropdownItem>
            </Link>
            <DropdownDivider />
            <DropdownItem>Sign out</DropdownItem>
          </Dropdown>
        ) : (
          <Link to='/login'>
            <Button 
              className='border border-blue-500 text-blue-600 bg-white hover:bg-gradient-to-r hover:from-cyan-500 hover:to-blue-500 hover:text-white hover:border-transparent transition-all duration-300'
            >
              Sign In
            </Button>
          </Link>
        )}
        <NavbarToggle />
      </div>

      <NavbarCollapse>
        <NavbarLink active={path === '/'} as={'div'}>
          <Link to='/'>Home</Link>
        </NavbarLink>
        <NavbarLink active={path === '/dashboard'} as={'div'}>
          <Link to='/dashboard'>Dashboard</Link>
        </NavbarLink>
      </NavbarCollapse>
    </Navbar>
  );
}