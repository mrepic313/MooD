// controllers/userController.js
const User = require('../models/User');
const generateToken = require('../utils/generateToken');

// Register a new user
const registerUser = async (req, res) => {
  const { username, email, password } = req.body;
  const user = await User.create({ username, email, password });
  res.json({ id: user._id, username: user.username, token: generateToken(user._id) });
};

// User login
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user && await user.matchPassword(password)) {
    res.json({ id: user._id, username: user.username, token: generateToken(user._id) });
  } else {
    res.status(401).json({ message: 'Invalid email or password' });
  }
};

module.exports = { registerUser, loginUser }; // Ensure both functions are exported correctly
