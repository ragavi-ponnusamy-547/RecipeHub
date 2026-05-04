import { useEffect, useState } from 'react';
import RecipeCard from '../components/RecipeCard';
import { favoriteApi } from '../services/api';

const FavoritesPage = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadFavorites = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await favoriteApi.list();
      setRecipes(response.recipes);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFavorites();
  }, []);

  return (
    <div className="page-shell">
      <section className="hero-card compact">
        <div>
          <p className="eyebrow">Favorites</p>
          <h1>Your saved recipes</h1>
          <p className="hero-copy">Everything you marked as favorite appears here for quick access.</p>
        </div>
      </section>

      {loading ? <div className="center-panel">Loading favorites...</div> : null}
      {error ? <div className="center-panel error-panel">{error}</div> : null}

      <section className="recipe-grid">
        {recipes.map((recipe) => (
          <RecipeCard key={recipe._id} recipe={recipe} onFavoriteToggle={loadFavorites} favoriteLabel="Saved" />
        ))}
      </section>

      {!loading && recipes.length === 0 ? <div className="center-panel">No favorite recipes yet.</div> : null}
    </div>
  );
};

export default FavoritesPage;
