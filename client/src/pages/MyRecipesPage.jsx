import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MyRecipeCard from '../components/MyRecipeCard';
import { recipeApi } from '../services/api';
import { useAuth } from '../context/AuthContext';

const MyRecipesPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const userId = user?.id || user?._id;

  useEffect(() => {
    const loadRecipes = async () => {
      setLoading(true);
      setError('');

      try {
        const response = await recipeApi.list({ limit: 1000 });
        const ownRecipes = response.recipes.filter((recipe) => String(recipe.createdBy) === String(userId));
        setRecipes(ownRecipes);
      } catch (requestError) {
        setError(requestError.message);
      } finally {
        setLoading(false);
      }
    };

    loadRecipes();
  }, [userId]);

  const totalRecipes = useMemo(() => recipes.length, [recipes]);

  const handleDelete = async (recipeId) => {
    if (!window.confirm('Delete this recipe?')) {
      return;
    }

    await recipeApi.remove(recipeId);
    setRecipes((current) => current.filter((recipe) => recipe._id !== recipeId));
  };

  return (
    <div className="page-shell">
      <section className="hero-card compact">
        <div>
          <p className="eyebrow">My Recipes</p>
          <h1>Your recipe collection</h1>
          <p className="hero-copy">Edit or delete only the recipes you created. Other users' recipes stay protected.</p>
        </div>
        <div className="hero-actions">
          <button className="primary-button" type="button" onClick={() => navigate('/recipes/new')}>
            Add Recipe
          </button>
          <span className="muted-text">{totalRecipes} recipes</span>
        </div>
      </section>

      {loading ? <div className="center-panel">Loading your recipes...</div> : null}
      {error ? <div className="center-panel error-panel">{error}</div> : null}

      <section className="recipe-grid">
        {recipes.map((recipe) => (
          <MyRecipeCard key={recipe._id} recipe={recipe} onDelete={handleDelete} />
        ))}
      </section>

      {!loading && recipes.length === 0 ? <div className="center-panel">You have not created any recipes yet.</div> : null}
    </div>
  );
};

export default MyRecipesPage;