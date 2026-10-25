const { createApp } = require('./app');
const { getConfig } = require('./config/env');
const { connectDatabase } = require('./config/db');

async function start() {
  try {
    const config = getConfig();
    await connectDatabase(config.mongoUri);
    const app = createApp();
    app.listen(config.port, () => {
      console.log(`JobConnect API listening on http://localhost:${config.port}`);
    });
  } catch (error) {
    console.error('The backend could not start.');
    console.error(error.message);
    process.exit(1);
  }
}

start();
