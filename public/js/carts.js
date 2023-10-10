const forms = document.querySelectorAll('.updateQuantityForm');

forms.forEach((form) => {
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const quantity = form.querySelector('[name="quantity"]').value;
        const productId = form.querySelector('[name="productId"]').value;
        const cartId = form.querySelector('[name="cartId"]').value;

        try {
            const response = await fetch(`/api/carts/${cartId}/products/${productId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ quantity: quantity })
            });

            if (response.ok) {
                console.log('Cantidad actualizada con éxito');
            } else {
                console.error('Error al actualizar la cantidad');
            }
        } catch (error) {
            console.error('Error de red', error);
        }
    });
});


document.addEventListener('DOMContentLoaded', () => {
    const forms = document.querySelectorAll('.deleteProduct');

    forms.forEach((form) => {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
    
            const productId = form.querySelector('[name="productId"]').value;
            const cartId = form.querySelector('[name="cartId"]').value;
    
            try {
                const response = await fetch(`/api/carts/${cartId}/products/${productId}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
    
                if (response.ok) {
                    console.log('Producto eliminado con exito');
                } else {
                    console.error('Error al eliminar el producto');
                }
            } catch (error) {
                console.error('Error de red', error);
            }
        });
    });
});