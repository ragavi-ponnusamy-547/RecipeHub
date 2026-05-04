const jwt = require('jsonwebtoken');
const asyncHandler = require('../utils/asyncHandler');
const User = require('../models/User');

const createToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });

const sanitizeUser = (user) => ({
  id: user._id,
  name: user.name,
  username: user.username,
  email: user.email,
  role: user.role,
  profilePic: user.profilePic,
});

const normalizeEmail = (value) => String(value || '').trim().toLowerCase();
const normalizeText = (value) => String(value || '').trim();

const registerUser = asyncHandler(async (req, res) => {
  const { name, username, email, password, profilePic } = req.body;
  const normalizedName = normalizeText(name);
  const normalizedUsername = normalizeText(username).toLowerCase();
  const normalizedEmail = normalizeEmail(email);
  const normalizedPassword = normalizeText(password);

  if (!normalizedName || !normalizedUsername || !normalizedEmail || !normalizedPassword) {
    return res.status(400).json({ message: 'All required fields must be provided' });
  }

  const existingUser = await User.findOne({
    $or: [{ email: normalizedEmail }, { username: normalizedUsername }],
  });

  if (existingUser) {
    return res.status(409).json({ message: 'User already exists' });
  }

  const user = await User.create({
    name: normalizedName,
    username: normalizedUsername,
    email: normalizedEmail,
    password: normalizedPassword,
    profilePic,
  });

  res.status(201).json({
    token: createToken(user._id),
    user: sanitizeUser(user),
  });
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const normalizedEmail = normalizeEmail(email);
  const normalizedPassword = normalizeText(password);

  if (!normalizedEmail || !normalizedPassword) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  const user = await User.findOne({ email: normalizedEmail }).select('+password');

  if (!user || !(await user.matchPassword(normalizedPassword))) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  res.json({
    token: createToken(user._id),
    user: sanitizeUser(user),
  });
});

const getMe = asyncHandler(async (req, res) => {
  res.json({ user: sanitizeUser(req.user) });
});

const updateProfile = asyncHandler(async (req, res) => {
  const { name, username, profilePic, email } = req.body;
  const normalizedName = normalizeText(name);
  const normalizedUsername = normalizeText(username).toLowerCase();
  const normalizedEmail = normalizeEmail(email);

  if (!normalizedName || !normalizedUsername || !normalizedEmail) {
    return res.status(400).json({ message: 'Name, username, and email are required' });
  }

  const existingUser = await User.findOne({
    _id: { $ne: req.user._id },
    $or: [{ email: normalizedEmail }, { username: normalizedUsername }],
  });

  if (existingUser) {
    return res.status(409).json({ message: 'Username or email already exists' });
  }

  req.user.name = normalizedName;
  req.user.username = normalizedUsername;
  req.user.email = normalizedEmail;
  if (profilePic !== undefined) {
    req.user.profilePic = normalizeText(profilePic) || req.user.profilePic;
  }

  const updatedUser = await req.user.save();
  res.json({ user: sanitizeUser(updatedUser) });
});

const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword, confirmPassword } = req.body;
  const normalizedCurrentPassword = normalizeText(currentPassword);
  const normalizedNewPassword = normalizeText(newPassword);
  const normalizedConfirmPassword = normalizeText(confirmPassword);

  if (!normalizedCurrentPassword || !normalizedNewPassword || !normalizedConfirmPassword) {
    return res.status(400).json({ message: 'All password fields are required' });
  }

  if (normalizedNewPassword !== normalizedConfirmPassword) {
    return res.status(400).json({ message: 'New password and confirm password do not match' });
  }

  const userWithPassword = await User.findById(req.user._id).select('+password');

  if (!userWithPassword || !(await userWithPassword.matchPassword(normalizedCurrentPassword))) {
    return res.status(401).json({ message: 'Current password is incorrect' });
  }

  userWithPassword.password = normalizedNewPassword;
  await userWithPassword.save();

  res.json({ message: 'Password updated successfully' });
});

module.exports = { registerUser, loginUser, getMe, updateProfile, changePassword, sanitizeUser };
