import React from 'react';
import { Route, Switch } from 'react-router';
import MissingPage from './pages/MissingPage';
import TrendingPage from './pages/TrendingPage';
import SearchPage from './pages/SearchPage';

const routes = (
  <Switch>
    <Route exact path='/' component={TrendingPage} />
    <Route exact path='/search' component={SearchPage} />
    <Route component={MissingPage} />
  </Switch>
);

export default routes;
