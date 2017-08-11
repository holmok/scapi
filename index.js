/**
 * Entry point for the server app.  Uses 'babel-core/register' to
 * transpile and deal with es2017 stuff.
 */

/**
 * Register babel-core, this is configured in .babelrc
 */
require('babel-core/register');

/**
 * Load the server app.
 */
require('./app/server');
