/* eslint-disable no-console */
const path = require('path');
const startServer = require('../../../dist/index').default;

const dev = process.env.NODE_ENV !== 'production';
const dir = path.resolve(__dirname, '../');

startServer({ dev, dir, port: 3001 })
  .then(async (app) => {
    await app.prepare();
  })
  .catch((err) => {
    console.log('server-start-err: ', err);
  });
