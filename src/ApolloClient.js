import { ApolloClient, InMemoryCache } from '@apollo/client';
import { RestLink } from 'apollo-link-rest';

const restLink = new RestLink({
  uri: `${window.REACT_APP_API_URL}/`
});

const client = new ApolloClient({
  link: restLink,
  cache: new InMemoryCache().restore(window.__APOLLO_STATE__),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-first',
    },
  },
});

export { client };
