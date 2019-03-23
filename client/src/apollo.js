import { ApolloClient, ApolloLink } from 'apollo-boost';
import { InMemoryCache } from 'apollo-cache-inmemory';
// import { createUploadLink } from './li';
import { createUploadLink } from 'apollo-upload-client';
import { onError } from 'apollo-link-error'

import api from './api';

const errorLink = onError((a) => {
	console.log(a);
	if(a.graphQLErrors)
		a.graphQLErrors.map(({ message }) => console.log(message))
});

const uploadLink = createUploadLink({
	uri: api.api,
	credentials: 'include',
});

const client = new ApolloClient({
	link: ApolloLink.from([errorLink, uploadLink]),
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
