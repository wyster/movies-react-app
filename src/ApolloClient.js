import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { RestLink } from 'apollo-link-rest';

const restLink = new RestLink({
  uri: `${process.env.REACT_APP_API_URL}/`
});

const client = new ApolloClient({
  link: restLink,
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-first',
    },
  },
});

export { client };