const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');
const router = express.Router();

// Rate limiting for auth routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // Development-friendly limit
  message: 'Too many authentication attempts, please try again later.'
});

router.use(authLimiter);

// Mock user storage (in production, use MongoDB)
const users = [];

// Register endpoint
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Basic validation
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Všetky polia sú povinné'
      });
    }

    // Check if user exists
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Užívateľ s týmto emailom už existuje'
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = {
      _id: Date.now().toString(),
      name,
      email,
      password: hashedPassword,
      createdAt: new Date()
    };

    users.push(user);

    // Generate JWT token
    const token = jwt.sign(
      { _id: user._id, email: user.email },
      process.env.JWT_SECRET || 'hecovacka-super-secret-jwt-key-for-production-32-chars',
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      message: 'Registrácia úspešná',
      data: {
        token,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email
        }
      }
    });

  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({
      success: false,
      message: 'Chyba servera pri registrácii'
    });
  }
});

// Login endpoint
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Basic validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email a heslo sú povinné'
      });
    }

    // Find user
    const user = users.find(u => u.email === email);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Neplatné prihlasovacie údaje'
      });
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: 'Neplatné prihlasovacie údaje'
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { _id: user._id, email: user.email },
      process.env.JWT_SECRET || 'hecovacka-super-secret-jwt-key-for-production-32-chars',
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      message: 'Prihlásenie úspešné',
      data: {
        token,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email
        }
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Chyba servera pri prihlásení'
    });
  }
});

module.exports = router;
