import dotenv from 'dotenv';
import program from './commander.js';

let path = '.env.prod';

if (program.opts().mode === 'dev') {
	path = '.env.dev';
}

dotenv.config({ path });

export default {
	PORT: process.env.PORT,
	SECRET_KEY: process.env.SECRET_KEY,
	MONGO_URL: process.env.MONGO_URL,
	PERSISTENCE: process.env.PERSISTENCE,
	clientID: process.env.clientID,
	clientSecret: process.env.clientSecret,
	callbackURL: process.env.callbackURL,
	NODE_ENV: process.env.NODE_ENV,
	EMAIL: process.env.EMAIL,
	EMAIL_PASSWORD: process.env.EMAIL_PASSWORD
};
