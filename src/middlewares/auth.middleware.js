export function isAuth(req, res, next) {
	if (req.session.user) {
		next();
	} else {
		res.redirect('/login');
}};

export function isGuest(req, res, next) {
	if (!req.session.user) {
		next();
	} else {
		res.redirect('/');
}};

export function authorize(rol) {
    return (req, res, next) => {
      if (req.isAuthenticated() && req.user.rol === rol) {
        next();
      } else {
        res.status(403).json({ error: 'Acceso denegado' });
      }
}};