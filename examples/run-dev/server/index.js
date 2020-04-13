/* eslint-disable no-console */
const path = require('path');
const startServer = require('../../../dist/index').default;

const dev = process.env.NODE_ENV !== 'production';
const dir = path.resolve(__dirname, '../');
function downgradeStrategy() {
  return true;
}

startServer({ dev, dir, downgradeStrategy })
  .then(async (app) => {
    await app.prepare();
  })
  .catch((err) => {
    console.log('server-start-err: ', err);
  });
