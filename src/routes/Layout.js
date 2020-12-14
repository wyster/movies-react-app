import { Route, Switch } from 'react-router'
import React from 'react'

import routes from './'

const Layout = () =>
  <div className="container-fluid mt-3 mb-3">
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
  </div>

export default Layout