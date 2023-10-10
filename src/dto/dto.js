export class ProductDTO {
    constructor(product){
        this.name = product.name,
        this.img = product.img,
        this.stock = product.stock,
        this.price = product.price,
        this.description = product.description,
        this.code = product.code,
        this.type = product.type,
        this.active = true;
    }
}