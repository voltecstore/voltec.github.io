document.addEventListener('DOMContentLoaded', () => {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    updateCartCount();

    const products = [
        { id: 1, name: 'Gaming Klaviatura', price: 99.99, category: 'keyboards', rating: 4.5, image: 'https://placehold.co/300x200?text=Gaming+Keyboard' },
        { id: 2, name: 'Gaming Siçan', price: 49.99, category: 'mice', rating: 4.2, image: 'https://placehold.co/300x200?text=Gaming+Mouse' },
        { id: 3, name: 'Gaming Headset', price: 129.99, category: 'headsets', rating: 4.7, image: 'https://placehold.co/300x200?text=Headset' },
        { id: 4, name: 'Mousepad', price: 19.99, category: 'mousepads', rating: 4.0, image: 'https://placehold.co/300x200?text=Mousepad' },
        { id: 5, name: 'Cooling Fan', price: 29.99, category: 'fans', rating: 4.3, image: 'https://placehold.co/300x200?text=Cooling+Fan' },
    ];

    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', (e) => {
            const id = parseInt(e.target.dataset.id);
            const name = e.target.dataset.name;
            const price = parseFloat(e.target.dataset.price);
            addToCart({ id, name, price });
        });
    });

    const productGrid = document.getElementById('product-grid');
    if (productGrid) {
        loadProducts(products);
        console.log('Ürünler yüklendi');

        document.getElementById('category-filter').addEventListener('change', filterProducts);
        document.getElementById('price-filter').addEventListener('change', filterProducts);
        document.getElementById('rating-filter').addEventListener('change', filterProducts);

        function filterProducts() {
            const category = document.getElementById('category-filter').value;
            const price = document.getElementById('price-filter').value;
            const rating = document.getElementById('rating-filter').value;

            let filtered = products;

            if (category) filtered = filtered.filter(p => p.category === category);
            if (price) {
                if (price === '0-50') filtered = filtered.filter(p => p.price <= 50);
                else if (price === '50-100') filtered = filtered.filter(p => p.price > 50 && p.price <= 100);
                else if (price === '100+') filtered = filtered.filter(p => p.price > 100);
            }
            if (rating) filtered = filtered.filter(p => p.rating >= parseInt(rating));

            loadProducts(filtered);
        }
    }

    if (document.getElementById('cart-items')) {
        loadCart();
    }

    document.querySelector('.newsletter button')?.addEventListener('click', () => alert('Subscribed!'));
    const checkoutButton = document.getElementById('checkout-button');
    if (checkoutButton) {
        checkoutButton.addEventListener('click', () => {
            // WhatsApp numarasi (senin numaran: +994 050 547 46 78)
            const phoneNumber = '+994505474678'; // Bosluklar ve tireler kaldirildi
            // Varsayilan mesaj (istege bagli)
            const message = encodeURIComponent('Səbətimdəki məhsullar üçün məlumat istəyirəm. Səbət: ' + JSON.stringify(cart));
            // WhatsApp URL'si
            const whatsappURL = `https://wa.me/${phoneNumber}?text=${message}`;
            // Yonlendirme
            window.location.href = whatsappURL;
        });
    }

    function loadProducts(prods) {
        const grid = document.getElementById('product-grid');
        grid.innerHTML = '';
        prods.forEach(product => {
            const card = document.createElement('div');
            card.classList.add('product-card');
            card.innerHTML = `
                <img src="${product.image}" alt="${product.name}">
                <h3>${product.name}</h3>
                <p>$${product.price.toFixed(2)}</p>
                <button class="add-to-cart" data-id="${product.id}" data-name="${product.name}" data-price="${product.price}">Səbətə Əlavə Et</button>
            `;
            card.querySelector('.add-to-cart').addEventListener('click', (e) => {
                const id = parseInt(e.target.dataset.id);
                const name = e.target.dataset.name;
                const price = parseFloat(e.target.dataset.price);
                addToCart({ id, name, price });
            });
            grid.appendChild(card);
        });
    }

    function addToCart(item) {
        const existing = cart.find(i => i.id === item.id);
        if (existing) existing.quantity += 1;
        else cart.push({ ...item, quantity: 1 });
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        alert(`${item.name} səbətə əlavə olundu!`);
    }

    function updateCartCount() {
        const count = cart.reduce((sum, item) => sum + item.quantity, 0);
        document.querySelectorAll('#cart-count').forEach(el => el.textContent = count);
    }

    function loadCart() {
        const itemsDiv = document.getElementById('cart-items');
        itemsDiv.innerHTML = '';
        let total = 0;
        cart.forEach(item => {
            const div = document.createElement('div');
            div.classList.add('cart-item');
            div.innerHTML = `
                <span>${item.name} x ${item.quantity}</span>
                <span>$${ (item.price * item.quantity).toFixed(2) }</span>
                <button class="remove-item" data-id="${item.id}">Remove</button>
            `;
            div.querySelector('.remove-item').addEventListener('click', () => removeFromCart(item.id));
            itemsDiv.appendChild(div);
            total += item.price * item.quantity;
        });
        document.getElementById('cart-total').textContent = total.toFixed(2);
    }

    function removeFromCart(id) {
        const index = cart.findIndex(i => i.id === id);
        if (index > -1) {
            cart[index].quantity -= 1;
            if (cart[index].quantity <= 0) cart.splice(index, 1);
        }
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        loadCart();
    }

    // Tema geçişi (checkbox ile)
    const themeCheckbox = document.getElementById('theme-toggle-checkbox');
    if (themeCheckbox) {
        console.log('Checkbox bulundu');
        const currentTheme = localStorage.getItem('theme') || 'dark';
        if (currentTheme === 'light') {
            document.body.classList.add('light-mode');
            themeCheckbox.checked = true;
            console.log('Light mod aktif');
        } else {
            console.log('Dark mod aktif');
        }

        themeCheckbox.addEventListener('change', () => {
            console.log('Checkbox değişti, checked:', themeCheckbox.checked);
            document.body.classList.toggle('light-mode');
            const theme = document.body.classList.contains('light-mode') ? 'light' : 'dark';
            localStorage.setItem('theme', theme);
            console.log('Yeni tema:', theme);
        });
    } else {
        console.log('Checkbox bulunamadı!');
    }
});
