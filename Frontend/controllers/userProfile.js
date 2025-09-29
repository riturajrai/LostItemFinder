const express = require('express');
const router = express.Router();
const User = require('../models/User');
const auth = require('../middleware/auth');
const nodemailer = require('nodemailer');

// Nodemailer transporter setup with SSL workaround
const transporter = nodemailer.createTransport({
  host: "smtp.hostinger.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER || "noreply@lostitemfinder.com",
    pass: process.env.EMAIL_PASS || "Riturajrai@9955",
  },
  tls: {
    rejectUnauthorized: false,
  },
});


// Generate 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// GET Profile
router.get('/users/profile', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    console.log(`[${new Date().toISOString()}] Fetching profile for userId: ${userId}`);

    const user = await User.findById(userId).select('-password -emailUpdateOTP -emailUpdateExpires');
    if (!user) {
      console.log(`[${new Date().toISOString()}] User not found: ${userId}`);
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      profile: {
        name: user.name || '',
        number: user.number || '',
        address: user.address || ''
      },
      user: {
        email: user.email
      },
    });
  } catch (err) {
    console.error(`[${new Date().toISOString()}] Profile fetch error:`, err);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST (Create Profile Data First Time)
router.post('/users/profile', auth, async (req, res) => {
  try {
    const { name, number, address } = req.body;
    const userId = req.user.id;

    console.log(`[${new Date().toISOString()}] Creating profile for userId: ${userId}`, { name, number, address });

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.number || user.address || user.name) {
      return res.status(400).json({ message: 'Profile already exists, use PATCH to update' });
    }

    user.name = name.trim();
    user.number = number.trim();
    user.address = address.trim();

    await user.save();

    res.status(201).json({
      message: 'Profile created successfully',
      profile: {
        name: user.name,
        number: user.number,
        address: user.address
      }
    });
  } catch (err) {
    console.error(`[${new Date().toISOString()}] Profile creation error:`, err);
    res.status(500).json({ message: 'Server error' });
  }
});

// PATCH (Update Profile Partially)
router.patch('/users/profile', auth, async (req, res) => {
  try {
    const { name, number, address } = req.body;
    const userId = req.user.id;

    console.log(`[${new Date().toISOString()}] Partially updating profile for userId: ${userId}`, { name, number, address });

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (name) user.name = name.trim();
    if (number) {
      const phoneRegex = /^\+?[1-9]\d{1,14}$/;
      if (!phoneRegex.test(number)) {
        return res.status(400).json({ message: 'Invalid phone number format' });
      }
      user.number = number.trim();
    }
    if (address) {
      if (address.length > 500) {
        return res.status(400).json({ message: 'Address is too long (max 500 characters)' });
      }
      user.address = address.trim();
    }

    await user.save();

    res.status(200).json({
      message: 'Profile updated successfully',
      profile: {
        name: user.name,
        number: user.number,
        address: user.address
      }
    });
  } catch (err) {
    console.error(`[${new Date().toISOString()}] Profile patch error:`, err);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST (Initiate Email Update with OTP)
router.post('/users/profile/email', auth, async (req, res) => {
  try {
    const { email } = req.body;
    const userId = req.user.id;

    console.log(`[${new Date().toISOString()}] Initiating email update for userId: ${userId}`, { email });

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!user.number) {
      return res.status(400).json({ message: 'Phone number required to update email' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    if (user.email === email) {
      return res.status(400).json({ message: 'New email must be different from current email' });
    }

    const otp = generateOTP();
    user.emailUpdateOTP = otp;
    user.emailUpdateExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
    user.newEmail = email;

    await user.save();

    // Send OTP to user's email (simulating SMS)
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: 'Email Update OTP',
      text: `Your OTP to update your email is ${otp}. It is valid for 10 minutes.`,
    };

    await transporter.sendMail(mailOptions);
    console.log(`[${new Date().toISOString()}] OTP sent to ${user.email} for email update`);

    res.status(200).json({ message: 'OTP sent to your email' });
  } catch (err) {
    console.error(`[${new Date().toISOString()}] Email update initiation error:`, err);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST (Verify OTP and Update Email)
router.post('/users/profile/verify-email-otp', auth, async (req, res) => {
  try {
    const { otp } = req.body;
    const userId = req.user.id;

    console.log(`[${new Date().toISOString()}] Verifying OTP for userId: ${userId}`, { otp });

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!user.emailUpdateOTP || !user.emailUpdateExpires || user.emailUpdateExpires < Date.now()) {
      return res.status(400).json({ message: 'OTP expired or invalid' });
    }

    if (user.emailUpdateOTP !== otp) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    user.email = user.newEmail;
    user.emailUpdateOTP = undefined;
    user.emailUpdateExpires = undefined;
    user.newEmail = undefined;

    await user.save();

    res.status(200).json({ message: 'Email updated successfully', email: user.email });
  } catch (err) {
    console.error(`[${new Date().toISOString()}] OTP verification error:`, err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;