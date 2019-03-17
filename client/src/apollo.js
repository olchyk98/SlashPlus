import { ApolloClient } from 'apollo-boost';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { createUploadLink } from 'apollo-upload-client';

import api from './api';

const client = new ApolloClient({
	link: createUploadLink({
		uri: api.api,
		credentials: 'include',
	}),
	cache: new InMemoryCache(),
	defaultOptions: { // disable cache
        watchQuery: {
          fetchPolicy: 'network-only',
          errorPolicy: 'ignore',
        },
        query: {
          fetchPolicy: 'network-only',
          errorPolicy: 'all',
        }
    }
});

export default client;