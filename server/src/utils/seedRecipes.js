const Recipe = require('../models/Recipe');
const User = require('../models/User');

const seedRecipes = async () => {
  try {
    const recipeCount = await Recipe.countDocuments();
    if (recipeCount > 0) {
      console.log('Recipes already exist, skipping seed.');
      return;
    }

    const admin = await User.findOne({ role: 'admin' });
    if (!admin) {
      console.log('Admin user not found, skipping recipe seed.');
      return;
    }

    const sampleRecipes = [
      {
        title: 'Butter Chicken',
        imageUrl: 'https://images.unsplash.com/photo-1565937927026-fdf5dca89f47?auto=format&fit=crop&w=800&q=60',
        category: 'Indian',
        difficulty: 'Moderate',
        cookingTime: 45,
        ingredients: [
          '1 kg chicken, cut into pieces',
          '1 cup yogurt',
          '4 tbsp butter',
          '2 tbsp ginger-garlic paste',
          '1 cup tomato puree',
          '1/2 cup heavy cream',
          'Salt and spices to taste',
        ],
        instructions: 'Marinate chicken in yogurt and spices for 2 hours. Cook in butter until golden. Add tomato puree and simmer. Finish with cream.',
        createdBy: admin._id,
        username: admin.username,
        userProfilePic: admin.profilePic,
      },
      {
        title: 'Biryani',
        imageUrl: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a104?auto=format&fit=crop&w=800&q=60',
        category: 'Indian',
        difficulty: 'Hard',
        cookingTime: 60,
        ingredients: [
          '2 cups basmati rice',
          '1 kg mutton or chicken',
          '2 onions, sliced',
          '1/4 cup yogurt',
          '4 tbsp ghee',
          'Bay leaves, cardamom, cinnamon',
          'Salt to taste',
        ],
        instructions: 'Layer marinated meat and rice. Cook with ghee and spices in a sealed pot for 45 minutes.',
        createdBy: admin._id,
        username: admin.username,
        userProfilePic: admin.profilePic,
      },
      {
        title: 'Paneer Tikka',
        imageUrl: 'https://images.unsplash.com/photo-1599599810694-b5ac4dd33fbe?auto=format&fit=crop&w=800&q=60',
        category: 'Indian',
        difficulty: 'Easy',
        cookingTime: 30,
        ingredients: [
          '500g paneer, cubed',
          '1 cup yogurt',
          '2 tbsp ginger-garlic paste',
          '2 tbsp red chili powder',
          '1 tbsp lemon juice',
          'Bell peppers and onions',
          'Salt and spices to taste',
        ],
        instructions: 'Marinate paneer for 1 hour. Grill on skewers until golden. Serve hot with mint chutney.',
        createdBy: admin._id,
        username: admin.username,
        userProfilePic: admin.profilePic,
      },
      {
        title: 'Spaghetti Carbonara',
        imageUrl: 'https://images.unsplash.com/photo-1612874742237-6526221fcf2f?auto=format&fit=crop&w=800&q=60',
        category: 'Western',
        difficulty: 'Easy',
        cookingTime: 20,
        ingredients: [
          '400g spaghetti',
          '200g bacon, diced',
          '3 eggs',
          '100g parmesan cheese',
          'Black pepper',
          'Salt to taste',
        ],
        instructions: 'Cook pasta, fry bacon. Mix eggs and cheese. Combine everything quickly off heat.',
        createdBy: admin._id,
        username: admin.username,
        userProfilePic: admin.profilePic,
      },
      {
        title: 'Grilled Salmon',
        imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=60',
        category: 'Western',
        difficulty: 'Moderate',
        cookingTime: 25,
        ingredients: [
          '600g salmon fillet',
          '2 tbsp olive oil',
          '2 lemons',
          'Fresh herbs (dill, parsley)',
          'Salt and pepper to taste',
        ],
        instructions: 'Season salmon. Grill for 12-15 minutes. Serve with lemon and herbs.',
        createdBy: admin._id,
        username: admin.username,
        userProfilePic: admin.profilePic,
      },
    ];

    await Recipe.insertMany(sampleRecipes);
    console.log(`✓ ${sampleRecipes.length} sample recipes seeded successfully`);
  } catch (error) {
    console.error('Error seeding recipes:', error.message);
  }
};

module.exports = seedRecipes;
