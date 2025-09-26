const express = require('express');
const bcrypt = require('bcryptjs');
const database = require('../config/database');
const { authenticateToken, requireRole } = require('../middleware/auth');
const { validate, schemas } = require('../middleware/validation');

const router = express.Router();

// Get all users (Admin only)
router.get('/', authenticateToken, requireRole('admin'), (req, res) => {
  try {
    const users = database.getAllUsers().map(user => {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });

    res.json({
      success: true,
      data: {
        users,
        total: users.length
      }
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch users'
    });
  }
});

// Get current user profile
router.get('/profile', authenticateToken, (req, res) => {
  const { password, ...userWithoutPassword } = req.user;
  res.json({
    success: true,
    data: {
      user: userWithoutPassword
    }
  });
});

// Get user by ID (Admin only)
router.get('/:id', authenticateToken, requireRole('admin'), (req, res) => {
  try {
    const user = database.findUserById(req.params.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const { password, ...userWithoutPassword } = user;
    res.json({
      success: true,
      data: {
        user: userWithoutPassword
      }
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user'
    });
  }
});

// Update user (Admin can update any user, users can update themselves)
router.put('/:id', authenticateToken, validate(schemas.updateUser), async (req, res) => {
  try {
    const targetUserId = parseInt(req.params.id);
    const currentUser = req.user;

    // Check permissions
    if (currentUser.role !== 'admin' && currentUser.id !== targetUserId) {
      return res.status(403).json({
        success: false,
        message: 'You can only update your own profile'
      });
    }

    const user = database.findUserById(targetUserId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if email is being changed and if it's already taken
    if (req.body.email && req.body.email !== user.email) {
      const existingUser = database.findUserByEmail(req.body.email);
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'Email is already taken'
        });
      }
    }

    // Non-admin users cannot change their role
    if (currentUser.role !== 'admin' && req.body.role) {
      delete req.body.role;
    }

    const updatedUser = database.updateUser(targetUserId, req.body);
    const { password, ...userWithoutPassword } = updatedUser;

    res.json({
      success: true,
      message: 'User updated successfully',
      data: {
        user: userWithoutPassword
      }
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update user'
    });
  }
});

// Delete user (Admin only)
router.delete('/:id', authenticateToken, requireRole('admin'), (req, res) => {
  try {
    const user = database.deleteUser(req.params.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete user'
    });
  }
});

module.exports = router;