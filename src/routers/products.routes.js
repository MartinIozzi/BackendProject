import { Router } from "express";
import ProductRepository from "../repository/project.repository.js";
import errorsType from '../utils/errors.js';
import CustomErrors from '../utils/customErrors.js';
import { generateProductsError } from "../utils/info.js";
import { authorize } from "../middlewares/auth.middleware.js";
import { transporter } from '../utils/mail.js';
//importo DAOs
import ProductManager from "../dao/fsManagers/productManager.js";
import { productService } from "../dao/dbManagers/product.service.js";
import userService from "../dao/dbManagers/user.service.js";
import userModel from "../models/user.model.js";


const controller = new ProductRepository(productService);
const productRouter = Router();

productRouter.get('/', async (req, res) => {
    try {
        const products = await controller.get();
        res.json(products);
    } catch (error) {
        res.status(500).json({error: CustomErrors.createError("Error de productos", generateProductsError(), 'Show Products Error', errorsType.PRODUCTS_ERROR)});
    }
});

productRouter.get("/:pid" , async (req, res)=> {
    const pid = req.params.pid;
    try {
        let products = await controller.getById(pid)
        res.send(products);
    } catch (error){
		res.status(500).json({error: CustomErrors.createError("Error de productos", generateProductsError(), 'Show Product Error', errorsType.PRODUCTS_ERROR)});
    }
});

productRouter.post('/', authorize('Premium'), async (req, res) => {
    const { user } = req.session;
    const userEmail = user.email;

  try {
    const user = await userModel.findOne({ email: userEmail });

        if (!user) {
            return res.status(404).json({ mensaje: 'Usuario no encontrado' });
        }
        if (req.user.rol !== 'Premium') {
            return res.status(403).send('No tienes permiso para agregar productos.');
        }
        if (req.user.rol == 'Premium') {
            const product = req.body;
            product.owner = userEmail;
            await controller.add(product);
        }
        
        socketServer.emit('send', await controller.get());
  } catch (error) {
      res.status(500).json({error: CustomErrors.createError("Error de productos", generateProductsError(), 'Add Product Error', errorsType.PRODUCTS_ERROR)});
    }
});

productRouter.put('/:pid', async (req, res) => {
    try{
        const id = req.params.pid;
        const updatedProduct = req.body;
        const updateProd = await controller.update(id, updatedProduct);
        res.status(200).json(updateProd);
    } catch (error) {
		res.status(500).json({error: CustomErrors.createError("Error de productos", generateProductsError(), 'Update Product Error', errorsType.PRODUCTS_ERROR)});
    }
})

productRouter.delete('/:pid', authorize("Premium"), async (req, res) => {
    const user = req.user;
    const userEmail = user.email;
    const id = (req.params.pid);

    try {
        if (user.rol === 'Premium') {
            const userMail = await userService.getByEmail(userEmail);
            
            const mailOptions = {
                from: 'Eliminación de producto <martiniozzi103@gmail.com>',
                to: userMail.email,
                subject: 'Aviso de eliminacion de productos del usuario',
                html: `
                  <div style="background-color: rgb(180, 200, 200); padding: 20px;">
                    <h1>Su producto fue eliminado de la lista</h1>
                    <p>Desde nuestra pagina web, se le notifica que su producto con id: ${id} fue eliminado de 
                    la lista de nuestros productos publicados, ante alguna duda comuniquese con nosotros o 
                    vuelva a enviar el producto a nuestras paginas.</p>
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
        }
        res.status(200).send(await controller.delete(id))
    } catch (error) {
		res.status(500).json({error: CustomErrors.createError("Error de productos", generateProductsError(), 'Delete Product Error', errorsType.PRODUCTS_ERROR)});
    }
});

export default productRouter;