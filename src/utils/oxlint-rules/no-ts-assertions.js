export const meta = {
  type: 'problem',
  docs: {
    description:
      'Disallow type annotations that use the React. namespace (e.g., React.ChangeEvent)',
    category: 'Best Practices',
    recommended: false
  },
  messages: {
    noTypeAnnotation:
      'Do not use React.{{typeName}} in type annotations. Import the type directly from "react".'
  },
  schema: []
}

export function create(context) {
  return {
    TSTypeReference(node) {
      if (
        node.typeName &&
        node.typeName.type === 'TSQualifiedName' &&
        node.typeName.left.name === 'React'
      ) {
        context.report({
          node,
          messageId: 'noTypeAnnotation',
          data: { typeName: node.typeName.right.name }
        })
      }
    }
  }
}

export default {
  rules: {
    ban: {
      meta,
      create
    }
  }
}
