import { Button, Label, TextInput, Alert, Spinner } from "flowbite-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { signInStart, signInSuccess, signInFailure } from '../redux/user/userSlice';

export default function LoginPage() {
  const [formData, setFormData] = useState({});
  const { loading, error: errorMessage } = useSelector((state) => state.user); // Read global state
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      return dispatch(signInFailure("Please fill out all fields."));
    }
    
    try {
      dispatch(signInStart()); // Start global loading
      
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      
      const data = await res.json();
      
      if (data.success === false) {
        return dispatch(signInFailure(data.message)); // Save global error
      }
      
      if(res.ok) {
        dispatch(signInSuccess(data.user)); // Save user globally!
        navigate("/dashboard"); 
      }
    } catch (error) {
      dispatch(signInFailure(error.message));
    }
  };
  
  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900'>
      <h1 className='text-3xl font-bold text-gray-800 dark:text-white'>
        Login Page
      </h1>
    </div>
  );
}
