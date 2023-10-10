import jwt from 'jsonwebtoken';
import config from '../config/config.js';

const privatekey = config.SECRET_KEY;

const generateToken = (user) => {
	return jwt.sign(user, privatekey, { expiresIn: '1h' });
};

const authToken = (req, res, next) => {
	const authHeader = req.headers.authorization;

	if (!authHeader) {
		res.status(401).send({ message: 'Token not found' });
	}

	const token = authHeader.split(' ')[1];

	jwt.verify(token, privatekey, (err, credentials) => {
		if (err) {
			res.status(401).send({ message: 'Token not valid' });
		}
		req.user = credentials.user;
		next();
	});
};

export { generateToken, authToken };
