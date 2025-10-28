import knex from 'knex';
import { development, production } from './knexfile.js';

const env = process.env.ENVIRONMENT || 'development';

const db = env === 'development' ? knex(development) : knex(production);

export default db;