import React from 'react';
import { Route, Switch } from 'react-router';
import MissingPage from './pages/MissingPage';
import TrendingPage from './pages/TrendingPage';

const routes = (
  <Switch>
    <Route exact path='/' component={TrendingPage} />
    <Route component={MissingPage} />
  </Switch>
);

export default routes;
