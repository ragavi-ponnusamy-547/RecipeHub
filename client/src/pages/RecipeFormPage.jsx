import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { recipeApi } from '../services/api';

const emptyForm = {
  title: '',
  imageUrl: '',
  category: 'Indian',
  difficulty: 'Easy',
  cookingTime: 30,
  ingredients: '',
  instructions: '',
};

const RecipeFormPage = () => {
  const { id } = useParams();
  const isEditing = Boolean(id);
  const navigate = useNavigate();
  const [formData, setFormData] = useState(emptyForm);
  const [loading, setLoading] = useState(isEditing);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadRecipe = async () => {
      if (!isEditing) {
        setLoading(false);
        return;
      }

      try {
        const response = await recipeApi.getById(id);
        const recipe = response.recipe;
        setFormData({
          title: recipe.title,
          imageUrl: recipe.imageUrl,
          category: recipe.category,
          difficulty: recipe.difficulty,
          cookingTime: recipe.cookingTime,
          ingredients: recipe.ingredients.join('\n'),
          instructions: recipe.instructions,
        });
      } catch (requestError) {
        setError(requestError.message);
      } finally {
        setLoading(false);
      }
    };

    loadRecipe();
  }, [id, isEditing]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      if (isEditing) {
        await recipeApi.update(id, formData);
      } else {
        await recipeApi.create(formData);
      }

      navigate(isEditing ? `/recipes/${id}` : '/');
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="page-shell center-panel">Loading form...</div>;
  }

  return (
    <div className="page-shell">
      <form className="auth-card recipe-form" onSubmit={handleSubmit}>
        <p className="eyebrow">{isEditing ? 'Update recipe' : 'Add recipe'}</p>
        <h2>{isEditing ? 'Edit your recipe' : 'Create a new recipe'}</h2>
        <div className="form-grid">
          <label>
            Recipe name
            <input type="text" name="title" value={formData.title} onChange={handleChange} required />
          </label>
          <label>
            Image URL
            <input type="url" name="imageUrl" value={formData.imageUrl} onChange={handleChange} required />
          </label>
          <label>
            Category
            <select name="category" value={formData.category} onChange={handleChange}>
              <option value="Indian">Indian</option>
              <option value="Western">Western</option>
            </select>
          </label>
          <label>
            Difficulty
            <select name="difficulty" value={formData.difficulty} onChange={handleChange}>
              <option value="Easy">Easy</option>
              <option value="Moderate">Moderate</option>
              <option value="Hard">Hard</option>
            </select>
          </label>
          <label>
            Cooking time (minutes)
            <input type="number" min="1" name="cookingTime" value={formData.cookingTime} onChange={handleChange} required />
          </label>
        </div>
        <label>
          Ingredients
          <textarea
            rows="5"
            name="ingredients"
            value={formData.ingredients}
            onChange={handleChange}
            placeholder="One ingredient per line"
          />
        </label>
        <label>
          Preparation steps
          <textarea rows="8" name="instructions" value={formData.instructions} onChange={handleChange} required />
        </label>
        {error ? <p className="form-error">{error}</p> : null}
        <div className="action-row">
          <Link className="ghost-button" to={isEditing ? `/recipes/${id}` : '/'}>
            Cancel
          </Link>
          <button className="primary-button" type="submit" disabled={submitting}>
            {submitting ? 'Saving...' : isEditing ? 'Update Recipe' : 'Publish Recipe'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default RecipeFormPage;
