import fs from 'fs';
import logger from "../../middlewares/logger.middleware.js";


class CartManager {
    constructor() {
        this.path = './src/models/json/carts.json'
        this.id = 0;
        this.products = [] 

        if (!(fs.existsSync(this.path))) {
            fs.writeFileSync(
                this.path,
                JSON.stringify([]))
        }else{
            this.products = JSON.parse(fs.readFileSync(this.path, 'utf-8'))
        }
        let index = this.products.length - 1   //detecta el ultimo index y asigna la id del mismo.
        if(index >= 0){
            this.id = this.products[index].id
        }
    }

    async updateCart () {  //se escribe el carrito en el JSON del carts.json
        try {
            await fs.promises.writeFile(this.path, JSON.stringify(this.products));
        } catch (error) {
            logger.error('error al actualizar el carrito', error);
        }
    }

    async getCart(){    //se leen los carritos
        try {
            const readCart = await fs.promises.readFile(this.path, 'utf-8');
            return JSON.parse(readCart);
        } catch (error) {
            logger.error('error al traer el carrito', error);
        }
    };

    async createCart(){    //agrega carritos en el JSON
        try {
            let cartArray = this.products   //creo una variable que contenga el this.products
            this.id++;  //id que se autoincrementa
            let carrito = {     //variable para crear un carrito vacio, con su respectiva id
                cart: [],
                id: this.id
            }
            cartArray.push(carrito);    //se pushea dentro del this.products el carrito
            this.updateCart(); //se escribe en el JSON los datos actualizados
            return cartArray;   //se retorna el array de carritos
        }
        catch(e) {
            logger.error('error al crear el carrito', error)
        }
    };

    addProdToCart(cartId, product){
        try {
            let index = this.products.findIndex(carrito => carrito.id == cartId);   //busca la id dentro de this.products, e iguala el valor de la id dentro del mismo a cartId
        if(index == -1){    //verificamos, si el carrito no existe, crea un array que contenga esos datos
            this.id++;
            let carrito = {
                cart: [product],    //se pushea el producto dentro del array de cart, el cual está en el objeto creado
                id: this.id
            }
            product.quantity = 1;   //para que cuando se crea el producto, se identifique que el valor sea 1
            this.products.push(carrito);    //se pushea el array de this.products al carrito, para que lo muestre como un objeto dentro del array
            this.updateCart(); //se escriben los datos en el this.path
            return;
        }
        //cuando el producto se crea:
        let carritoUsuario = this.products[index].cart; //se crea un variable, toma el array, pone el id de cart y lo muestra en cart
        let indexProducto = carritoUsuario.findIndex(producto => producto.id == product.id) // busca por index, el valor id de carritoUsuario, para igualarlo a product.id, el cual es la id pasada por params
        //verificamos
        if(indexProducto == -1){    //si indexProduct es igual a -1
            product.quantity = 1;   //se crea un quantity de 1
            this.products[index].cart.push(product) //se busca por index, en el array, el carrito seleccionado desde el params, y pushea el producto que antes fue definido, como la id, en la variable indexProducto
            return this.updateCart();  //se retorna para que escriba los datos en el json
        }
        //quantity
        let cantidad = carritoUsuario[indexProducto].quantity + 1   //toma el array del cart que se seleccione y el id de los productos seleccionados y le suma la cantidad de 1
        this.products[index].cart[indexProducto].quantity = cantidad    /* toma el array de this.products y el array seleccionado por la variable index; luego toma cart, 
        selecciona la id del producto y eso lo iguala a la cantidad que se le sumó en la variable anterior */
        this.updateCart(); //escribe los productos dentro del json.
        } catch (e) {
            logger.error('error al agregar un producto al carrito', error)
        }
    }
}

export default CartManager;