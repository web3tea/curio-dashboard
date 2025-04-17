import { ApolloClient, ApolloLink, concat, InMemoryCache } from '@apollo/client/core'
import { GraphQLWsLink } from '@apollo/client/link/subscriptions'
import { createClient } from 'graphql-ws'
import { router } from '@/router'
import { useUIStore } from '@/stores/ui'
import { useNotificationStore } from '@/stores/notification'
import { storeToRefs } from 'pinia'

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
    url: import.meta.env.VITE_SERVER_URL || (import.meta.env.DEV ? 'ws://localhost:9091/graphql' : '/graphql'),
    connectionParams: () => ({
      authToken: localStorage.getItem('token'),
    }),
    shouldRetry: (errOrCloseEvent: unknown) => {
      if (errOrCloseEvent instanceof CloseEvent) {
        return errOrCloseEvent.code === 1006
      }
      return true
    },
    lazy: true,
    on: {
      connected: () => {
        const uiStore = useUIStore()
        const { isOnline } = storeToRefs(uiStore)
        isOnline.value = true
      },
      closed: (event: unknown) => {
        const uiStore = useUIStore()
        const { isOnline } = storeToRefs(uiStore)

        const notificationStore = useNotificationStore()

        isOnline.value = false
        if (event instanceof CloseEvent) {

          if (event.code === 1000 && event.reason === 'terminated') {
            notificationStore.error('Auth token expired or invalid')
            router.push('/auth/login').then()
            setTimeout(() => {
              window.location.reload()
            }, 1000)
          } else {
            notificationStore.error('Connection closed: ' + event.reason)
          }
        }
      },
      error: (error: unknown) => {
        if (error instanceof Error) {
          console.error('GraphQLWsLink', error.message)
        }
      },
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
  typePolicies: {
    Query: {
      fields: {
        tasks: {
          merge(_existing, incoming: unknown[]) {
            return incoming // Replace with incoming data as it's likely the most up-to-date
          }
        }
      }
    }
  }
})

// Create the apollo client
export const apolloClient = new ApolloClient({
  link: concat(authMiddleware, wsLink),
  cache,
})
