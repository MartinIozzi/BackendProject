const addToCart = document.querySelectorAll('.addToCart');

addToCart.forEach((btnAdd) => {
    btnAdd.addEventListener('click', function() {
        swal("Se agregó correctamente", "El producto fue agregado al carrito exitosamente.", "success");
        setTimeout(function(){
            swal.close();
        }, 1000);
    });
});
/*
const log = document.querySelectorAll('.log');

log.forEach((btnLog) => {
    btnLog.addEventListener('click', () => {
        swal("Error ", "Necesita iniciar sesión para agregar el producto a un carrito", "failed");
        setTimeout(function(){
            swal.close();
        }, 1000);
    });
});
*/
if (!user) {
    const addToCartButton = document.querySelector('.btn.btn-warning');
    addToCartButton.addEventListener('click', () => {
      swal("Error ", "Necesita iniciar sesión para agregar el producto a un carrito", "failed");
      setTimeout(function(){
        swal.close();
      }, 1000);
    });
  }