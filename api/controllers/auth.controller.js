import User from '../models/User.js';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { errorHandler } from '../utils/error.js';

const accessTokenCookie = {
  httpOnly: true,
  path: '/',
  sameSite: 'lax',
  secure: process.env.NODE_ENV === 'production',
};

export const register = async (req, res, next) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password || username === '' || email === '' || password === '') {
    return next(errorHandler(400, 'All fields are required.'));
  }

  const hashedPassword = bcryptjs.hashSync(password, 10);

  const newUser = new User({
    username,
    email,
    password: hashedPassword,
  });

  try {
    await newUser.save();
    res.json({ message: 'Signup successful!' });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password || email === '' || password === '') {
    return next(errorHandler(400, 'All fields are required.'));
  }

  try {
    const validUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (!validUser) {
      return next(errorHandler(404, 'User not found'));
    }

    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if (!validPassword) {
      return next(errorHandler(401, 'Wrong credentials'));
    }

    const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    const { password: _pw, ...rest } = validUser.toObject();

    res
      .status(200)
      .cookie('access_token', token, {
        ...accessTokenCookie,
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .json({ user: rest });
  } catch (error) {
    next(error);
  }
};

export const logout = (req, res) => {
  res.clearCookie('access_token', accessTokenCookie).status(200).json({
    message: 'Signed out successfully',
  });
};