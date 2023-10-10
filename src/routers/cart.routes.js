import { Router } from "express";
import ProductRepository, {UserRepository, CartRepository} from "../repository/project.repository.js";
import errorsType from '../utils/errors.js';
import CustomErrors from '../utils/customErrors.js';
import { generateCartsError, generateProductsError, generateTicketError } from "../utils/info.js";
//Importo DAOs
import { productService } from "../dao/dbManagers/product.service.js";   //DB MONGO  
import ProductManager from "../dao/fsManagers/productManager.js";    //FILE SYSTEM
import { cartService } from "../dao/dbManagers/cart.service.js";   //DB MONGO
import CartManager from "../dao/fsManagers/cartManager.js";    //FILE SYSTEM
import TicketService from "../dao/dbManagers/ticket.service.js";
import userService from "../dao/dbManagers/user.service.js";

const cartRoutes = Router();

const ticketService = new TicketService()
const userController = new UserRepository(userService)
const productController = new ProductRepository(productService)
const controller = new CartRepository(cartService)

cartRoutes.get('/', async (req, res) => {
    try {
        res.send(await controller.get())
    } catch (error) {
        res.status(500).json({error: CustomErrors.createError("Error del carrito", generateCartsError(), 'Get cart Error', errorsType.CART_ERROR)});
    }
});

cartRoutes.get('/:cid', async (req, res) => {
    const cartId = req.params.cid;
    try {
        res.status(200).send(await controller.getById(cartId));
    } catch (error) {
        res.status(500).json({error: CustomErrors.createError("Error del carrito", generateCartsError(), 'Cart ID Error', errorsType.CART_ERROR)});
    }
});

cartRoutes.post('/',async (req, res) => {
    try {
        const cartId = await controller.create();
        res.cookie('cartId', cartId,{
        maxAge: 1000,
        httpOnly:true
    })
        res.redirect('/')
    } catch (error) {
        res.status(400).json({error: CustomErrors.createError("Error del carrito", generateCartsError(), 'Create cart Error', errorsType.CART_ERROR)});
    }
});

cartRoutes.post('/:cid/products/:pid' , async (req, res) => {
    const productId = req.params.pid;
    const cartId = req.params.cid;
    try {
        await controller.add(cartId, productId);
    } catch (error) {
        res.status(400).json({error: CustomErrors.createError("Error del carrito", generateInvalidTypeError(), 'Invalid Data (Failed to send)', errorsType.INVALID_TYPE)});
    }
});

cartRoutes.get('/:cid/purchase', async (req, res) => {
    try {
        res.status(201).send(await ticketService.getTickets())
    } catch (error) {
        res.status(400).json({error: CustomErrors.createError("Error del ticket", generateTicketError(), 'Get ticket Error', errorsType.TICKET_ERROR)});
    }
});

cartRoutes.post('/:cid/purchase', async (req, res) => {
    try {
        const cartId = req.params.cid;
        const cart = await controller.getById(cartId);
        const user = await userController.getByCartId(cartId);
        const purchaser = user.email;
        let amount = 0;

        let incompletedProducts = []

        for (const product of cart.products){
            const products = await productController.getById(product.product)
            if(products.stock >= product.quantity) {
                products.stock -= product.quantity;
                await productController.update(products._id, products)
                amount += products.price * product.quantity;
            } else {
                incompletedProducts.push(products._id.toString());
            }
        }
        await ticketService.createTicket(purchaser, amount);

        const cartProducts = cart.products.filter(x => 
            incompletedProducts.includes(x.product.toString()));
        
        await controller.update(cartId, cartProducts);
        
        res.send('Se ejecutó correctamente');
    } catch (error) {
        res.status(400).json({error: CustomErrors.createError("Error del carrito", generateCartsError(), 'Cart ID Error', errorsType.CART_ERROR)});
    }
})

cartRoutes.post('/products/:pid', async (req, res) => {
    const productId = req.params.pid;
    try {
      const product = await productController.get(productId);
      res.status(201).send(product);
    } catch (error) {
      res.status(400).json({error: CustomErrors.createError("Error de producto", generateProductsError(), 'Send product Error', errorsType.PRODUCTS_ERROR)});
    }
});


cartRoutes.delete('/:cid/products/:pid', async (req, res) => {
    try{
        const prodId = req.params.pid;
        const cartId = req.params.cid;
        await controller.deleteProd(prodId, cartId);
        res.status(204).send("Producto eliminado del carrito");
    } catch (err) {
        res.status(400).json({error: CustomErrors.createError("Error del producto del carrito", generateCartsError(), 'Product(from cart) Error', errorsType.PRODUCTS_ERROR)});
    }
});

cartRoutes.delete('/:cid', async (req, res) => {
    try {
        const cartId = req.params.cid;
        await controller.delete(cartId);
        res.status(201).send("Todos los productos fueron eliminados");
    } catch (error) {
        res.status(400).json({error: CustomErrors.createError("Error del carrito", generateCartsError(), 'Delete cart Error', errorsType.CART_ERROR)});
    }
});

cartRoutes.put('/:cid', async (req, res) => {
    try {
        const cartId = req.params.cid;
        const products = req.body;

        res.status(200).send(await controller.update(cartId, products));
    } catch (error) {
        res.status(400).json({error: CustomErrors.createError("Error del carrito", generateCartsError(), 'Update cart ID Error', errorsType.CART_ERROR)});
    }
});

cartRoutes.put('/:cid/products/:pid', async (req, res) => {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    const quantity = req.body.quantity;
    try {

      await controller.updateProdQuan(cartId, productId, quantity);
      res.status(200).send("Se ejecutó exitosamente");
    } catch (error) {
        res.status(400).json({error: CustomErrors.createError("Error del carrito", generateCartsError(), 'Cart ID & User ID Error', errorsType.CART_ERROR)});
    }
});

export {cartRoutes};
