import antfu from '@antfu/eslint-config'

export default antfu({
  markdown: false,
  jsonc: false,
  react: true,
  yaml: false,
  rules: {
    'style/brace-style': ['error', '1tbs', { allowSingleLine: true }],
    'react-refresh/only-export-components': 'off',
    // TODO
    'react/prop-types': 'off',
  },
})
