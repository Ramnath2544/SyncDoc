import User from '../models/User.js';
import bcryptjs from 'bcryptjs';
import { errorHandler } from '../utils/error.js';

export const register = async (req, res, next) => {
  const { username, email, password } = req.body;

  // 1. Validation check
  if (!username || !email || !password || username === '' || email === '' || password === '') {
    return next(errorHandler(400, 'All fields are required.'));
  }

  // 2. Hash the password securely
  const hashedPassword = bcryptjs.hashSync(password, 10);

  // 3. Create the new user object
  const newUser = new User({
    username,
    email,
    password: hashedPassword,
  });

  try {
    // 4. Save to database
    await newUser.save();
    res.json({ message: 'Signup successful!' });
  } catch (error) {
    // If there's an error (like duplicate email), pass it to our global error handler
    next(error);
  }
};