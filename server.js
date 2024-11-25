require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const cors = require('cors');
const nodemailer = require('nodemailer');
const crypto = require('crypto');  // For generating a unique verification token
const User = require('./js/User');

const app = express();
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));

// Set up Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',  // You can change this to another email provider if needed
  auth: {
    user: process.env.EMAIL_USER, // Your email address
    pass: process.env.EMAIL_PASS, // Your email password or App Password
  },
});

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect('process.env.MONGO_URI')

// Function to send email
const sendEmail = (to, subject, text) => {
  const mailOptions = {
    from: 'your-email@gmail.com',  // Your email
    to: to,                        // Recipient's email
    subject: subject,              // Email subject
    text: text,                    // Email body
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log('Error sending email:', error);
    } else {
      console.log('Email sent:', info.response);
    }
  });
};

// Registration endpoint
app.post('/register', async (req, res) => {
  const { regUsername, regEmail, regPassword } = req.body;

  if (!regUsername || !regEmail || !regPassword) {
    return res.status(400).json({ success: false, message: 'All fields are required.' });
  }

  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ email: regEmail });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email already exists.' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(regPassword, 10);

    // Create a new user
    const newUser = new User({
      username: regUsername,
      email: regEmail,
      password: hashedPassword,
      isEmailVerified: false, // Flag to track email verification status
    });

    await newUser.save();

    // Generate a unique email verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationUrl = `http://localhost:3000/verify-email?token=${verificationToken}`;

    // Send a verification email
    sendEmail(regEmail, 'Email Verification', `Please verify your email by clicking the following link: ${verificationUrl}`);

    res.status(201).json({
      success: true,
      message: 'Registration successful, please check your email to verify your account.',
    });
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ success: false, message: 'Server error', error });
  }
});

// Email verification endpoint
app.get('/verify-email', async (req, res) => {
  const { token } = req.query;

  if (!token) {
    return res.status(400).json({ success: false, message: 'Token is required.' });
  }

  try {
    // Verify the token and activate the user's account
    const user = await User.findOne({ verificationToken: token });

    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid or expired token.' });
    }

    user.isEmailVerified = true;
    user.verificationToken = undefined;  // Remove the token after verification
    await user.save();

    res.status(200).json({ success: true, message: 'Email verified successfully.' });
  } catch (error) {
    console.error('Error during email verification:', error);
    res.status(500).json({ success: false, message: 'Server error', error });
  }
});

// Sending post notifications via email (after verification)
app.post('/send-post', async (req, res) => {
  const { userId, postTitle, postContent } = req.body;

  if (!userId || !postTitle || !postContent) {
    return res.status(400).json({ success: false, message: 'User ID, post title, and content are required.' });
  }

  try {
    const user = await User.findById(userId);
    
    if (!user || !user.isEmailVerified) {
      return res.status(400).json({ success: false, message: 'User not found or email not verified.' });
    }

    // Send the post notification email
    sendEmail(
      user.email,
      `New Post: ${postTitle}`,
      `Hello ${user.username},\n\nHere is your new post:\n\nTitle: ${postTitle}\nContent: ${postContent}\n\nThank you for being with us!`
    );

    res.status(200).json({ success: true, message: 'Post notification sent to the user.' });
  } catch (error) {
    console.error('Error sending post notification:', error);
    res.status(500).json({ success: false, message: 'Server error', error });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
console.log('MONGO_URI:', process.env.MONGO_URI);
console.log('EMAIL_USER:', process.env.EMAIL_USER);