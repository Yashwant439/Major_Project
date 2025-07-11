import React from 'react';

const SearchBar = ({ city, setCity, onSearch }) => (
  <form onSubmit={onSearch} className="search-container">
    <input
      type="text"
      value={city}
      onChange={(e) => setCity(e.target.value)}
      placeholder="Enter city name"
      className="search-input"
    />
    <button type="submit" className="search-btn">
      Search
    </button>
  </form>
);

export default SearchBar;