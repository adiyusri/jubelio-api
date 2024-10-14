const Hapi = require('@hapi/hapi');
const productsRoutes = require('./routes/productsRoute');
const adjustmentTransactionsRoutes = require('./routes/adjustmentTransactionsRoute');

const init = async () => {
  const server = Hapi.server({
    port: process.env.PORT,
    host: 'localhost',
    routes: {
      cors: {
        origin: ['*'], // Allow all origins. Replace with ['http://localhost:3000'] for more specific control.
        headers: ['Accept', 'Content-Type', 'Authorization'], // Headers to accept
        credentials: true // If you need cookies or credentials.
      }
    }
  });

  // Register routes
  server.route([...productsRoutes, ...adjustmentTransactionsRoutes]);

  await server.start();
  console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {
  console.error(err);
  process.exit(1);
});

init();
