const socket = io();

function render(products) {
    let html = products.map((elem) => {
        return `
        <div class="col-3 bg-light pb-3 ms-5 border border-2 border-black" style="max-width: 25%; overflow: auto;">
            <hr>    
                <h4 class="nameProduct">Nombre: ${elem.name}</h4>
                <p>Descripcion: ${elem.description}</p>
                <p>Precio: $ ${elem.price}</p>
                <p>Codigo del producto: ${elem.code}</p>
                <p>Stock restante: ${elem.stock} productos</p>
                <p>Tipo de producto: ${elem.type}</p>
                <div>Archivo: ${elem.img}</div><br>
                <button class="deleteProduct btn btn-danger" type="submit" data-product-id="${elem._id}">Eliminar producto</button>
        </div>`;
    }).join(' ');

    document.getElementById('products').innerHTML = html;
}


socket.on('send', (products) => {
    render(products)
});


const deleteProducts = document.querySelectorAll('.deleteProduct');

document.getElementById('products').addEventListener('click', async (e) => {
    if (e.target.classList.contains('deleteProduct')) {
        e.preventDefault();
        
        const productId = e.target.dataset.productId;

        async function deleteProds() {
            const response = await fetch(`/api/products/${productId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (response.ok) {
                swal("Eliminacion de producto", "El producto del usuario fue eliminado exitosamente.", "success");
                setTimeout(function(){
                    swal.close()
                }, 1000);
            } else {
                swal("Error", "Error al eliminar el producto.", "error");
            }
        };
        deleteProds();
}});
