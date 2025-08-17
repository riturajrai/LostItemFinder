const nodemailer = require("nodemailer");

// Configure transporter with Hostinger SMTP
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

// Modern email template styles
const emailStyles = `
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
    
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
      line-height: 1.6;
      color: #374151;
      background-color: #f3f4f6;
      margin: 0;
      padding: 0;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }
    .email-container {
      max-width: 600px;
      margin: 0 auto;
      background: #ffffff;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    }
    .header {
      background: linear-gradient(135deg, #047857 0%, #059669 100%);
      padding: 32px 20px;
      text-align: center;
    }
    .logo {
      color: #ffffff;
      font-size: 24px;
      font-weight: 700;
      margin: 0;
      display: inline-flex;
      align-items: center;
      gap: 8px;
    }
    .logo-icon {
      width: 24px;
      height: 24px;
    }
    .content {
      padding: 32px;
    }
    .greeting {
      font-size: 18px;
      font-weight: 600;
      color: #111827;
      margin-top: 0;
      margin-bottom: 24px;
    }
    .text {
      font-size: 14px;
      color: #4b5563;
      margin-bottom: 20px;
      line-height: 1.5;
    }
    .otp-container {
      background: #f9fafb;
      border-radius: 8px;
      padding: 16px;
      margin: 24px 0;
      text-align: center;
    }
    .otp-code {
      font-family: 'Courier New', monospace;
      font-size: 32px;
      letter-spacing: 8px;
      color: #047857;
      font-weight: 700;
      margin: 0;
      padding: 8px 0;
    }
    .otp-note {
      font-size: 12px;
      color: #6b7280;
      margin-top: 8px;
    }
    .button {
      display: inline-block;
      padding: 12px 24px;
      background: linear-gradient(135deg, #047857 0%, #059669 100%);
      color: #ffffff !important;
      text-decoration: none;
      border-radius: 8px;
      font-weight: 600;
      font-size: 14px;
      margin: 16px 0;
      text-align: center;
      box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
      transition: all 0.2s ease;
    }
    .button:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    }
    .footer {
      margin-top: 32px;
      padding-top: 24px;
      border-top: 1px solid #e5e7eb;
      text-align: center;
      font-size: 12px;
      color: #9ca3af;
    }
    .social-links {
      display: flex;
      justify-content: center;
      gap: 16px;
      margin: 20px 0;
    }
    .social-link {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background-color: #f3f4f6;
      transition: all 0.2s ease;
    }
    .social-link:hover {
      background-color: #e5e7eb;
      transform: translateY(-2px);
    }
    .social-icon {
      width: 16px;
      height: 16px;
    }
    .list {
      padding-left: 20px;
      margin: 16px 0;
    }
    .list-item {
      font-size: 14px;
      color: #4b5563;
      margin-bottom: 8px;
      line-height: 1.5;
    }
    .support-link {
      color: #047857;
      text-decoration: none;
      font-weight: 500;
    }
    .support-link:hover {
      text-decoration: underline;
    }
  </style>
`;

// Social media icons with brand colors
const socialIcons = `
  <div class="social-links">
    <a href="https://facebook.com/lostitemfinder" class="social-link" target="_blank" style="color: #1877F2;">
      <svg class="social-icon" viewBox="0 0 24 24" fill="currentColor">
        <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"/>
      </svg>
    </a>
    <a href="https://twitter.com/lostitemfinder" class="social-link" target="_blank" style="color: #1DA1F2;">
      <svg class="social-icon" viewBox="0 0 24 24" fill="currentColor">
        <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"/>
      </svg>
    </a>
    <a href="https://instagram.com/lostitemfinder" class="social-link" target="_blank" style="color: #E4405F;">
      <svg class="social-icon" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
      </svg>
    </a>
    <a href="https://linkedin.com/company/lostitemfinder" class="social-link" target="_blank" style="color: #0A66C2;">
      <svg class="social-icon" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
      </svg>
    </a>
  </div>
`;

// Send OTP email for signup verification
const sendOtpEmail = async (email, otp) => {
  try {
    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verify Your Email - Lost Item Finder</title>
        ${emailStyles}
      </head>
      <body>
        <div class="email-container">
          <div class="header">
            <h1 class="logo">
              <svg class="logo-icon" viewBox="0 0 24 24" fill="white">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
              </svg>
              Lost Item Finder
            </h1>
          </div>
          <div class="content">
            <h2 class="greeting">Verify Your Email Address</h2>
            <p class="text">Thank you for signing up with Lost Item Finder. To complete your registration, please enter the following One-Time Password (OTP) on the verification page:</p>
            
            <div class="otp-container">
              <p class="otp-code">${otp}</p>
              <p class="otp-note">This code will expire in 10 minutes</p>
            </div>
            
            <p class="text">If you didn't request this code, you can safely ignore this email. Someone else might have entered your email address by mistake.</p>
            
            <p class="text">Need help? <a href="mailto:support@lostitemfinder.com" class="support-link">Contact our support team</a></p>
            
            ${socialIcons}
            
            <div class="footer">
              <p>© ${new Date().getFullYear()} Lost Item Finder. All rights reserved.</p>
              <p>123 Finder Street, Digital City, 100001</p>
              <p><a href="https://lostitemfinder.com" style="color: #9ca3af; text-decoration: none;">Visit our website</a></p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    await transporter.sendMail({
      from: '"Lost Item Finder" <noreply@lostitemfinder.com>',
      to: email,
      subject: "Your Verification Code - Lost Item Finder",
      text: `Your verification code is: ${otp}\n\nThis code will expire in 10 minutes. Please enter it on the verification page to complete your account setup.\n\nIf you didn't request this code, please ignore this email or contact support if you have questions.\n\nLost Item Finder Team\n123 Finder Street, Digital City, 100001\nhttps://lostitemfinder.com`,
      html: emailHtml,
    });
    return true;
  } catch (error) {
    console.error("Error sending OTP email:", error);
    throw new Error("Failed to send OTP email");
  }
};

