const socket = io();

const addToCart = document.querySelectorAll('.addToCart');

addToCart.forEach((btnAdd) => {
    btnAdd.addEventListener('click', function() {
        swal("Se agregó correctamente", "El producto fue agregado al carrito exitosamente.", "success");
        setTimeout(function(){
            swal.close();
        }, 1000);
    });
});