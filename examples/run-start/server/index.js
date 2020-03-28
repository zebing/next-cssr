const path = require('path');
const startServer = require('../../../dist/index').default;

const dev = process.env.NODE_ENV !== 'production';
const dir = path.resolve(__dirname, '../');

startServer({ dev, dir })
  .then(async (app) => {
    await app.prepare();
  })
  .catch((err) => {
    // eslint-disable-next-line no-console
    console.log('server-start-err: ', err);
  });