// Send welcome email for signup
const sendWelcomeEmail = async (email, name) => {
  try {
    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to Lost Item Finder</title>
        ${emailStyles}
      </head>
      <body>
        <div class="email-container">
          <div class="header">
            <h1 class="logo">
              <svg class="logo-icon" viewBox="0 0 24 24" fill="white">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
              </svg>
              Lost Item Finder
            </h1>
          </div>
          <div class="content">
            <h2 class="greeting">Welcome, ${name}!</h2>
            <p class="text">Thank you for joining Lost Item Finder. We're thrilled to have you as part of our community dedicated to reuniting people with their lost belongings.</p>
            
            <p class="text">Here's what you can do with your account:</p>
            <ul class="list">
              <li class="list-item">Report lost items with detailed descriptions and photos</li>
              <li class="list-item">Search our database for found items matching your lost items</li>
              <li class="list-item">Receive notifications when potential matches are found</li>
              <li class="list-item">Help others by reporting found items</li>
              <li class="list-item">Connect securely with finders through our platform</li>
            </ul>
            
            <a href="https://lostitemfinder.com/dashboard" class="button">Go to Your Dashboard</a>
            
            <p class="text">We're committed to making the process of finding lost items as smooth as possible. If you have any questions or need assistance, our support team is always here to help.</p>
            
            ${socialIcons}
            
            <div class="footer">
              <p>© ${new Date().getFullYear()} Lost Item Finder. All rights reserved.</p>
              <p>123 Finder Street, Digital City, 100001</p>
              <p><a href="https://lostitemfinder.com/privacy" style="color: #9ca3af; text-decoration: none;">Privacy Policy</a> | <a href="https://lostitemfinder.com/terms" style="color: #9ca3af; text-decoration: none;">Terms of Service</a></p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    await transporter.sendMail({
      from: '"Lost Item Finder" <noreply@lostitemfinder.com>',
      to: email,
      subject: `Welcome to Lost Item Finder, ${name}!`,
      text: `Welcome to Lost Item Finder, ${name}!\n\nWe're excited to have you join our community dedicated to reuniting people with their lost belongings.\n\nWith your new account, you can:\n- Report lost items with detailed descriptions\n- Search our database for found items\n- Receive notifications for potential matches\n- Help others by reporting found items\n\nGet started now by visiting your dashboard: https://lostitemfinder.com/dashboard\n\nIf you have any questions, our support team is here to help.\n\nBest regards,\nThe Lost Item Finder Team\n123 Finder Street, Digital City, 100001\nhttps://lostitemfinder.com`,
      html: emailHtml,
    });
    return true;
  } catch (error) {
    console.error("Error sending welcome email:", error);
    throw new Error("Failed to send welcome email");
  }
};

// Send OTP email for password reset
const sendResetPasswordOtpEmail = async (email, otp) => {
  try {
    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Reset Your Password - Lost Item Finder</title>
        ${emailStyles}
      </head>
      <body>
        <div class="email-container">
          <div class="header">
            <h1 class="logo">
              <svg class="logo-icon" viewBox="0 0 24 24" fill="white">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
              </svg>
              Lost Item Finder
            </h1>
          </div>
          <div class="content">
            <h2 class="greeting">Reset Your Password</h2>
            <p class="text">We received a request to reset your password for your Lost Item Finder account. Please use the following One-Time Password (OTP) to proceed with resetting your password:</p>
            
            <div class="otp-container">
              <p class="otp-code">${otp}</p>
              <p class="otp-note">This code will expire in 10 minutes</p>
            </div>
            
            <p class="text">If you did not request a password reset, please ignore this email or contact our support team immediately to secure your account.</p>
            
            <p class="text">Need help? <a href="mailto:support@lostitemfinder.com" class="support-link">Contact our support team</a></p>
            
            ${socialIcons}
            
            <div class="footer">
              <p>© ${new Date().getFullYear()} Lost Item Finder. All rights reserved.</p>
              <p>123 Finder Street, Digital City, 100001</p>
              <p><a href="https://lostitemfinder.com" style="color: #9ca3af; text-decoration: none;">Visit our website</a></p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    await transporter.sendMail({
      from: '"Lost Item Finder" <noreply@lostitemfinder.com>',
      to: email,
      subject: "Password Reset Code - Lost Item Finder",
      text: `Your password reset code is: ${otp}\n\nThis code will expire in 10 minutes. Please enter it on the password reset page to set a new password.\n\nIf you did not request a password reset, please ignore this email or contact support if you have concerns.\n\nLost Item Finder Team\n123 Finder Street, Digital City, 100001\nhttps://lostitemfinder.com`,
      html: emailHtml,
    });
    return true;
  } catch (error) {
    console.error("Error sending reset password OTP email:", error);
    throw new Error("Failed to send reset password OTP email");
  }
};

module.exports = { transporter, sendOtpEmail, sendWelcomeEmail, sendResetPasswordOtpEmail };