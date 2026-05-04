import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import RecipeCard from '../components/RecipeCard';
import SearchBar from '../components/SearchBar';
import { favoriteApi, recipeApi } from '../services/api';
import { useAuth } from '../context/AuthContext';

const HomePage = () => {
  const { user } = useAuth();
  const [recipes, setRecipes] = useState([]);
  const [filters, setFilters] = useState({ search: '', category: '', difficulty: '' });
  const [pageInfo, setPageInfo] = useState({ page: 1, pages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadRecipes = async () => {
      setLoading(true);
      setError('');

      try {
        const response = await recipeApi.list({ ...filters, page: pageInfo.page, limit: 12 });
        setRecipes(response.recipes);
        setPageInfo({ page: response.page, pages: response.pages, total: response.total });
      } catch (requestError) {
        setError(requestError.message);
      } finally {
        setLoading(false);
      }
    };

    loadRecipes();
  }, [filters, pageInfo.page]);

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setPageInfo((current) => ({ ...current, page: 1 }));
    setFilters((current) => ({ ...current, [name]: value }));
  };

  const handleFavoriteToggle = async (recipeId) => {
    if (!user) return;
    await favoriteApi.toggle(recipeId);
    const response = await recipeApi.list({ ...filters, page: pageInfo.page, limit: 12 });
    setRecipes(response.recipes);
  };

  return (
    <div className="page-shell">
      <section className="hero-card">
        <div>
          <p className="eyebrow">Community feed</p>
          <h1>Share recipes like a social stream.</h1>
          <p className="hero-copy">
            Discover community dishes, favorite what you love, and manage your own recipe posts with full ownership.
          </p>
        </div>
        <div className="hero-actions">
          <Link className="primary-button" to={user ? '/recipes/new' : '/register'}>
            {user ? 'Create Recipe' : 'Join the kitchen'}
          </Link>
          <Link className="ghost-button" to="/favorites">
            View Favorites
          </Link>
        </div>
      </section>

      <SearchBar filters={filters} onChange={handleFilterChange} />

      {loading ? <div className="center-panel">Loading recipes...</div> : null}
      {error ? <div className="center-panel error-panel">{error}</div> : null}

      <section className="recipe-grid">
        {recipes.map((recipe) => (
          <RecipeCard key={recipe._id} recipe={recipe} onFavoriteToggle={handleFavoriteToggle} />
        ))}
      </section>

      {!loading && recipes.length === 0 ? <div className="center-panel">No recipes matched your filters.</div> : null}

      <div className="pagination-row">
        <button
          className="ghost-button"
          type="button"
          disabled={pageInfo.page <= 1}
          onClick={() => setPageInfo((current) => ({ ...current, page: current.page - 1 }))}
        >
          Previous
        </button>
        <span>
          Page {pageInfo.page} of {pageInfo.pages}
        </span>
        <button
          className="ghost-button"
          type="button"
          disabled={pageInfo.page >= pageInfo.pages}
          onClick={() => setPageInfo((current) => ({ ...current, page: current.page + 1 }))}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default HomePage;
