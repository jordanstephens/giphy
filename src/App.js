import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import QueryString from 'query-string';
import { ConnectedRouter, push } from 'connected-react-router';
import { createLocation } from 'history';
import routes from './routes';
import AppHeader from './components/AppHeader';
import './App.css';

function App({ push, history }) {
  const location = createLocation(window.location.hash.slice(1));
  const { q } = QueryString.parse(location.search.slice(1));
  return (
    <ConnectedRouter history={history}>
      <div className='section-container'>
        <header className='header-content'>
          <AppHeader
            q={q && decodeURIComponent(q)}
            onSearch={(event, { q }) => {
              event.preventDefault();
              push(`/search?q=${encodeURIComponent(q)}`);
            }}
          />
        </header>
      </div>
      <div className='section-container'>
        <main className='main-content'>
          { routes }
        </main>
      </div>
      <div className='section-container footer'>
        <div className='footer-border' />
        <footer className='footer-content'>
          Giphy Viewer by <a href='https://jordanstephens.com'>@jordanstephens</a>
        </footer>
      </div>
    </ConnectedRouter>
  );
}

App.propTypes = {
  history: PropTypes.shape().isRequired,
  push: PropTypes.func.isRequired
};

export default connect(null, { push })(App);