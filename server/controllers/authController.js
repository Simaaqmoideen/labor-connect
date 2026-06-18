const { Admin, JobProvider, Worker } = require('../models');
const { generateToken, hashPassword, comparePassword } = require('../utils/helpers');
const { sendOTP, verifyOTP } = require('../utils/otp');

const getModelByRole = (role) => {
  if (role === 'admin') return Admin;
  if (role === 'provider') return JobProvider;
  if (role === 'worker') return Worker;
  return null;
};

const handleRegistrationError = (error, res) => {
  console.error('Registration error details:', error);
  if (error.name === 'SequelizeUniqueConstraintError') {
    const field = error.errors?.[0]?.path || 'field';
    const value = error.errors?.[0]?.value || '';
    const cleanField = field === 'phone' ? 'phone number' : field;
    return res.status(400).json({ 
      message: `An account with this ${cleanField} (${value}) already exists.` 
    });
  }
  if (error.name === 'SequelizeValidationError') {
    const messages = error.errors.map(err => err.message).join(', ');
    return res.status(400).json({ message: messages });
  }
  res.status(500).json({ message: error.message });
};

const registerWithPassword = async (req, res) => {
  try {
    const { role, name, email, phone, password, ...rest } = req.body;
    const Model = getModelByRole(role);
    if (!Model) return res.status(400).json({ message: 'Invalid role' });

    // Check existing
    const whereClause = email ? { email } : { phone };
    if (role === 'admin') {
      delete whereClause.phone; // admins don't have phone
      if (!email) return res.status(400).json({ message: 'Email is required for admin' });
    }
    
    const existing = await Model.findOne({ where: whereClause });
    if (existing) return res.status(400).json({ message: 'User already exists' });

    const password_hash = await hashPassword(password);
    
    let userData = { name, email, password_hash };
    if (role === 'provider') {
      userData.phone = phone;
      userData.company_name = rest.company_name;
    } else if (role === 'worker') {
      userData.phone = phone;
      userData.category = rest.category;
      userData.skills = rest.skills || [];
      userData.wage_per_day = rest.wage_per_day;
      userData.working_area = rest.working_area;
    }

    const user = await Model.create(userData);
    const token = generateToken({ id: user.id, role });
    
    const userWithoutPassword = user.toJSON();
    delete userWithoutPassword.password_hash;
    
    res.status(201).json({ token, user: userWithoutPassword });
  } catch (error) {
    handleRegistrationError(error, res);
  }
};

const loginWithPassword = async (req, res) => {
  try {
    const { role, email, password } = req.body;
    const Model = getModelByRole(role);
    if (!Model) return res.status(400).json({ message: 'Invalid role' });

    const user = await Model.findOne({ where: { email } });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const isMatch = await comparePassword(password, user.password_hash);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    if (user.is_suspended) return res.status(403).json({ message: 'Account is suspended' });

    const token = generateToken({ id: user.id, role });
    
    const userWithoutPassword = user.toJSON();
    delete userWithoutPassword.password_hash;

    res.json({ token, user: userWithoutPassword });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const sendOTPHandler = async (req, res) => {
  try {
    const { phone } = req.body;
    if (!phone) return res.status(400).json({ message: 'Phone number required' });
    const result = sendOTP(phone);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const verifyOTPAndRegister = async (req, res) => {
  try {
    const { role, phone, otp, name, ...rest } = req.body;
    if (!verifyOTP(phone, otp)) return res.status(400).json({ message: 'Invalid or expired OTP' });

    const Model = getModelByRole(role);
    const existing = await Model.findOne({ where: { phone } });
    if (existing) return res.status(400).json({ message: 'User with this phone already exists' });

    let userData = { name, phone };
    if (role === 'provider') {
      userData.company_name = rest.company_name;
    } else if (role === 'worker') {
      userData.category = rest.category;
      userData.skills = rest.skills || [];
      userData.wage_per_day = rest.wage_per_day;
      userData.working_area = rest.working_area;
    }

    const user = await Model.create(userData);
    const token = generateToken({ id: user.id, role });
    
    res.status(201).json({ token, user });
  } catch (error) {
    handleRegistrationError(error, res);
  }
};

const verifyOTPAndLogin = async (req, res) => {
  try {
    const { role, phone, otp } = req.body;
    if (!verifyOTP(phone, otp)) return res.status(400).json({ message: 'Invalid or expired OTP' });

    const Model = getModelByRole(role);
    const user = await Model.findOne({ where: { phone } });
    if (!user) return res.status(404).json({ message: 'User not found. Please register first.' });
    
    if (user.is_suspended) return res.status(403).json({ message: 'Account is suspended' });

    const token = generateToken({ id: user.id, role });
    const userWithoutPassword = user.toJSON();
    delete userWithoutPassword.password_hash;
    
    res.json({ token, user: userWithoutPassword });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMe = async (req, res) => {
  try {
    const { id, role } = req.user;
    const Model = getModelByRole(role);
    const user = await Model.findByPk(id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    const userWithoutPassword = user.toJSON();
    delete userWithoutPassword.password_hash;
    
    res.json({ user: userWithoutPassword, role });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  registerWithPassword,
  loginWithPassword,
  sendOTPHandler,
  verifyOTPAndRegister,
  verifyOTPAndLogin,
  getMe
};
