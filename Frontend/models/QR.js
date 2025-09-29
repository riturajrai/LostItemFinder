const mongoose = require('mongoose');

const QrSchema = new mongoose.Schema({
    qrImageUrl: { type: String, required: true },
    serialNumber: { type: String, required: true },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    createdAt: { type: Date, default: Date.now }
});

const QR = mongoose.model('QR', QrSchema);
module.exports = QR;
