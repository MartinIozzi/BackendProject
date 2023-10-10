import cartModel from "../../models/carts.model.js";
import { productService } from "./product.service.js";
import mongoose from "mongoose";
import logger from "../../middlewares/logger.middleware.js";

class CartService {
    constructor() {
        this.model = cartModel;
    }

    async getCart(){
      try {
        const carts = await this.model.find();
        return carts;
      } catch (error) {
        logger.error('error al obtener los carritos', error)
      }
    };

    async getCartId(cid){
      return cid;
    }

    async createCart(){
      try {
        const cartId = new mongoose.Types.ObjectId(); // Generar un nuevo ObjectId
        const createdCart = await this.model.create({ _id: cartId }); // Asignar el ObjectId al campo _id
        return createdCart._id.toString(); // Devolver el _id como una cadena de texto
      } catch (error) {
        logger.error('error al crear el carrito', error)
      }
    }

    async addCart(){
      try {
        const createdCart = await this.model.create({});
        return createdCart;
      } catch (error) {
        logger.error('error al agregar carrito', error);
      }
    };

    async getCartById (cid) {
      try {
        return await this.model.findById(cid).populate('products');
    } catch (error) {
      logger.error('error al obtener el carrito por id', error);
    }
  }

  async addProdToCart(cartId, productId) {
    try {
      const cart = await this.model.findById(cartId);
      if (!cart) {
        throw new Error('Carrito no encontrado');
      }
      const product = await productService.getProductByID(productId)
      if (!product) {
        throw new Error('Producto no encontrado');
      }
      const existingProduct = cart.products.find(
        (p) => p.product.toString() === productId.toString()
      );
      if (existingProduct) {
        existingProduct.quantity += 1;
      } else {
        cart.products.push({ product: product._id, quantity: 1});
      }
      return await cart.save();
    } catch (error) {
      logger.error('error al agregar un producto al carrito', error);
    }
  }

  async deleteProdFromCart(prodId, cartId){
  try{
    const cart = await this.model.findById(cartId);
    if (!cart) {
      throw new Error('Carrito no encontrado');
    }
    cart.products = cart.products.filter(
      (product) => product.product.toString() !== prodId
      );
      await cart.save();
      return cart;
    } catch (error) {
      logger.error('error al eliminar un producto del carrito', error);
      throw new Error('Error al eliminar un producto del carrito: ' + error.message)
    }
  }

  async deleteAllProd(cartId){
  try{
    const cart = await this.model.findById(cartId);
    if (cart) {
      cart.products = [];
      await cart.save();
    } else{
      throw new Error('Carrito no encontrado');
    }
    
  } catch (error){
    logger.error('error al eliminar todos los productos del carrito', error);
  }
}


async updateCart(cartId, products) {
try {
  const updatedCart = await this.model.findByIdAndUpdate(
    cartId,
    { products },
    { new: true }
    );
    return updatedCart;
  } catch (error) {
    logger.error('no se pudo actualizar los productos del carrito.', error);
  }
}

async updateProductQuantity(cartId, productId, quantity) {
  const cart = await this.model.findOne({ _id: cartId });
  const productIndex = cart.products.findIndex(
    (product) => product.product._id.toString() === productId
    );
    if (productIndex !== -1) {
      cart.products[productIndex].quantity = quantity;
      return await cart.save();
    } else {
      logger.error('el producto no fue encontrado dentro del carrito.');
    }
    }
}

export const cartService = new CartService();

