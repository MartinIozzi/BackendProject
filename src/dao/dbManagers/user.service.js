import userModel from "../../models/user.model.js"
import cartModel from "../../models/carts.model.js";
import config from '../../config/config.js';
import logger from "../../middlewares/logger.middleware.js";
import jwt from 'jsonwebtoken'
import moment from 'moment';

class UserService {
    constructor() {
        this.model = userModel;
        this.cartModel = cartModel;
    }

    async getAll(){
        try {
            return await this.model.find().lean();
        } catch (error) {
            logger.error('error al traer los usuarios', error);
        }
    }

    async getCurrentUser(req) {
        try {
            const token = req.headers.authorization;
            const decodedToken = jwt.verify(token, config.SECRET_KEY) // clave secreta para firmar los tokens
            const userId = decodedToken.userId;
            const user = await this.model.findById(userId);
            return user;
        } catch (error) {
            logger.error('error al traer el usuario actual', error);
        }
    }

    async getByEmail(email){
        try {
            return await this.model.findOne({email: email});
        } catch (error) {
            logger.error('error al traer el usuario por email', error);
        }
    }

    async getByName(username){
        try {
            return await this.model.findOne({username}).lean();
        } catch (error) {
            logger.error('error al traer el usuario por nombre', error);
        }
    }

    async createUser(userData){
        try {
            return await this.model.create(userData);
        } catch (error) {
            logger.error('error al crear el usuario', error);
        }
    }

    async getById(id) {
        try {
            return await this.model.findById(id);
        } catch (error) {
            logger.error('error al traer el usuario por _id', error);
        }
	}
    
    async getByCartId(cartId){
        try {
            return await this.model.findOne({cart: cartId}).lean();
        } catch (error) {
            logger.error('error al traer el carrito del usuario por cartId ', error);
        }
    }

    async getInactiveUsers() {
        const twoDaysAgo = moment().subtract(2, 'days').toDate();
        const formattedTwoDaysAgo = moment(twoDaysAgo).format('ddd MMM DD YYYY HH:mm:ss ZZ');

        const inactiveUsers = await this.model.find({
            last_connection: {
                $lt: formattedTwoDaysAgo,
            }
        });
        return inactiveUsers;
    }

    async deleteUserById(id){
        return await this.model.findByIdAndDelete(id)
    }
}

const userService = new UserService();

export default userService;