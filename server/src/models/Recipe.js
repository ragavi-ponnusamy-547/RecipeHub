const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    username: { type: String, required: true },
    profilePic: { type: String, default: '' },
    text: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

const ratingSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    value: { type: Number, min: 1, max: 5, required: true },
  },
  { timestamps: true }
);

const recipeSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    imageUrl: { type: String, required: true, trim: true },
    category: { type: String, enum: ['Indian', 'Western'], required: true },
    difficulty: { type: String, enum: ['Easy', 'Moderate', 'Hard'], required: true },
    cookingTime: { type: Number, required: true, min: 1 },
    ingredients: [{ type: String, required: true, trim: true }],
    instructions: { type: String, required: true, trim: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    username: { type: String, required: true },
    userProfilePic: { type: String, required: true },
    ratings: [ratingSchema],
    comments: [commentSchema],
    favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  },
  { timestamps: true }
);

recipeSchema.virtual('averageRating').get(function averageRating() {
  if (!this.ratings.length) {
    return 0;
  }

  const total = this.ratings.reduce((sum, rating) => sum + rating.value, 0);
  return Number((total / this.ratings.length).toFixed(1));
});

recipeSchema.set('toJSON', { virtuals: true });
recipeSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Recipe', recipeSchema);
