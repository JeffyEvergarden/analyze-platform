module.exports = {
  extends: [require.resolve('@umijs/fabric/dist/eslint')],
  globals: {
    ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION: true,
    page: true,
    REACT_APP_ENV: true,
  },
  rules: {
    '@typescript-eslint/naming-convention': 'off',
    'no-alert': 'off',
    'no-console': 'off',
    'no-underscore-dangle': 'off',
    'no-param-reassign': 'off',
    'react/jsx-curly-brace-presence': 'off',
    'no-bitwise': 'off',
    'react-hooks/exhaustive-deps': 'off',
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': ['off'],
    '@typescript-eslint/dot-notation': ['off'],
    '@typescript-eslint/no-shadow': ['off'],
    '@typescript-eslint/no-loop-func': ['off'],
    'spaced-comment': 'off',
    'object-shorthand': 'off',
    'prefer-template': 'off',
    'no-useless-concat': 'off',
    'prefer-arrow-callback': 'off',
    'prefer-const': 'off',
    'no-plusplus': 'off',
    'operator-assignment': 'off',
    'prefer-object-spread': 'off',
    'no-restricted-globals': 'off',
    'prefer-destructuring': 'off',
  },
};
