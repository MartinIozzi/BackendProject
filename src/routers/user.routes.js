import { Router } from 'express';
import passport from 'passport';
import userService from '../dao/dbManagers/user.service.js';
import errorsType from '../utils/errors.js';
import CustomErrors from '../utils/customErrors.js';
import { generateUserInfoError, generateLoginError, generateRegisterError, generateDelogError, generateAuthenticationError } from '../utils/info.js';
import { transporter } from '../utils/mail.js';
import logger from '../middlewares/logger.middleware.js';
import { hashPassword, comparePassword } from '../utils/encript.js';
import { generateToken } from '../middlewares/jwt.middleware.js';
import userModel from '../models/user.model.js';
import jwt from 'jsonwebtoken';
import config from '../config/config.js';
import cron from 'node-cron'

const privatekey = config.SECRET_KEY;

const usersRouter = Router();

usersRouter.get('/', async (req, res) => {
	try {
		let users = await userService.getAll();
		const simplifiedUsers = users.map(user => ({
			first_name: user.first_name,
			last_name: user.last_name,
			email: user.email,
			rol: user.rol
		}));
		res.send(simplifiedUsers)
	} catch (error) {
		res.status(500).json({error: CustomErrors.createError("Error de usuarios", generateUserInfoError(), 'Show Users Error', errorsType.USER_ERROR)})
	}
});

usersRouter.post('/', async (req, res) => {
	try {
		const userData = req.body;
		let users = await userService.createUser(userData)
		res.send(users)
	} catch (error) {
		res.status(500).json({error: CustomErrors.createError("Error de creación", generateAuthenticationError(), 'Authentication Error', errorsType.AUTHENTICATION_ERROR)})
	}
});

usersRouter.post('/register', passport.authenticate('register') , async (req, res) => {
	try {
		res.redirect('/')
	} catch (error) {
		res.status(500).json({error: CustomErrors.createError("Error de creación", generateRegisterError(), 'Register Error', errorsType.REGISTER_ERROR)})
	}
});

usersRouter.post('/login', passport.authenticate('login', {failureRedirect: '/login'}), async (req, res) => {
	try {
		req.session.user = req.user;
		res.redirect('/')
	} catch (error) {
		res.status(500).json({error: CustomErrors.createError("Error de logueo", generateLoginError(), 'Login Error', errorsType.LOGIN_ERROR)});
	}
});

usersRouter.post('/logout', (req, res) => {
	try {
		req.session.destroy();
		res.redirect('/login');
	} catch (error) {
		res.status(500).json({error: CustomErrors.createError("Error de delogueo", generateDelogError(), 'Delog Error', errorsType.DELOGIN_ERROR)});
	}
});

usersRouter.post('/mail', async (req, res) => {
	const { user } = req.session;
	const userEmail = user.email
	try {
		const userMail = await userService.getByEmail(userEmail)
		const token = generateToken(user);
		
		const mailOptions = {
			from: 'Reestablecer contraseña <martiniozzi103@gmail.com>',
			to: userMail.email,
			subject: 'Reestablecimiento de contraseña',
			html: `
			  <div style="background-color: rgb(243, 215, 179); padding: 20px;">
				<h1>Reestablece tu contraseña</h1>
				<p>Haz solicitado reestablecer tu contraseña, si fue el caso, haz click en el link que se encuentra a continuación:</p>
				<a style="border-radius: 2px; text-decoration: none;" href="http://localhost:8080/mail/${token}"><button>Reestablece tu contraseña</button></a>
				<p>Atte: El equipo de "MyShop".</p>
				<img style="max-height: 200px;" src="https://i.pinimg.com/originals/6e/79/f4/6e79f4854bd0aba7698b9fda5d7ad8e3.jpg">
			  </div>
			  </div>
			`
		  };
		  
		  
		  transporter.sendMail(mailOptions, (error, info) => {
			if (error) {
				logger.error(error);
			}
			logger.info(`Email sent: ` + info)});
		  res.redirect('/emailsent');
	} catch (error) {
		res.status(500).json(error);
}});

usersRouter.post('/resetemail/:token', async (req, res) => {
	const actualUser = req.params.token;
	const newPassword = req.body.password;

	try {
		const decodedUser = jwt.verify(actualUser, privatekey);
		const userId = await userModel.findById(decodedUser._id)

		const hashedPasswordFromDB = userId;

		if (comparePassword(hashedPasswordFromDB, newPassword)) {
			req.logger.warn("No puede ser la misma contraseña");
		  }		  

		const hashedPass = hashPassword(newPassword)
		userId.password = hashedPass;
		userId.save();

		res.redirect('/login')
	} catch (error) {
		console.log(error);
	}
});

usersRouter.delete('/autodelete', async (req, res) => {
	try {
		const inactiveUsers = await userService.getInactiveUsers();
	
		for (const user of inactiveUsers) {
			if (user.rol === 'Admin') {
				console.log("El administrador no puede ser eliminado")
			} else {
				const id = user._id.toString()
				const deleteUsers = await userService.deleteUserById(id)
				
				const emailOptions = {
					from: 'Notificación importante desde nuestra pagina "MyShop". <martiniozzi103@gmail.com>',
					to: deleteUsers.email,
					subject: 'Eliminacion de cuenta por inactividad',
					html: `
					  <div style="background-color: rgb(243, 215, 179); padding: 20px;">
						<h1>Estimado usuario/a: ${deleteUsers.first_name} ${deleteUsers.last_name}</h1>
						<p>Este correo automatico es enviado a usted para informarle que su cuenta a quedado fuera de nuestro sitio por cuestiones de inactividad, 
						ante cualquier duda no dude en contactarnos. Disculpe las molestias ocasionadas.</p>
						<p>Atte: El equipo de "MyShop".</p>
						<img style="max-height: 200px;" src="https://i.pinimg.com/originals/6e/79/f4/6e79f4854bd0aba7698b9fda5d7ad8e3.jpg">
					  </div>
					`
		}
		transporter.sendMail(emailOptions, (error, info) => {
			if (error) {
				logger.error(error)
			}
			logger.info('Email sent: ' + info)
		});
	}};
	} catch (error) {
		res.status(500).json({ error: "Error al eliminar el usuario" });
	}
});

cron.schedule('0 0 * * *', async () => {
	try {
		const url = `http://localhost:8080/api/users/autodelete`;
		const response = await fetch(url, {
			method: 'DELETE',
		});

		if (response.ok) {
			logger.info('Eliminacion automatica exitosa');
		} else {
			logger.error('Error al ejecutar la eliminación automática');
		}
	} catch (error) {
		res.status(500).json({ error: "Error al eliminar el usuario" });
	}
});

usersRouter.delete('/deleteuser/:uid', async (req, res) => {
	try {
		const user = req.params.uid;
		await userService.deleteUserById(user);
		res.status(200).json({ message: "Usuario eliminado con éxito" })
	} catch (error) {
		res.status(500).json({ error: "Error al eliminar el usuario" });
	}
});

usersRouter.post('/updaterol/:uid', async (req, res) => {
	const userId = req.params.uid;
	try {
		const user = await userService.getById(userId);
		if (user.rol === "User") {
			user.rol = "Premium"
			user.save()
		} else {
			user.rol = "User"
			user.save()
		};
		res.status(200).json({ message: "Cambio de rol exitoso" });
	} catch (err) {
		req.logger.error(`No se pudo cambiar el rol`);
		res.status(500).json({ error: "Cambio de rol fallido" });
	};
});

export default usersRouter;
