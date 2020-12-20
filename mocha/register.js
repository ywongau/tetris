require('@babel/register')({
  extensions: ['.js', '.jsx'],
  presets: ['react-app', '@babel/env'],
  plugins: []
});

require('jsdom-global/register');
require('ignore-styles');
