import { Button, Label, TextInput, Alert, Spinner } from 'flowbite-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  signInStart,
  signInSuccess,
  signInFailure,
} from '../redux/user/userSlice';

export default function LoginPage() {
  const [formData, setFormData] = useState({});
  const { loading, error: errorMessage } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      return dispatch(signInFailure('Please fill out all fields.'));
    }

    try {
      dispatch(signInStart());

      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData),
      });

      const contentType = res.headers.get('content-type') || '';
      if (!contentType.includes('application/json')) {
        return dispatch(
          signInFailure(
            'Could not reach the API. Is the server running on port 3000?'
          )
        );
      }

      const data = await res.json();

      if (data.success === false) {
        return dispatch(signInFailure(data.message));
      }

      if (res.ok) {
        dispatch(signInSuccess(data.user));
        navigate('/dashboard');
      }
    } catch (error) {
      dispatch(signInFailure(error.message));
    }
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4'>
      <div className='w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8'>
        {/* Logo / Brand */}
        <div className='mb-6 text-center'>
          <h1 className='text-3xl font-bold text-gray-800 dark:text-white'>
            <span className='px-2 py-1 bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 rounded-lg text-white'>
              Sync
            </span>
            Doc
          </h1>
          <p className='mt-2 text-sm text-gray-500 dark:text-gray-400'>
            Sign in to your account
          </p>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <Alert className='mb-5' color='failure'>
            {errorMessage}
          </Alert>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
          {/* Email */}
          <div>
            <Label
              htmlFor='email'
              value='Email address'
              className='mb-1 block text-gray-700 dark:text-gray-300'
            />
            <TextInput
              id='email'
              type='email'
              placeholder='name@example.com'
              onChange={handleChange}
              required
            />
          </div>

          {/* Password */}
          <div>
            <Label
              htmlFor='password'
              value='Password'
              className='mb-1 block text-gray-700 dark:text-gray-300'
            />
            <TextInput
              id='password'
              type='password'
              placeholder='••••••••'
              onChange={handleChange}
              required
            />
          </div>

          {/* Submit Button */}
          <Button
            type='submit'
            gradientDuoTone='cyanToBlue'
            disabled={loading}
            className='mt-2'
          >
            {loading ? (
              <>
                <Spinner size='sm' className='mr-2' />
                Signing in...
              </>
            ) : (
              'Sign In'
            )}
          </Button>
        </form>

        {/* Register Link */}
        <p className='mt-5 text-center text-sm text-gray-500 dark:text-gray-400'>
          Don&apos;t have an account?{' '}
          <Link
            to='/register'
            className='font-medium text-blue-600 hover:underline dark:text-blue-400'
          >
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}
