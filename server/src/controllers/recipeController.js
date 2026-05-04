const asyncHandler = require('../utils/asyncHandler');
const Recipe = require('../models/Recipe');

const parseIngredients = (ingredients) => {
  if (Array.isArray(ingredients)) {
    return ingredients.filter(Boolean).map((item) => String(item).trim());
  }

  if (typeof ingredients === 'string') {
    return ingredients
      .split('\n')
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
};

const canManageRecipe = (recipe, user) => user.role === 'admin' || recipe.createdBy.toString() === user._id.toString();

const getRecipes = asyncHandler(async (req, res) => {
  const { search = '', category, difficulty, page = 1, limit = 12 } = req.query;
  const filter = {};

  if (search) {
    filter.title = { $regex: search, $options: 'i' };
  }

  if (category) {
    filter.category = category;
  }

  if (difficulty) {
    filter.difficulty = difficulty;
  }

  const pageNumber = Math.max(Number(page) || 1, 1);
  const limitNumber = Math.max(Number(limit) || 12, 1);
  const skip = (pageNumber - 1) * limitNumber;

  const [recipes, total] = await Promise.all([
    Recipe.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limitNumber),
    Recipe.countDocuments(filter),
  ]);

  res.json({
    recipes,
    page: pageNumber,
    pages: Math.ceil(total / limitNumber) || 1,
    total,
  });
});

const getRecipeById = asyncHandler(async (req, res) => {
  const recipe = await Recipe.findById(req.params.id);

  if (!recipe) {
    return res.status(404).json({ message: 'Recipe not found' });
  }

  res.json({ recipe });
});

const createRecipe = asyncHandler(async (req, res) => {
  const { title, imageUrl, category, difficulty, cookingTime, ingredients, instructions } = req.body;

  if (!title || !imageUrl || !category || !difficulty || !cookingTime || !instructions) {
    return res.status(400).json({ message: 'Missing required recipe fields' });
  }

  const recipe = await Recipe.create({
    title,
    imageUrl,
    category,
    difficulty,
    cookingTime: Number(cookingTime),
    ingredients: parseIngredients(ingredients),
    instructions,
    createdBy: req.user._id,
    username: req.user.username,
    userProfilePic: req.user.profilePic,
  });

  res.status(201).json({ recipe });
});

const updateRecipe = asyncHandler(async (req, res) => {
  const recipe = await Recipe.findById(req.params.id);

  if (!recipe) {
    return res.status(404).json({ message: 'Recipe not found' });
  }

  if (!canManageRecipe(recipe, req.user)) {
    return res.status(403).json({ message: 'You can only edit your own recipes' });
  }

  const fieldsToUpdate = ['title', 'imageUrl', 'category', 'difficulty', 'cookingTime', 'instructions'];

  fieldsToUpdate.forEach((field) => {
    if (req.body[field] !== undefined) {
      recipe[field] = field === 'cookingTime' ? Number(req.body[field]) : req.body[field];
    }
  });

  if (req.body.ingredients !== undefined) {
    recipe.ingredients = parseIngredients(req.body.ingredients);
  }

  const updatedRecipe = await recipe.save();
  res.json({ recipe: updatedRecipe });
});

const deleteRecipe = asyncHandler(async (req, res) => {
  const recipe = await Recipe.findById(req.params.id);

  if (!recipe) {
    return res.status(404).json({ message: 'Recipe not found' });
  }

  if (!canManageRecipe(recipe, req.user)) {
    return res.status(403).json({ message: 'You can only delete your own recipes' });
  }

  await recipe.deleteOne();
  res.json({ message: 'Recipe deleted successfully' });
});

const addComment = asyncHandler(async (req, res) => {
  const { text } = req.body;
  const recipe = await Recipe.findById(req.params.id);

  if (!recipe) {
    return res.status(404).json({ message: 'Recipe not found' });
  }

  if (!text || !text.trim()) {
    return res.status(400).json({ message: 'Comment text is required' });
  }

  recipe.comments.push({
    user: req.user._id,
    username: req.user.username,
    profilePic: req.user.profilePic,
    text: text.trim(),
  });

  await recipe.save();
  res.status(201).json({ comments: recipe.comments });
});

const addRating = asyncHandler(async (req, res) => {
  const { value } = req.body;
  const ratingValue = Number(value);
  const recipe = await Recipe.findById(req.params.id);

  if (!recipe) {
    return res.status(404).json({ message: 'Recipe not found' });
  }

  if (!Number.isInteger(ratingValue) || ratingValue < 1 || ratingValue > 5) {
    return res.status(400).json({ message: 'Rating must be an integer between 1 and 5' });
  }

  const existingRating = recipe.ratings.find((rating) => rating.user.toString() === req.user._id.toString());

  if (existingRating) {
    existingRating.value = ratingValue;
  } else {
    recipe.ratings.push({ user: req.user._id, value: ratingValue });
  }

  await recipe.save();
  res.json({ ratings: recipe.ratings, averageRating: recipe.averageRating });
});

const toggleFavorite = asyncHandler(async (req, res) => {
  const recipe = await Recipe.findById(req.params.recipeId);

  if (!recipe) {
    return res.status(404).json({ message: 'Recipe not found' });
  }

  const favoriteIndex = recipe.favorites.findIndex((favorite) => favorite.toString() === req.user._id.toString());

  if (favoriteIndex >= 0) {
    recipe.favorites.splice(favoriteIndex, 1);
  } else {
    recipe.favorites.push(req.user._id);
  }

  await recipe.save();
  res.json({ isFavorited: favoriteIndex < 0, favoritesCount: recipe.favorites.length });
});

const getFavorites = asyncHandler(async (req, res) => {
  const recipes = await Recipe.find({ favorites: req.user._id }).sort({ createdAt: -1 });
  res.json({ recipes });
});

module.exports = {
  getRecipes,
  getRecipeById,
  createRecipe,
  updateRecipe,
  deleteRecipe,
  addComment,
  addRating,
  toggleFavorite,
  getFavorites,
};
