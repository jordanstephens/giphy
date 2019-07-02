import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import QueryString from 'query-string';
import { ConnectedRouter, push } from 'connected-react-router';
import routes from './routes';
import AppHeader from './components/AppHeader';
import './App.css';

function App({ push, history }) {
  const { q } = QueryString.parse(window.location.search.slice(1));
  return (
    <ConnectedRouter history={history}>
      <AppHeader
        q={q && decodeURIComponent(q)}
        onSearch={(event, { q }) => {
          event.preventDefault();
          push(`/search?q=${encodeURIComponent(q)}`);
        }}
      />
      { routes }
    </ConnectedRouter>
  );
}

App.propTypes = {
  history: PropTypes.shape().isRequired,
  push: PropTypes.func.isRequired
};

export default connect(null, { push })(App);