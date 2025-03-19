import { CodegenConfig } from '@graphql-codegen/cli'

const config: CodegenConfig = {
  overwrite: true,
  schema: '../graph/schema/*.graphql',
  generates: {
    'src/typed-graph.d.ts': {
      plugins: [
        'typescript',
        'typescript-operations',
        'fragment-matcher',
      ],
      config: {
        apolloClientVersion: 3,
        useExplicitTyping: true,
        enumsAsTypes: true
      },
    },
  },
}

export default config
