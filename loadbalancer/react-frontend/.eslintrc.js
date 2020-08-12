module.exports = {
  env: {
    browser: true,
    es6: true,
  },
  extends: 'airbnb',
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parser: "babel-eslint",
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  plugins: [
    'react',
    'babel',
  ],
  rules: {
    'react/prefer-stateless-function': 0,
    'react/jsx-filename-extension': 0,
    'indent': ['error', 4],
    'react/jsx-indent': [2, 4],
    'react/jsx-indent-props': [2, 4],
    "react/no-did-update-set-state": 0
  },
  settings: {
    'import/resolver': {
      alias: {
        map: [
          ['components', './src/components']
        ]
      }
    }
  }
};
