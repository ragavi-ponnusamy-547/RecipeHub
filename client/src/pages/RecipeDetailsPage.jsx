import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { favoriteApi, recipeApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import CommentSection from '../components/CommentSection';
import RatingSystem from '../components/RatingSystem';

const RecipeDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadRecipe = async () => {
      setLoading(true);
      setError('');

      try {
        const response = await recipeApi.getById(id);
        setRecipe(response.recipe);
      } catch (requestError) {
        setError(requestError.message);
      } finally {
        setLoading(false);
      }
    };

    loadRecipe();
  }, [id]);

  const userRating = useMemo(() => {
    if (!recipe || !user) return 0;
    const existingRating = recipe.ratings?.find((rating) => String(rating.user) === String(user.id || user._id));
    return existingRating?.value || 0;
  }, [recipe, user]);

  const canEdit = Boolean(user && recipe && (user.role === 'admin' || String(recipe.createdBy) === String(user.id || user._id)));

  const refreshRecipe = async () => {
    const response = await recipeApi.getById(id);
    setRecipe(response.recipe);
  };

  const handleFavoriteToggle = async () => {
    await favoriteApi.toggle(id);
    await refreshRecipe();
  };

  const handleComment = async (text) => {
    await recipeApi.comment(id, text);
    await refreshRecipe();
  };

  const handleRate = async (value) => {
    await recipeApi.rate(id, value);
    await refreshRecipe();
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this recipe?')) {
      return;
    }

    await recipeApi.remove(id);
    navigate('/');
  };

  if (loading) {
    return <div className="page-shell center-panel">Loading recipe...</div>;
  }

  if (error) {
    return <div className="page-shell center-panel error-panel">{error}</div>;
  }

  if (!recipe) {
    return <div className="page-shell center-panel">Recipe not found.</div>;
  }

  const averageRating = recipe.averageRating || 0;

  return (
    <div className="page-shell detail-layout">
      <article className="detail-hero">
        <img src={recipe.imageUrl} alt={recipe.title} />
        <div className="detail-hero-copy">
          <div className="detail-topline">
            <div className="creator-block large">
              <img src={recipe.userProfilePic} alt={recipe.username} />
              <div>
                <span>@{recipe.username}</span>
                <strong>{recipe.title}</strong>
              </div>
            </div>
            <div className="detail-actions">
              {user ? (
                <button className="primary-button" type="button" onClick={handleFavoriteToggle}>
                  {recipe.favorites?.some((favorite) => String(favorite) === String(user.id || user._id))
                    ? 'Remove Favorite'
                    : 'Add to Favorites'}
                </button>
              ) : null}
              {canEdit ? (
                <>
                  <Link className="ghost-button" to={`/recipes/${recipe._id}/edit`}>
                    Edit
                  </Link>
                  <button className="ghost-button danger" type="button" onClick={handleDelete}>
                    Delete
                  </button>
                </>
              ) : null}
            </div>
          </div>

          <div className="recipe-tags">
            <span>{recipe.category}</span>
            <span>{recipe.difficulty}</span>
            <span>{recipe.cookingTime} min</span>
          </div>

          <RatingSystem
            averageRating={averageRating}
            totalRatings={recipe.ratings?.length || 0}
            canRate={Boolean(user)}
            userRating={userRating}
            onRate={handleRate}
          />
        </div>
      </article>

      <section className="detail-grid">
        <div className="content-panel">
          <h3>Ingredients</h3>
          <ul className="bullet-list">
            {recipe.ingredients.map((ingredient, index) => (
              <li key={`${ingredient}-${index}`}>{ingredient}</li>
            ))}
          </ul>
        </div>
        <div className="content-panel">
          <h3>Preparation Steps</h3>
          <p className="preformatted-text">{recipe.instructions}</p>
        </div>
      </section>

      <section className="content-panel">
        <CommentSection comments={recipe.comments} onAddComment={handleComment} />
      </section>
    </div>
  );
};

export default RecipeDetailsPage;
