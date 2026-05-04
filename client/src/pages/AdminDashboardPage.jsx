import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { adminApi, recipeApi } from '../services/api';

const AdminDashboardPage = () => {
  const [recipes, setRecipes] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadDashboard = async () => {
    setLoading(true);
    setError('');

    try {
      const [recipesResponse, usersResponse] = await Promise.all([
        recipeApi.list({ limit: 100 }),
        adminApi.users(),
      ]);

      setRecipes(recipesResponse.recipes);
      setUsers(usersResponse.users);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const handleDelete = async (recipeId) => {
    if (!window.confirm('Delete this recipe?')) {
      return;
    }

    await recipeApi.remove(recipeId);
    await loadDashboard();
  };

  return (
    <div className="page-shell">
      <section className="hero-card compact">
        <div>
          <p className="eyebrow">Admin dashboard</p>
          <h1>Manage the entire recipe community</h1>
        </div>
        <Link className="primary-button" to="/recipes/new">
          Create Recipe
        </Link>
      </section>

      {loading ? <div className="center-panel">Loading dashboard...</div> : null}
      {error ? <div className="center-panel error-panel">{error}</div> : null}

      <section className="stats-grid">
        <div className="content-panel stat-card">
          <strong>{recipes.length}</strong>
          <span>Recipes</span>
        </div>
        <div className="content-panel stat-card">
          <strong>{users.length}</strong>
          <span>Users</span>
        </div>
      </section>

      <section className="content-panel">
        <h3>All Recipes</h3>
        <div className="admin-table">
          {recipes.map((recipe) => (
            <div className="admin-row" key={recipe._id}>
              <div>
                <strong>{recipe.title}</strong>
                <p>
                  @{recipe.username} · {recipe.category} · {recipe.difficulty}
                </p>
              </div>
              <div className="admin-row-actions">
                <Link className="ghost-button" to={`/recipes/${recipe._id}`}>
                  View
                </Link>
                <Link className="ghost-button" to={`/recipes/${recipe._id}/edit`}>
                  Edit
                </Link>
                <button className="ghost-button danger" type="button" onClick={() => handleDelete(recipe._id)}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="content-panel">
        <h3>Users</h3>
        <div className="admin-table">
          {users.map((entry) => (
            <div className="admin-row" key={entry._id}>
              <div className="creator-block">
                <img src={entry.profilePic} alt={entry.username} />
                <div>
                  <strong>{entry.name}</strong>
                  <p>@{entry.username} · {entry.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default AdminDashboardPage;
