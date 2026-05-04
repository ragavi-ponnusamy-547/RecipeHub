import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const RecipeCard = ({ recipe, onFavoriteToggle, favoriteLabel = 'Favorite' }) => {
  const { user } = useAuth();
  const isFavorited = user && recipe.favorites?.some((favorite) => String(favorite) === String(user.id || user._id));
  const averageRating = recipe.averageRating ?? 0;

  return (
    <article className="recipe-card">
      <Link to={`/recipes/${recipe._id}`} className="recipe-image-link">
        <img src={recipe.imageUrl} alt={recipe.title} className="recipe-image" />
      </Link>
      <div className="recipe-card-body">
        <div className="recipe-meta-row">
          <div className="creator-block">
            <img src={recipe.userProfilePic} alt={recipe.username} />
            <div>
              <span>@{recipe.username}</span>
              <strong>{recipe.title}</strong>
            </div>
          </div>
          <span className="rating-pill">{averageRating.toFixed(1)} ★</span>
        </div>

        <div className="recipe-tags">
          <span>{recipe.category}</span>
          <span>{recipe.difficulty}</span>
          <span>{recipe.cookingTime} min</span>
        </div>

        <div className="recipe-actions">
          <Link className="ghost-button" to={`/recipes/${recipe._id}`}>
            Open
          </Link>
          {user && (
            <button className="primary-button" type="button" onClick={() => onFavoriteToggle?.(recipe._id)}>
              {isFavorited ? 'Remove Favorite' : favoriteLabel}
            </button>
          )}
        </div>
      </div>
    </article>
  );
};

export default RecipeCard;
