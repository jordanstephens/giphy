import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import SearchForm from './SearchForm';

import './AppHeader.css';

const AppHeader = ({ q, onSearch }) => (
  <div className='header-container'>
    <h1>
      <Link to='/'  className='logo'>
        Giphy
      </Link>
    </h1>
    <SearchForm q={q} onSubmit={onSearch} />
  </div>
);

AppHeader.propTypes = {
  onSearch: PropTypes.func.isRequired,
  q: PropTypes.string
};

export default AppHeader;
