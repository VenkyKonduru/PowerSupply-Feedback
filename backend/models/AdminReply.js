const mongoose = require('mongoose');

const adminReplySchema = new mongoose.Schema({
    feedbackId: { type: mongoose.Schema.Types.ObjectId, ref: 'Feedback', required: true },
    adminId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    adminName: { type: String, required: true },
    message: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('AdminReply', adminReplySchema);
