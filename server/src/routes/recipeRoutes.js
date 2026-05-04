const express = require('express');
const {
  getRecipes,
  getRecipeById,
  createRecipe,
  updateRecipe,
  deleteRecipe,
  addComment,
  addRating,
} = require('../controllers/recipeController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.get('/', getRecipes);
router.get('/:id', getRecipeById);
router.post('/', protect, createRecipe);
router.put('/:id', protect, updateRecipe);
router.delete('/:id', protect, deleteRecipe);
router.post('/:id/comment', protect, addComment);
router.post('/:id/rate', protect, addRating);

module.exports = router;
