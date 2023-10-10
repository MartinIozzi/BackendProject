import { Router } from "express";
import { isAuth, isGuest } from "../middlewares/auth.middleware.js";
import ProductRepository from "../repository/project.repository.js";
import { CartRepository } from "../repository/project.repository.js";
import { generateProducts } from "../utils/generate.js";
import errorsType from '../utils/errors.js';
import CustomErrors from '../utils/customErrors.js';
import { generateRenderError } from '../utils/info.js';
//Importo DAOs
import { productService } from "../dao/dbManagers/product.service.js";
import ProductManager from "../dao/fsManagers/productManager.js";
import { cartService } from "../dao/dbManagers/cart.service.js";
import userService from '../dao/dbManagers/user.service.js'
import AdminDTO from "../dto/adminDto.js";


const viewsRoutes = Router();
const prodController = new ProductRepository(productService)
const cartController = new CartRepository(cartService)

viewsRoutes.get ('/', isAuth, async (req, res) => {
    const { user } = req.session;
    const cartId = user.cart;
    const token = req.params;
    delete user.password;
    const adminPermission = user.rol === "Admin";
    const userPremium = user.rol === "Premium";
    
    const limit = parseInt(req.query.limit) || 10;
    const sort = req.query.sort === 'desc' ? { desc: -1 } : { asc: 1 };
    const query = req.query.query || '';
    const page = parseInt(req.query.page) || 1;

    try {
        const prods = await prodController.find(limit, sort, query, page);
        const productList = await prodController.get();
        res.render('index', {products: productList, user: user, prods, cartId, token: token.token, adminPermission, userPremium, title: 'Lista de productos'})
      } catch (err) {
        res.status(500).json(CustomErrors.createError("Error de renderizado", generateRenderError(), 'Render Error', errorsType.RENDER_ERROR));
    }
});

viewsRoutes.get('/realtimeproducts', async (req, res) => {
    const { user } = req.session;
    const token = req.params;
    
    try {
        res.render('realTimeProducts', {title: 'Productos en tiempo real', user: user, token: token.token});
    } catch (err) {
        res.status(500).json(CustomErrors.createError("Error de renderizado", generateRenderError(), 'Render Error', errorsType.RENDER_ERROR));
    }
});

viewsRoutes.get('/products', async (req, res) => {
    const { user } = req.session;
    const cartId = req.session.user.cart
    const products = await prodController.get()
    try {
        res.render('products', {cartId, products, user: user, title: 'Productos'});
    } catch (err) {
        res.status(500).json(CustomErrors.createError("Error de renderizado", generateRenderError(), 'Render Error', errorsType.RENDER_ERROR));
    }
});

viewsRoutes.get('/carts', async (req, res) => {
    const { user } = req.session;
    const cartId = user.cart;
    try{
        const userCartById = await cartController.getById(cartId)
        const promises = userCartById.products.map(async (product) => {
            const name = await prodController.getName(product.product);
            const price = await prodController.getPrice(product.product);
            return {
                productId: product.product,
                name: name,
                price: price,
                quantity: product.quantity
            };
        });
        const productsInCart = await Promise.all(promises);
        res.render('carts', { title: 'Carrito', user: user, productsInCart, cartId});
    } catch(err){
        res.status(500).json(CustomErrors.createError("Error de renderizado", generateRenderError(), 'Render Error', errorsType.RENDER_ERROR));
    }
});

viewsRoutes.get('/login', isGuest, (req, res) => {
    try{
        res.render('login', {title: 'Inicio de sesión', hideNavbar: true});
    }catch(err){
        res.status(500).json(CustomErrors.createError("Error de renderizado", generateRenderError(), 'Render Error', errorsType.RENDER_ERROR));
    }
});

viewsRoutes.get('/register', isGuest, (req, res) => {
    try {
        res.render('register', {title: 'Registro', hideNavbar: true});
    } catch (err) {
        res.status(500).json(CustomErrors.createError("Error de renderizado", generateRenderError(), 'Render Error', errorsType.RENDER_ERROR));
    }
});

viewsRoutes.get('/chat', isAuth, (req, res) => {
    const { user } = req.session;
    try {
        const users = {user: req.user}
        res.render('chat', {users, user: user});
    } catch (error) {
        res.status(500).json(CustomErrors.createError("Error de renderizado", generateRenderError(), 'Render Error', errorsType.RENDER_ERROR));
    }
});

viewsRoutes.get('/mockingproducts', (req, res) => {
    try {
        res.json(generateProducts());
    } catch (error) {
        res.status(500).json(CustomErrors.createError("Error de renderizado", generateRenderError(), 'Render Error', errorsType.RENDER_ERROR));
    }
});

viewsRoutes.get('/mail/:token', (req, res) => {
    const { user } = req.session;
    const token = req.params;
    try{
        res.render('mail', {title: 'Reestablecer contraseña', user: user, token: token.token})
    } catch (error) {
        res.status(500).json(CustomErrors.createError("Error de renderizado", generateRenderError(), 'Render Error', errorsType.RENDER_ERROR));
    }
})

viewsRoutes.get('/emailsent', (req, res) => {
    const { user } = req.session;
    const userEmail = user.email
    try {
        res.render('emailsent', { title: 'Se envio email de restablecimiento', user: user, userEmail: userEmail});
    } catch (error) {
        res.status(500).json(CustomErrors.createError("Error de renderizado", generateRenderError(), 'Render Error', errorsType.RENDER_ERROR));
    }
});

viewsRoutes.get('/resetpassword', (req, res) => {
    const { user } = req.session;
    try {
        res.render('resetpassword', {title: 'Restablecer contraseña', user: user});
    } catch (error) {
        res.status(500).json(CustomErrors.createError("Error de renderizado", generateRenderError(), 'Render Error', errorsType.RENDER_ERROR));
    }
})

viewsRoutes.get('/usercontroller', async (req, res) => {
    const { user } = req.session;
    const authorization = user.rol === "Premium" || user.rol === "Admin";

    const adminPermission = user.rol === "Admin";
    const allUsers = await userService.getAll();

    const dto = new AdminDTO(allUsers);
    const userToAdmin = dto.allUsers;


    res.render('userController', {title: 'Controlador de Usuarios', user, authorization, adminPermission, allUsers, userToAdmin})
})

viewsRoutes.get('/perfil', async (req, res) => {
    try {
        const {user} = req.session;
    
        res.render('profile', {title:'Perfil de usuario', user: user});
    } catch (error) {
        throw new Error (error)
    }
})

export default viewsRoutes;