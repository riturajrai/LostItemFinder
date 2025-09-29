const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const { s3, BUCKET_NAME } = require('../utils/s3');
const QR = require('../models/QR');
const QRContact = require('../models/QRContact');

// Fetch all serial numbers for static generation
router.get('/serial-numbers', async (req, res) => {
  try {
    const qrContacts = await QRContact.find({}, 'serialNumber');
    const serialNumbers = qrContacts.map((contact) => contact.serialNumber);
    res.json({ success: true, serialNumbers });
  } catch (err) {
    console.error('Fetch Serial Numbers Error:', {
      error: err.message,
    });
    res.status(500).json({ message: 'Failed to fetch serial numbers' });
  }
});

// Upload or update QR and Contact Details
router.post('/upload-qr', authMiddleware, async (req, res) => {
    try {
        const { image, serialNumber, contactDetails } = req.body;
        if (!image || !serialNumber || !contactDetails || !contactDetails.name || !contactDetails.email) {
            return res.status(400).json({ message: 'Image, serial number, name, and email are required' });
        }

        // Validate serialNumber format
        if (typeof serialNumber !== 'string' || serialNumber.trim().length === 0) {
            return res.status(400).json({ message: 'Invalid serial number' });
        }

        const key = `qr-${req.user.id}.png`;
        const buffer = Buffer.from(image.replace(/^data:image\/\w+;base64,/, ""), 'base64');
        const params = {
            Bucket: BUCKET_NAME,
            Key: key,
            Body: buffer,
            ContentEncoding: 'base64',
            ContentType: 'image/png',
        };
        const uploadResult = await s3.upload(params).promise();

        // Check if user already has a QR
        let qr = await QR.findOne({ user: req.user.id });
        if (qr) {
            qr.qrImageUrl = uploadResult.Location;
            qr.serialNumber = serialNumber;
            await qr.save();
        } else {
            qr = await QR.create({ qrImageUrl: uploadResult.Location, serialNumber, user: req.user.id });
        }

        // Handle QRContact
        let qrContact = await QRContact.findOne({ user: req.user.id });
        if (qrContact) {
            qrContact.serialNumber = serialNumber;
            qrContact.contactDetails = contactDetails;
            await qrContact.save();
        } else {
            await QRContact.create({
                serialNumber,
                user: req.user.id,
                qr: qr._id,
                contactDetails,
            });
        }

        res.json({ success: true, data: { qrImageUrl: uploadResult.Location, serialNumber, contactDetails } });
    } catch (err) {
        console.error('QR Upload Error:', {
            error: err.message,
            userId: req.user?.id,
            serialNumber: req.body.serialNumber,
        });
        res.status(500).json({ message: 'Failed to upload QR' });
    }
});

// Fetch QR and Contact Details
router.get('/my-qr', authMiddleware, async (req, res) => {
    try {
        const qr = await QR.findOne({ user: req.user.id });
        if (!qr) return res.status(404).json({ message: 'QR not found' });

        const qrContact = await QRContact.findOne({ user: req.user.id });
        const contactDetails = qrContact ? qrContact.contactDetails : null;

        res.json({ 
            success: true, 
            qrImageUrl: qr.qrImageUrl, 
            serialNumber: qr.serialNumber,
            contactDetails 
        });
    } catch (err) {
        console.error('Fetch QR Error:', {
            error: err.message,
            userId: req.user?.id,
        });
        res.status(500).json({ message: 'Server error' });
    }
});

// Update Contact Details
router.put('/update-contact', authMiddleware, async (req, res) => {
    try {
        const { contactDetails } = req.body;
        if (!contactDetails || !contactDetails.name || !contactDetails.email) {
            return res.status(400).json({ message: 'Name and email are required' });
        }

        const qrContact = await QRContact.findOne({ user: req.user.id });
        if (!qrContact) {
            return res.status(404).json({ message: 'Contact details not found' });
        }

        qrContact.contactDetails = contactDetails;
        await qrContact.save();

        res.json({ success: true, contactDetails: qrContact.contactDetails });
    } catch (err) {
        console.error('Update Contact Error:', {
            error: err.message,
            userId: req.user?.id,
        });
        res.status(500).json({ message: 'Failed to update contact details' });
    }
});

// Public Get Contact Details by Serial Number
router.get('/contact/:serialNumber', async (req, res) => {
    try {
        const { serialNumber } = req.params;
        if (!serialNumber || typeof serialNumber !== 'string' || serialNumber.trim().length === 0) {
            return res.status(400).json({ message: 'Invalid serial number' });
        }

        const qrContact = await QRContact.findOne({ serialNumber }).populate('user', 'name email');
        if (!qrContact) {
            return res.status(404).json({ message: 'Contact details not found' });
        }

        res.json({ 
            success: true, 
            contactDetails: {
                name: qrContact.contactDetails.name,
                email: qrContact.contactDetails.email,
                number: qrContact.contactDetails.number || '',
                address: qrContact.contactDetails.address || '',
            }
        });
    } catch (err) {
        console.error('Fetch Public Contact Error:', {
            error: err.message,
            serialNumber: req.params.serialNumber,
        });
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete QR and Contact Details
router.delete('/delete-qr', authMiddleware, async (req, res) => {
    try {
        const qr = await QR.findOne({ user: req.user.id });
        if (!qr) return res.status(404).json({ message: 'QR not found' });

        await s3.deleteObject({ Bucket: BUCKET_NAME, Key: `qr-${req.user.id}.png` }).promise();
        await QR.deleteOne({ user: req.user.id });
        await QRContact.deleteOne({ user: req.user.id });

        res.json({ success: true, message: 'QR and contact details deleted successfully' });
    } catch (err) {
        console.error('Delete QR Error:', {
            error: err.message,
            userId: req.user?.id,
        });
        res.status(500).json({ message: 'Failed to delete QR' });
    }
});

module.exports = router;