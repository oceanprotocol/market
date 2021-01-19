const dotenv = require('dotenv');
const dotenvExpand = require('dotenv-expand');
const activeEnv = process.env.GATSBY_ACTIVE_ENV || process.env.NODE_ENV || 'development';
console.log(`Using environment config: '${activeEnv}'`);
const myEnv = dotenv.config({
    path: `.env.${activeEnv}`,
});
dotenvExpand(myEnv);