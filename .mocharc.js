module.exports = {
  diff: true,
  extension: ['js'],
  package: './package.json',
  reporter: 'spec',
  slow: 75,
  timeout: 2000,
  ui: 'bdd',
  require: ['mocha/register.js'],
  'watch-files': ['src'],
  reporter: 'nyan',
  spec: ['src/**/*.test.js*'],
  recursive: true,
  watch: true,
};
