import productionConfig from './production.config';
import developmentConfig from './development.config';

const { NODE_ENV } = process.env;
const config = NODE_ENV === 'production' ? productionConfig : developmentConfig;

export default config;
