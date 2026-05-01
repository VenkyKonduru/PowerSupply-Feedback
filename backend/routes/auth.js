const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Register
router.post('/register', async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: 'User already exists' });

        // Logic for superadmin and admin approval
        let userRole = role || 'user';
        let approved = true;

        if (email === 'powersupplyfeedback@powerpulse.com') {
            userRole = 'admin';
            approved = true;
        } else if (userRole === 'admin') {
            if (!email.endsWith('@powerpulse.com')) {
                return res.status(400).json({ message: 'Admins must use a @powerpulse.com email address' });
            }
            approved = false;
        }

        const user = new User({ name, email, password, role: userRole, isApproved: approved });
        await user.save();
        res.status(201).json({ message: approved ? 'User registered successfully' : 'Admin registration successful. Pending approval from superadmin.' });
    } catch (error) {
        res.status(500).json({ message: 'Registration failed', error: error.message });
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const { email, password, role } = req.body;
        const trimmedEmail = email ? email.trim() : email;
        const user = await User.findOne({ email: trimmedEmail });
        if (!user) return res.status(400).json({ message: 'Invalid credentials' });

        if (role && user.role !== role) {
            return res.status(403).json({ message: 'Invalid credentials for the selected role' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        if (!user.isApproved) {
            return res.status(403).json({ message: 'Your account is pending approval from the superadmin.' });
        }

        const token = jwt.sign({ id: user._id, role: user.role, name: user.name, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
    } catch (error) {
        res.status(500).json({ message: 'Login failed', error: error.message });
    }
});

// Admin: Get all residents (excluding email/password)
const { adminAuth } = require('../middleware/auth');
router.get('/users', adminAuth, async (req, res) => {
    try {
        const users = await User.find({ role: 'user' }).select('name createdAt');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch users', error: error.message });
    }
});

// Superadmin: Get pending admins
router.get('/pending-admins', adminAuth, async (req, res) => {
    try {
        const admins = await User.find({ role: 'admin', isApproved: false }).select('name email createdAt');
        res.json(admins);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch pending admins', error: error.message });
    }
});

// Superadmin: Approve admin
router.patch('/approve-admin/:id', adminAuth, async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, { isApproved: true }, { new: true });
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json({ message: 'Admin approved successfully', user });
    } catch (error) {
        res.status(500).json({ message: 'Failed to approve admin', error: error.message });
    }
});

module.exports = router;
