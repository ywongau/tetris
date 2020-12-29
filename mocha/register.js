require('@babel/register')({
  extensions: ['.js', '.jsx'],
  presets: ['react-app', '@babel/env'],
  plugins: []
});
require('ignore-styles').default(['.css', '.mp3']);
