import { ApolloClient, ApolloLink, concat, InMemoryCache } from '@apollo/client/core'
import { GraphQLWsLink } from '@apollo/client/link/subscriptions'
import { createClient } from 'graphql-ws'

const authMiddleware = new ApolloLink((operation, forward) => {
  const token = localStorage.getItem('token')
  operation.setContext({
    headers: {
      authorization: token ? `Bearer ${token}` : '',
    },
  })
  return forward(operation)
})

// HTTP connection to the API
// const httpLink = createHttpLink({
//   // You should use an absolute URL here
//   uri: 'http://localhost:9091/graphql',
// })

const wsLink = new GraphQLWsLink(
  createClient({
    url: 'ws://localhost:9091/graphql',
    connectionParams: () => ({
      authToken: localStorage.getItem('token'),
    }),
    shouldRetry: (errOrCloseEvent: unknown) => {
      // retry on transient network errors
      if (errOrCloseEvent instanceof CloseEvent) {
        return errOrCloseEvent.code !== 1006
      } else {
        return true
      }
    },
    lazy: false,
    onNonLazyError: (err: unknown) => {
      console.error('GraphQLWsLink', err)
    },
    retryWait: async function waitBeforeRetry () {
      await new Promise(resolve =>
        setTimeout(resolve, 1000 + Math.random() * 3000),
      )
    },
  })
)

// const link = split(
//   // split based on operation type
//   ({ query }) => {
//     const definition = getMainDefinition(query)
//     return (
//       definition.kind === 'OperationDefinition' &&
//             definition.operation === 'subscription'
//     )
//   },
//   wsLink,
//   httpLink
// )

// Cache implementation
const cache = new InMemoryCache({
})

// Create the apollo client
export const apolloClient = new ApolloClient({
  link: concat(authMiddleware, wsLink),
  cache,
})
