const express = require('express');
const { protect, adminOnly } = require('../middleware/auth');
const { getAllUsers } = require('../controllers/adminController');

const router = express.Router();

router.get('/users', protect, adminOnly, getAllUsers);

module.exports = router;
