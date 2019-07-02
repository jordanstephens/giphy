import React from 'react';
import PropTypes from 'prop-types';
import SearchForm from './SearchForm';

import './AppHeader.css';

const AppHeader = ({ q, onSearch }) => (
  <div>
    <h1>Giphy</h1>
    <SearchForm q={q} onSubmit={onSearch} />
  </div>
);

AppHeader.propTypes = {
  onSearch: PropTypes.func.isRequired,
  q: PropTypes.string
};

export default AppHeader;
