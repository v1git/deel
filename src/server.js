/* eslint-disable no-console */
import app from './app.js';

async function init() {
  try {
    app.listen(3000, () => {
      console.log('Express App Listening on Port 3000');
    });
  } catch (error) {
    console.error(`An error occurred: ${JSON.stringify(error)}`);
    process.exit(1);
  }
}

init();
