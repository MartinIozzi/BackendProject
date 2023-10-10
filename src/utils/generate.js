import { faker } from '@faker-js/faker'
import logger from '../middlewares/logger.middleware.js';

export function generateProducts(){
    try {
        let generatedProducts = 100;
        const products = []
        for (let i = 0; i < generatedProducts; i++) {
            products.push({
                _id: faker.database.mongodbObjectId(),
                name: faker.commerce.productName(),
                description: faker.commerce.productDescription(),
                price: faker.commerce.price(),
                code: faker.finance.accountNumber(5),
                stock: faker.finance.accountNumber({ length: 2 }),
                type: faker.commerce.productMaterial(),
                image: faker.image.url()
            })
        }
        return products
    } catch (error) {
        logger.error('error al generar los productos con Faker')
    }

}