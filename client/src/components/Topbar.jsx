import {
  Navbar,
  NavbarToggle,
  NavbarCollapse,
  NavbarLink,
  Button,
  Dropdown,
  Avatar,
  DropdownItem,
  DropdownHeader,
  DropdownDivider,
} from 'flowbite-react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { FaSun, FaMoon } from 'react-icons/fa';
import { toggleTheme } from '../redux/theme/themeSlice';

export default function Topbar() {
  const path = useLocation().pathname;
  const { currentUser } = useSelector((state) => state.user);
  const { theme } = useSelector((state) => state.theme);
  const dispatch = useDispatch();

  return (
    <Navbar className='border-b-2'>
      <Link
        to='/'
        className='self-center whitespace-nowrap text-sm sm:text-xl font-semibold dark:text-white'
      >
        <span className='px-2 py-1 bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 rounded-lg text-white'>
          Sync
        </span>
        Doc
      </Link>

      <div className='flex md:order-2 gap-2'>
        <button
          onClick={() => dispatch(toggleTheme())}
          className={`cursor-pointer w-10 h-10 hidden sm:flex items-center justify-center rounded-full transition-all duration-500 
    ${
      theme === 'light'
        ? 'bg-gradient-to-br from-amber-300 to-orange-400 shadow-[0_0_12px_rgba(251,146,60,0.8)] hover:shadow-[0_0_20px_rgba(251,146,60,1)] hover:scale-110'
        : 'bg-gradient-to-br from-indigo-500 to-violet-600 shadow-[0_0_12px_rgba(139,92,246,0.8)] hover:shadow-[0_0_20px_rgba(139,92,246,1)] hover:scale-110'
    }`}
        >
          {theme === 'light' ? (
            <FaSun className='text-white text-lg drop-shadow-[0_0_4px_rgba(255,255,255,0.9)] animate-spin-slow' />
          ) : (
            <FaMoon className='text-white text-lg drop-shadow-[0_0_4px_rgba(255,255,255,0.9)] animate-moon-pulse' />
          )}
        </button>
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
              <span className='block text-sm font-medium truncate'>
                {currentUser.email}
              </span>
            </DropdownHeader>
            <Link to='/dashboard'>
              <DropdownItem>Dashboard</DropdownItem>
            </Link>
            <DropdownDivider />
            <DropdownItem>Sign out</DropdownItem>
          </Dropdown>
        ) : (
          <Link to='/login'>
            <Button className='border cursor-pointer'>Sign In</Button>
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
