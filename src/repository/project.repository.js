import { ProductDTO } from "../dto/dto.js";

export default class ProductRepository {
    constructor (dao) {
        this.dao = dao;
    }

    async get(){
        try {
            return await this.dao.getProducts();
        } catch (error) {
            logger.error('error al obtener productos', error);
        } 
    }

    async getById(pid){
        try {
            return await this.dao.getProductByID(pid);
        } catch (error) {
            logger.error('error al obtener producto por id', error);
        }
    }

    async getName(pid){
        try {
            return await this.dao.getProductName(pid);
        } catch (error) {
            logger.error('error al obtener producto por id', error);
        }
    }

    async getPrice(pid){
        try {
            return await this.dao.getProductPrice(pid);
        } catch (error) {
            logger.error('error al obtener producto por id', error);
        }
    }

    async add(product){
        try {
            const newProduct = new ProductDTO(product)
            return await this.dao.addProduct(newProduct);
        } catch (error) {
            logger.error('error al agregar productos', error);
        }
    }

    async update(id, product){
        try {
            return await this.dao.updateProduct(id, product);
        } catch (error) {
            logger.error('error al actualizar productos', error);
        }
    }

    async delete(id){
        try {
            return await this.dao.deleteProduct(id);
        } catch (error) {
            logger.error('error al eliminar productos', error);
        }
    }

    async find(limit, sort, query, page){
        try {
            return await this.dao.findWithPagination(limit, sort, query, page);
        } catch (error) {
            logger.error('error al filtrar productos', error);
        }
    }
}

export class UserRepository {
    constructor (dao) {
        this.dao = dao;
    }
    
    async get(){
        try {
            return await this.dao.getAll();
        } catch (error) {
            logger.error('error al traer los usuarios', error);
        } 
    }

    async getById(id){
        try {
            return await this.dao.getById(id);
        } catch (error) {
            logger.error('error al traer el usuario por id', error);
        }
    }

    async getByCartId(cartId){
        try {
            return await this.dao.getByCartId(cartId)
        } catch (error) {
            logger.error('error al traer el carrito del usuario por cartId ', error);
        }
    }
    
    async create(user){
        try {
            return await this.dao.createUser(user);
        } catch (error) {
            logger.error('error al crear el usuario', error);
        }
    }
}

export class CartRepository {
    constructor (dao) {
        this.dao = dao;
    }
    
    async get(){
        try {
            return await this.dao.getCart();
        } catch (error) {
            logger.error('error al obtener los carritos', error)
        } 
    }

    async getById(cartId){
        try {
            return await this.dao.getCartById(cartId)
        } catch (error) {
            logger.error('error al obtener el carrito por id', error);
        }
    }

    async create(){
        try {
            return await this.dao.createCart();
        } catch (error) {
            logger.error('error al crear el carrito', error)
        }
    }
    
    async add(cartId, productId){
        try {
            return await this.dao.addProdToCart(cartId, productId);
        } catch (error) {
            logger.error('error al agregar un producto al carrito', error);
        }
    }

    async update(id, product){
        try {
            return await this.dao.updateCart(id, product);
        } catch (error) {
            logger.error('no se pudo actualizar los productos del carrito.', error);
        }
    }

    async delete(id){
        try {
            return await this.dao.deleteAllProd(id);
        } catch (error) {
            logger.error('error al eliminar todos los productos del carrito', error);
        }
    }
    //----------------------------//
    async updateProdQuan(cartId, productId, quantity){
        try {
            return await this.dao.updateProductQuantity(cartId, productId, quantity);
        } catch (error) {
            logger.error('el producto no fue encontrado dentro del carrito.');
        }
    }

    async deleteProd(prodId, cartId){
        try {
            return await this.dao.deleteProdFromCart(prodId, cartId)
        } catch (error) {
            logger.error('error al eliminar un producto del carrito', error);
        }
    }
}