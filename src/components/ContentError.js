import React from 'react';
import PropTypes from 'prop-types';

import './ContentError.css';

const ContentError = ({ error }) => (
  <div>{error.message}</div>
);

ContentError.propTypes = {
  error: PropTypes.shape({
    message: PropTypes.string.isRequired
  }).isRequired
};

export default ContentError;
