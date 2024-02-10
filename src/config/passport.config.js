import passport from 'passport';
import local from 'passport-local';
import userService from '../dao/dbManagers/user.service.js';
import GitHubStrategy from 'passport-github2'
import { comparePassword, hashPassword } from '../utils/encript.js';
import { cartService } from '../dao/dbManagers/cart.service.js';
import config from './config.js';
import moment from 'moment';

const LocalStrategy = local.Strategy;
const passportInit = () => {
    passport.use('register', new LocalStrategy(
        {passReqToCallback:true, usernameField:'email'}, async (req, username, password, done)=>{
            const userData = {...req.body, password: hashPassword(req.body.password)};
            try {
                let user = await userService.getByName({email: username});
                if(user){
                    return done(null, false, { message: 'User already exists' })
                }
                let result = await userService.createUser(userData);
				const cart = await cartService.addCart();
				if (cart && cart._id) {
					result.cart = cart._id;
					await result.save();
				} else {
					throw new Error("No se pudo obtener el ID del carrito");
				}
                return done(null, result);
            } catch (error) {
                return done('Cannot get user: ' + error);
            }
        }
    ))

	passport.use('login', new LocalStrategy({usernameField:'email'}, async (username, password, done) => {
        try {
            const user = await userService.getByEmail(username);
            if(!user){
                console.log("User doesn't exist");
                return done(null, false);   //y este tipo de error generalmente es el de que no hubo una creacion de usuario.
            }
            if(!comparePassword(user, password)) {
				return done (null, false)
			};
			
			user.last_connection = moment().startOf('minute').toDate();
			await user.save();

            return done(null, user);
        } catch (error) {
            return done(error)  //generalmente este tipo de error es el de error 500
        }
    }));

	passport.serializeUser((user, done) => {
		done(null, user._id);
	});

	passport.deserializeUser(async (id, done) => {
		const user = await userService.getById(id);
		done(null, user);
	});

    passport.use(
		'github',
		new GitHubStrategy(
			{
				clientID: config.clientID,
				clientSecret: config.clientSecret,
				callbackURL: config.callbackURL,
			},
			async (accessToken, refreshToken, profile, done) => {
				try {
					let user = await userService.getByEmail(
						profile._json.email
					);
					if (!user) {
						let newUser = {
							first_name: profile._json.name,
							last_name: '',
							email: profile._json.email,
							password: '',
							img: profile._json.avatar_url,
							cart: await cartService.addCart()
						};
						user = await userService.createUser(newUser);
						user.last_connection = moment().startOf('minute').toDate();
						await user.save();
						done(null, user);
					} else {
						done(null, user);
					}
				} catch (error) {
					done(error, false);
				}
			}
		)
	);
};

export default passportInit;