import React from 'react';
import { Route, Switch } from 'react-router';
import MissingPage from './pages/MissingPage';

const routes = (
  <Switch>
    <Route component={MissingPage} />
  </Switch>
);

export default routes;
