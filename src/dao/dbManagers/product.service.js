import { productModel } from '../../models/products.model.js';
import mongoose from 'mongoose';
import logger from "../../middlewares/logger.middleware.js";


class ProductService {
    constructor() {
        this.model = productModel;
    }
    async getProducts(){
        try {
            return await this.model.find().lean();
        } catch (error) {
            logger.error('error al obtener productos', error);
        }
    };

    async addProduct(product) {
        try {
            return await this.model.create(product)
        } catch (error) {
            logger.error('error al agregar productos', error);
        }
    }
    
    async findWithPagination(limit, sort, query, page){
        try {
            const options = {lean: true, page, limit, sort};
            const prods = await this.model.paginate(query, options);
            return prods;
        } catch (error) {
            logger.error('error al filtrar productos', error);
        }
    }

    async getProductByID(id) {
        try {
            return await this.model.findOne({ _id: id });
        } catch (error) {
            logger.error('error al obtener producto por id', error);
        }
    }

    async getProductName(productId) {
        try {
          const product = await this.model.findById(productId);
          if (!product) {
            throw new Error(`Producto con ID ${productId} no encontrado`);
        }
          return product.name;
        } catch (error) {
            logger.error('error al obtener producto por nombre', error);
        }
      }

    async getProductPrice(productId) {
        try {
          const product = await this.model.findById(productId);
          if (!product) {
            throw new Error(`Producto con ID ${productId} no encontrado`);
        }
          return product.price;
        } catch (error) {
            logger.error('error al obtener el precio del producto', error);
        }
      }

    async updateProduct(id, data) {
        try {
            console.log(id);
            let product = await this.model.findById(id);
            
            if(!product){
                throw new Error('Product not found');
            } 
    
            for (const key in data) {
                product[key] = data[key];
            }
    
            return await product.save();
        } catch (error) {
            logger.error('error al actualizar productos', error);
        }
    }

    async deleteProduct(id) {
        try {
            await this.model.deleteOne({_id: id})
        } catch (error) {
            logger.error('error al eliminar productos', error);
        }
    }

    async find(query, limit) {
        try {
            return await this.model.find({type: query}).limit(limit)
        } catch (error) {
            logger.error('error al encontrar productos', error);
        }
    }
}

export const productService = new ProductService();