import express from 'express';
import bodyParser from 'body-parser';
import { sequelize } from './model.js';
import routeConfiguration from './routeConfiguration.js';

const app = express();

app.use(bodyParser.json());
app.set('sequelize', sequelize);
app.set('models', sequelize.models);

routeConfiguration(app);

export default app;
