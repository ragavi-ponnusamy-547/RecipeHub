import { Link } from 'react-router-dom';

const MyRecipeCard = ({ recipe, onDelete }) => {
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
          <Link className="primary-button" to={`/recipes/${recipe._id}/edit`}>
            Edit
          </Link>
          <button className="ghost-button danger" type="button" onClick={() => onDelete(recipe._id)}>
            Delete
          </button>
        </div>
      </div>
    </article>
  );
};

export default MyRecipeCard;