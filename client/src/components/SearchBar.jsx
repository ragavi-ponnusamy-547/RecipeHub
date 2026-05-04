const SearchBar = ({ filters, onChange }) => {
  return (
    <div className="search-panel">
      <label>
        Search recipes
        <input
          type="search"
          name="search"
          placeholder="Search by recipe name"
          value={filters.search}
          onChange={onChange}
        />
      </label>
      <label>
        Category
        <select name="category" value={filters.category} onChange={onChange}>
          <option value="">All</option>
          <option value="Indian">Indian</option>
          <option value="Western">Western</option>
        </select>
      </label>
      <label>
        Difficulty
        <select name="difficulty" value={filters.difficulty} onChange={onChange}>
          <option value="">All</option>
          <option value="Easy">Easy</option>
          <option value="Moderate">Moderate</option>
          <option value="Hard">Hard</option>
        </select>
      </label>
    </div>
  );
};

export default SearchBar;
