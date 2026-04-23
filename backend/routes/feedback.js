const express = require('express');
const router = express.Router();
const Feedback = require('../models/Feedback');
const User = require('../models/User');
const AdminReply = require('../models/AdminReply');
const { auth, adminAuth } = require('../middleware/auth');
const nodemailer = require('nodemailer');

// Configure Email Transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Submit Feedback
router.post('/submit', auth, async (req, res) => {
    try {
        const { issueType, description, location } = req.body;
        const feedback = new Feedback({
            userId: req.user.id,
            userName: req.user.name,
            issueType,
            description,
            location
        });
        await feedback.save();

        // Send Email to Admin
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: process.env.ADMIN_EMAIL,
            subject: `New Feedback: ${issueType}`,
            text: `User: ${req.user.name}\nType: ${issueType}\nLocation: ${location}\nDescription: ${description}`
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) console.log('Email Error:', error);
            else console.log('Email sent:', info.response);
        });

        res.status(201).json({ message: 'Feedback submitted successfully', feedback });
    } catch (error) {
        res.status(500).json({ message: 'Feedback submission failed', error: error.message });
    }
});

// Get User's Feedback
router.get('/my-feedback', auth, async (req, res) => {
    try {
        const feedback = await Feedback.find({ userId: req.user.id }).sort({ createdAt: -1 });
        res.json(feedback);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch feedback', error: error.message });
    }
});

// Admin: Get All Feedback
router.get('/all', adminAuth, async (req, res) => {
    try {
        const feedback = await Feedback.find().populate('userId', 'name email').sort({ createdAt: -1 });
        res.json(feedback);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch all feedback', error: error.message });
    }
});

// Admin: Get Dashboard Stats
router.get('/stats', adminAuth, async (req, res) => {
    try {
        const totalUsers = await User.countDocuments({ role: 'user' });
        const totalFeedback = await Feedback.countDocuments();
        const pendingFeedback = await Feedback.countDocuments({ status: 'Pending' });
        const solvedFeedback = await Feedback.countDocuments({ status: 'Solved' });
        res.json({ totalUsers, totalFeedback, pendingFeedback, solvedFeedback });
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch stats', error: error.message });
    }
});

// Admin: Update Status or Reply
router.patch('/update/:id', adminAuth, async (req, res) => {
    try {
        const { status, adminReply } = req.body;
        
        // Check current status
        const currentFeedback = await Feedback.findById(req.params.id);
        if (!currentFeedback) return res.status(404).json({ message: 'Feedback not found' });
        
        if (currentFeedback.status === 'Solved') {
            return res.status(400).json({ message: 'Cannot update a report that is already solved' });
        }

        // Update the main Feedback record
        const feedback = await Feedback.findByIdAndUpdate(req.params.id, { status, adminReply }, { new: true });

        // Save a record in the new AdminReply collection if there's a reply message
        if (adminReply) {
            const reply = new AdminReply({
                feedbackId: req.params.id,
                adminId: req.user.id,
                adminName: req.user.name,
                message: adminReply
            });
            await reply.save();
        }

        res.json({ message: 'Feedback updated and reply logged', feedback });
    } catch (error) {
        res.status(500).json({ message: 'Update failed', error: error.message });
    }
});

module.exports = router;
