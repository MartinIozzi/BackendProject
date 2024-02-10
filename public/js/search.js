const btn = document.querySelector('#button');
const result = document.querySelector('#result');
const form = document.querySelector('#form');

const filter = async function() {
    result.innerHTML = '';
    const searchTerm = form.value.toLowerCase();

    if (searchTerm === '') {
        return;
    }

    try {
        const response = await fetch('/api/products', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
        }});

        const products = await response.json();
        products.forEach(elem => {
            let name = elem.name.toLowerCase();
    
            if (name.startsWith(searchTerm)) {
                result.innerHTML += `
                <a href='/product/${elem._id}' class="product-list"><img class="icon-search-list" src="https://cdn.discordapp.com/attachments/838312221028909059/1176878358332706877/icons8-busqueda-50.png?
                ex=65ccc161&is=65ba4c61&hm=efcdda8ffc98c50fa710bea0c9cb1b3f572a67dba1399f876beb66ccf2e671a9&" alt="Icon Search">${elem.name}<br>
                `;
            }
        });
        
        if(result.innerHTML === ''){
            result.innerHTML += `
            <p class="product-list"><img class="icon-search-list" src="https://cdn.discordapp.com/attachments/838312221028909059/1176878358332706877/icons8-busqueda-50.png?
            ex=65ccc161&is=65ba4c61&hm=efcdda8ffc98c50fa710bea0c9cb1b3f572a67dba1399f876beb66ccf2e671a9&" alt="Icon Search">Producto no encontrado</p>
            `
        }
    } catch (error) {
        console.log(error);
    }
}

form.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault(); // Evitar que el formulario se envíe por defecto
        filter();
    }
});

form.addEventListener('keyup', filter);
btn.addEventListener('click', filter);


const prods = document.querySelector('#randomProds')

const randomProducts = async () => {
    try {
        const response = await fetch('/api/products/randomproducts', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
        }});

        const randomProducts = await response.json();

        let html = randomProducts.map(elem => {
            return `
            <a style="text-decoration: none; color: black;" href='/product/${elem._id}'>
                <div class="col-3 card card-custom pb-2">
                    <div class="product-img">
                        <img class="custom-img" src="${elem.img}">
                    </div>
                    <div class="ms-2">
                        <p>${elem.name}</p>
                        <p>$${elem.price}</p>
                    </div>
                </div>
            </a>
            `
        }).join(' ');
        
        prods.innerHTML = html;

    } catch (error) {
        console.log(error);
        throw error;
    };
};

randomProducts();
