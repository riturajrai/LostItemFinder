const mongoose = require('mongoose');

const QRContactSchema = new mongoose.Schema({
    serialNumber: {
        type: String,
        required: true,
        unique: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    qr: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'QR',
        required: true,
    },
    contactDetails: {
        name: { type: String, required: true },
        email: { type: String, required: true },
        number: { type: String, default: '' },
        address: { type: String, default: '' },
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('QRContact', QRContactSchema);