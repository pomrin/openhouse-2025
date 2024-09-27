module.exports = {
  env: {
    node: true,
    commonjs: true,
    es2021: true,
  },
  overrides: [],
  parserOptions: {
    ecmaVersion: 'latest',
    requireConfigFile: false,
  },
  parser: '@babel/eslint-parser',
  rules: {
    'no-trailing-spaces': ['error'],
    semi: ['error'],
    'no-unused-vars': ['error'],
    'no-undef': ['error'],
  },
};
