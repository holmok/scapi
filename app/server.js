import config from 'config';
import Good from 'good';
import Hapi from 'hapi';
import HapiSwagger from 'hapi-swagger';
import Inert from 'inert';
import Vision from 'vision';

const version = require('../package').version;

const SERVER_CONFIG = config.default.get('server');

// Create a server with a host and port
const server = new Hapi.Server();
server.connection({
  host: SERVER_CONFIG.host,
  port: SERVER_CONFIG.port,
});

// Add util routes
server.route({
  method: 'GET',
  path: '/',
  handler: (request, reply) => reply('Go to <a href="/api">/api</a> for api, and <a href="/documentation">/documentation</a> for documentation.'),
});

server.route({
  method: 'GET',
  path: '/api',
  handler: (request, reply) => reply({ version }),
});

server.register(
  [
    {
      register: Good,
      options: {
        reporters: {
          console: [{
            module: 'good-squeeze',
            name: 'Squeeze',
            args: [{
              response: '*',
              log: '*',
            }],
          }, {
            module: 'good-console',
          }, 'stdout'],
        },
      },
    },
    Inert,
    Vision,
    {
      register: HapiSwagger,
      options: {
        info: {
          title: 'Concepts API Documentation',
          version,
        },
        grouping: 'tags',
      },
    },
  ],
  (err) => {
    if (err) {
      throw err;
    }

    server.start((serverError) => {
      if (serverError) {
        throw serverError;
      }
      server.log('info', `Server running at: ${server.info.uri}`);
    });
  });
