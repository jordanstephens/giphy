import React from 'react';
import { Route, Switch } from 'react-router';
import MissingPage from './pages/MissingPage';
import TrendingPage from './pages/TrendingPage';
import SearchPage from './pages/SearchPage';
import GifPage from './pages/GifPage';

const routes = (
  <Switch>
    <Route exact path='/' component={TrendingPage} />
    <Route exact path='/search' component={SearchPage} />
    <Route exact path='/gif/:id' component={GifPage} />
    <Route component={MissingPage} />
  </Switch>
);

export default routes;
