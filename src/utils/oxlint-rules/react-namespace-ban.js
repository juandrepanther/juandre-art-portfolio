export const meta = {
  type: 'problem',
  docs: {
    description: 'Disallow any usage of React.<anything>',
    recommended: true
  },
  messages: {
    noReactNamespace:
      'Do not use React.{{name}}. Import it directly from "react".'
  },
  schema: []
}

export function create(context) {
  return {
    MemberExpression(node) {
      if (node.object && node.object.name === 'React') {
        context.report({
          node,
          messageId: 'noReactNamespace',
          data: { name: node.property.name }
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
