const express = require('express');
const { protect } = require('../middleware/auth');
const { toggleFavorite, getFavorites } = require('../controllers/recipeController');

const router = express.Router();

router.post('/:recipeId', protect, toggleFavorite);
router.get('/', protect, getFavorites);

module.exports = router;
