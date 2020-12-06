import { ApolloProvider } from '@apollo/client';
import './App.css'
import Main from './views/Main'
import Movie from './views/Movie'
import {
  BrowserRouter as Router,
  Switch,
  Route
} from 'react-router-dom'
import { client } from './ApolloClient'

const routes = [
  {
    path: '/',
    component: Main
  },
  {
    path: '/movie/:id',
    component: Movie,
  }
]

function App () {
  return (
    <Router>
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
    </Router>
  )
}

const ApolloApp = () => (
  <ApolloProvider client={client}>
    <App/>
  </ApolloProvider>
)

export default ApolloApp
