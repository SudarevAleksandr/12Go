module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
    es2020: true,
  },
  extends: ['plugin:vue/vue3-essential', 'prettier'],
  parserOptions: {
    parser: '@babel/eslint-parser',
    requireConfigFile: false,
  },
  rules: {
    'no-undef': ['error'],
    quotes: ['error', 'single'],
    'max-len': ['error', 140, 2, { ignoreUrls: true, ignoreStrings: true }],
    'vue/singleline-html-element-content-newline': 'off',
    'space-before-function-paren': ['error', 'always'],
    semi: ['error', 'never'],
    'vue/valid-v-slot': ['error', { allowModifiers: true }],
    'vue/multi-word-component-names': 'off',
    'vue/no-reserved-component-names': 'off',
    'comma-dangle': [2, 'always-multiline'],
    camelcase: [
      0,
      {
        ignoreGlobals: true,
        properties: 'never',
        ignoreImports: true,
        ignoreDestructuring: true,
      },
    ],
  },
}
