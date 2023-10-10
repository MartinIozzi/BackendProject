import fs from 'fs';
import logger from '../../middlewares/logger.middleware.js'

class ProductManager {
    constructor() {
        this.path = './src/models/json/products.json';
        
        //Creo este código para que si no existe nada en el JSON cree igual lo que vendria siendo el array donde contendría los productos.
        if (!(fs.existsSync(this.path))) {
            fs.writeFileSync(
                this.path,
                JSON.stringify([]))
        }else{
            this.products = JSON.parse(fs.readFileSync(this.path, 'utf-8'))
        }
    }
    //Creo el parse en donde los productos del JSON se quedan para poder utilizarlo en las funciones de mas adelante.
    async getProducts(){
        try {
            const actualProducts = await (fs.promises.readFile(this.path, 'utf-8'));
            return JSON.parse(actualProducts);
        } catch (e) {
            logger.error('error al obtener los productos', error)
        }
    };

    //Se agregan los productos, los cuales son aclarados abajo, al array de productos creado en el código de this.path.
    async addProduct(product) {
        try {
            let products = await this.getProducts()
            if(products.find(element => element.code == product.code) != undefined){
                return logger.error('Error al agregar producto: Ya existe el código "' + product.code + '"')
            }
        
            
            let id = 0  //creo una variable que contenga la id
            let index = products.length - 1 //creo una variable que reste en 1 el valor del length de los productos.
            if(index >= 0){     //si el index es mayor igual a 0,
                id = products[index].id //entonces id vale la id del producto del momento, la cual se verifica con el index y se aplica la id
                id++    //al verificar eso, para el proximo producto a crear se suma +1 el valor de la ultima id.
            }
            product.id = id.toString();     //el id del producto en el que se estaría trabajando se convierte en string
            products.push(product); 
            this.updateProducts(products);  

        } catch (error) {
            logger.error('error al agregar el producto', error)
        }
    }

    async updateProducts(products){
        try {
            await fs.promises.writeFile(this.path,
                JSON.stringify(products))
        } catch (error) {
            logger.error('error al actualizar los productos', error)
        }

    }
    //Este metodo, seleccionaría una id, escrita al final del código, la cual permita filtrar por ID los productos.
    async getProductByID(id){
        try {
            const actualProducts = await this.getProducts()
            return actualProducts.find(element => element.id == id)
        } catch (error) {
            logger.error('error al obtener el producto por id', error)
        }

    }
    
    //Este metodo permite leer el codigo, del array que contiene la lista de los productos.

    readCodes(){
        try {
            let readCode = JSON.parse(fs.readFileSync(this.path, 'utf-8'));
            return readCode;
        } catch (error) {
            logger.error('error al leer el archivo .json', error)
        }

    }

    //Este metodo, permite, seleccionando la ID del producto, poder sobreescribir los datos de uno seleccionado.
    async updateProduct(id, product) {
        try {
            let products = await this.getProducts()
            let index = products.findIndex(element => element.id == id);
            product.id = id;
            products[index] = product;
            fs.writeFileSync(this.path, JSON.stringify(products));
            if(index == -1){return console.log('Error al actualizar producto: No existe la ID: ' + id)}
        } catch (error) {
            logger.error('error al actualizar el producto', error)
        }
    }

    async deleteProduct(id) {
        try {
            let products = await this.getProducts()
            let index = products.findIndex(element => element.id == id);
            if(index == -1){return console.log('Error al borrar producto: No existe la ID: ' + id)}
    
            products.splice(index, 1);
            fs.writeFileSync(this.path, JSON.stringify(products));
        } catch (error) {
            logger.error('error al eliminar el producto', error)
        }

    }
}

export default ProductManager;