import { Route, Switch } from 'react-router'
import React from 'react'

import routes from './'

const Layout = () =>
  <Switch>
    {routes.map((route, i) => (
      <Route
        exact
        key={route.path}
        path={route.path}
        render={props => (
          <route.component {...props} />
        )}
      />
    ))}
  </Switch>

export default Layout