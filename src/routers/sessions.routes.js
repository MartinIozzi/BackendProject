import { Router } from 'express';
import passport from 'passport';
import { isAuth } from '../middlewares/auth.middleware.js';
import errorsType from '../utils/errors.js';
import CustomErrors from '../utils/customErrors.js';
import { generateRoutingError } from '../utils/info.js';

const sessionsRoutes = Router();

sessionsRoutes.get('/github', passport.authenticate('github', { scope: ['user:email'] }), async (req, res) => {
	try {
		res.status("success")
	} catch (error) {
		res.status(500).json({error: CustomErrors.createError("Error de redirección", generateRoutingError(), 'Redirect Error', errorsType.ROUTING_ERROR)})
	}
});

sessionsRoutes.get('/githubcallback', passport.authenticate('github', { failureRedirect: '/login' }), (req, res) => {
		req.session.user = req.user;
		res.redirect('/');
	}
);

sessionsRoutes.get('/current', isAuth, async (req, res) => {
	try {
		if (req.isAuthenticated()) {
			const currentUser = req.user;
			res.send(currentUser);
		}
	} catch (error) {
		res.status(500).send({error: 'error en el servidor'})
	}
});

export default sessionsRoutes;