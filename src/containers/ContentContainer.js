import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import ContentLoading from '../components/ContentLoading';
import ContentError from '../components/ContentError';

const ContentContainer = ({ loading, error, children }) => (
  <Fragment>
    {children}
    {loading ? (
      <ContentLoading />
    ) : error ? (
      <ContentError error={error} />
    ) : null}
  </Fragment>
);

ContentContainer.propTypes = {
  loading: PropTypes.bool.isRequired,
  error: PropTypes.shape({}),
  children: PropTypes.node,
};

export default ContentContainer;
