import express from "express";
import handlebars from "express-handlebars";
import mongoose from "mongoose";
import { Server } from "socket.io";
import session from 'express-session';
import cookieParser from 'cookie-parser';
import MongoStore from 'connect-mongo';
import passport from "passport";
import swaggerJsDoc from "swagger-jsdoc";
import swaggerUi from 'swagger-ui-express'

const app = express();

app.use(express.static('public/'));
app.use(express.json())
app.use(express.urlencoded({extended: true}));
app.engine('handlebars', handlebars.engine());
app.set('views' , 'views/' );
app.set('view engine','handlebars');
app.use(errorManagerMiddleware)

//Cookies
app.use(cookieParser(config.SECRET_KEY));

//Session
app.use(
    session({
        store: MongoStore.create({
			mongoUrl: config.MONGO_URL,
			mongoOptions: {
				useNewUrlParser: true,
                useUnifiedTopology: true
			},
			ttl: 172800,
		}),
    secret: config.SECRET_KEY,
    resave: true,
    saveUninitialized: true,
}))

//Passport
passportInit();
app.use(passport.initialize());
app.use(passport.session());
app.use(loggerMiddleware);

//-------------------------------------------------------//

import { cartRoutes } from "./routers/cart.routes.js";
import productRouter from "./routers/products.routes.js";
import ProductRepository from "./repository/project.repository.js";
import { productService } from "./dao/dbManagers/product.service.js";
import ProductManager from "./dao/fsManagers/productManager.js";
import usersRouter from "./routers/user.routes.js";
import passportInit from "./config/passport.config.js";
import sessionsRoutes from "./routers/sessions.routes.js";
import config from "./config/config.js";
import viewsRoutes from "./routers/views.routes.js";
import chatModel from "./models/chat.model.js";
import errorManagerMiddleware from "./middlewares/errorManager.middleware.js";
import logger from "./middlewares/logger.middleware.js";
import { loggerMiddleware } from "./middlewares/logger.middleware.js";
import userService from "./dao/dbManagers/user.service.js";



//Config de Swagger
const swaggerOptions = {
  swaggerDefinition: {
    openapi:'3.0.1',
    info: {
      title: 'Shop API',
      version: '1.0.0',
      description: 'Shop API Information'
    }
  },
  apis: ['**/docs/*.yaml']
};
const specs = swaggerJsDoc(swaggerOptions)

//Rutas de MongoDB
app.use('/docs', swaggerUi.serve, swaggerUi.setup(specs));
app.use('/', viewsRoutes);
app.use('/api/session', sessionsRoutes);
app.use('/api/products', productRouter);
app.use('/api/carts', cartRoutes);
app.use('/api/users', usersRouter);

app.post('/chat', async (req, res) => {
  try {
    const { user, message } = req.body;
    const newMessage = new chatModel({ user, message });
    await newMessage.save();
      
    const messages = await chatModel.find().lean();
    socketServer.emit('List-Message', messages)   //socketServer definido linea 93

    res.redirect('/chat')
  } catch (err) {
    req.logger.error('Error al iniciar el chat');
    res.status(500).send(err)
  }
});

app.get('/loggerTest', (req, res) => {
  try {
    req.logger.fatal('Este es un mensaje fatal');
    req.logger.error('Este es un mensaje de error');
    req.logger.warning('Este es un mensaje de advertencia');
    req.logger.info('Este es un mensaje informativo');
    req.logger.http('Este es un mensaje HTTP');
    req.logger.debug('Este es un mensaje de depuración');

    res.status(200).send('Logs de prueba generados con éxito');
  } catch (error) {
    res.status(500).send('Error al generar los logs de prueba');
  }
});

//Connect MongoDB
mongoose.connect(config.MONGO_URL);

//-------------------------------------------------------//

const httpServer = app.listen(config.PORT, () => {
    return logger.info(`Listening Port: ${config.PORT}`)
});

const controller = new ProductRepository(productService)

const socketServer = new Server(httpServer); //servidor para trabajar con sockets.

async function products(socket) {
    socket.emit('send', await controller.get());
}

async function users(socket) {
  socket.emit('sendusers', await userService.getAll())
}

socketServer.on ('connection', async (socket) => {
    logger.info("Nuevo cliente conectado");
    products(socket);
    users(socket);

    socket.on ('add', async (product) => {
        await controller.add(product)
        socket.emit('send', await controller.get());
        products(socket)
    })

    socket.on('delete', async (id) => {
        await controller.delete(id);
        products(socket)
    })
    
    socket.on('deleteUser', async (id) => {
      await userService.deleteUserById(id);
      users(socket)
    })

    try {
		const messages = await chatModel.find().lean();
		socket.emit('List-Message', messages );
	} catch (error) {
		logger.error('Error al obtener los mensajes');
	}

	socket.on('disconnect', () => {
		logger.info('Cliente desconectado');
	});
});

global.socketServer = socketServer;