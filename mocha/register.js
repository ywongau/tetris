require('ignore-styles').default(['.scss', '.mp3']);
require('@babel/register')({
  extensions: ['.js', '.jsx'],
  presets: ['react-app', '@babel/env'],
  plugins: []
});
