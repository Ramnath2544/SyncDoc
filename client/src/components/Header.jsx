import {
  Avatar,
  Button,
  Dropdown,
  DropdownDivider,
  DropdownHeader,
  DropdownItem,
  Navbar,
  NavbarCollapse,
  NavbarLink,
  NavbarToggle,
  TextInput,
} from 'flowbite-react';
import { Link, useLocation } from 'react-router-dom';
import { AiOutlineSearch } from 'react-icons/ai';
import { FaMoon, FaSun } from 'react-icons/fa';
import { useSelector, useDispatch } from 'react-redux';
import { toggleTheme } from '../redux/theme/themeSlice';
import { avatarUrl } from '../constants/defaultAvatarUrl';
import { signoutSuccess } from '../redux/user/userSlice';

export default function Header() {
  const path = useLocation().pathname;
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);
  const { theme } = useSelector((state) => state.theme);

  const handleSignout = async () => {
    try {
      const res = await fetch('/api/user/signout', {
        method: 'POST',
      });
      const data = await res.json();
      if (!res.ok) {
        console.error(data.message);
      } else {
        dispatch(signoutSuccess());
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <Navbar className='border-b-2'>
      <Link
        to='/'
        className='self-center whitespace-nowrap text-sm sm:text-xl font-semibold dark:text-white'
      >
        <span className='px-2 py-1 bg-gradient-to-r from-red-500 to-yellow-300 rounded-lg text-white'>
          Blogify
        </span>
      </Link>
      <form>
        <TextInput
          type='text'
          placeholder='Search...'
          rightIcon={AiOutlineSearch}
          className='hidden lg:inline'
        />
      </form>
      <Button className='w-12 h-10 lg:hidden' color='gray' pill>
        <AiOutlineSearch />
      </Button>
      <div className='flex gap-2 md:order-2'>
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
              <Avatar
                className='cursor-pointer'
                alt='user'
                img={avatarUrl(currentUser.profilePicture)}
                rounded
              />
            }
          >
            <DropdownHeader>
              <span className='block text-sm'>@{currentUser.username}</span>
              <span className='block text-sm font-medium truncate'>
                {currentUser.email}
              </span>
            </DropdownHeader>
            <Link to={'/dashboard?tab=profile'}>
              <DropdownItem>Profile</DropdownItem>
            </Link>
            <DropdownDivider />
            <DropdownItem onClick={handleSignout}>Sign out</DropdownItem>
          </Dropdown>
        ) : (
          <Link to='/sign-in'>
            <Button
              className='cursor-pointer'
              gradientduotone='purpleToBlue'
              outline
            >
              Sign In
            </Button>
          </Link>
        )}

        <NavbarToggle className='cursor-pointer' />
      </div>
      <NavbarCollapse>
        <NavbarLink as={Link} to='/' active={path === '/'}>
          Home
        </NavbarLink>
        <NavbarLink as={Link} to='/about' active={path === '/about'}>
          About
        </NavbarLink>
        <NavbarLink as={Link} to='/projects' active={path === '/projects'}>
          Projects
        </NavbarLink>
      </NavbarCollapse>
    </Navbar>
  );
}
