document.addEventListener('DOMContentLoaded', () => {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    updateCartCount();

    // Ürün verileri (fiyatlar manat, detaylar eklendi)
    const products = [
        { 
            id: 1, 
            name: 'EWEADN Klaviatura', 
            price: 44.99, 
            image: 'https://m.media-amazon.com/images/I/61F1Y0iZdEL._AC_SL1500_.jpg',
            details: {
                images: ['https://m.media-amazon.com/images/I/61F1Y0iZdEL._AC_SL1500_.jpg'],
                video: 'https://www.example.com/video1.mp4',
                description: 'rgb isikli\nmekanik\nkablolu'
            }
        },
        { 
            id: 2, 
            name: 'HKSJ X300 Kablolu Gaming Mouse', 
            price: 24.99, 
            image: 'https://placehold.co/300x200?text=Gaming+Mouse',
            details: {
                images: ['https://placehold.co/300x200?text=Gaming+Mouse'],
                video: 'https://www.example.com/video2.mp4',
                description: 'rgb isikli\nhassas sensör\nkablolu'
            }
        },
        { 
            id: 3, 
            name: 'LOGITECH G304 Kablosuz Gaming Mouse', 
            price: 69.99, 
            image: 'https://placehold.co/300x200?text=Headset',
            details: {
                images: ['https://placehold.co/300x200?text=Headset'],
                video: 'https://www.example.com/video3.mp4',
                description: 'kablosuz\nhafif tasarım\nuzun batarya'
            }
        },
        { id: 4, name: 'Gaming Headset', price: 99.99, image: 'https://placehold.co/300x200?text=Headset', details: { images: ['https://placehold.co/300x200?text=Headset'], video: '', description: 'kablosuz\nyüksek ses\nrahat' } },
        { id: 5, name: 'Mousepad', price: 19.99, image: 'https://placehold.co/300x200?text=Mousepad', details: { images: ['https://placehold.co/300x200?text=Mousepad'], video: '', description: 'büyük boy\nkaymaz\ndayanıklı' } },
        { id: 6, name: 'Cooling Fan', price: 39.99, image: 'https://placehold.co/300x200?text=Cooling', details: { images: ['https://placehold.co/300x200?text=Cooling'], video: '', description: 'hızlı soğutma\nsessiz\nportable' } },
        { id: 7, name: 'Gaming Monitor', price: 299.99, image: 'https://placehold.co/300x200?text=Monitor', details: { images: ['https://placehold.co/300x200?text=Monitor'], video: '', description: '144hz\nfull hd\nince çerçeve' } },
        { id: 8, name: 'USB Hub', price: 14.99, image: 'https://placehold.co/300x200?text=USB', details: { images: ['https://placehold.co/300x200?text=USB'], video: '', description: '4 port\nhızlı şarj\nkompakt' } },
    ];

    // Ürünleri yükleme fonksiyonu (index.html ve shop.html için)
    function loadProducts(prods) {
        const grid = document.getElementById('product-grid');
        if (!grid) return;
        grid.innerHTML = '';
        prods.forEach(product => {
            const card = document.createElement('div');
            card.classList.add('product-card');
            card.innerHTML = `
                <img src="${product.image}" alt="${product.name}">
                <h3>${product.name}</h3>
                <p>${product.price.toFixed(2)} ₼</p>
                <button class="add-to-cart" data-id="${product.id}" data-name="${product.name}" data-price="${product.price}">Səbətə Əlavə Et</button>
            `;
            card.addEventListener('click', () => openProductModal(product));
            grid.appendChild(card);
        });
    }

    // Ürün modalını açma fonksiyonu
    function openProductModal(product) {
        const modal = document.getElementById('product-modal');
        const mainImage = document.getElementById('main-image');
        const thumbnailGallery = document.getElementById('thumbnail-gallery');
        const videoSource = document.getElementById('video-source');
        const productName = document.getElementById('modal-product-name');
        const productPrice = document.getElementById('modal-product-price');
        const productDescription = document.getElementById('modal-product-description');
        const addToCartModal = document.getElementById('add-to-cart-modal');

        if (!modal) return;

        mainImage.src = product.details.images[0] || '';
        thumbnailGallery.innerHTML = '';
        (product.details.images || []).forEach((img, index) => {
            const thumb = document.createElement('img');
            thumb.src = img;
            thumb.alt = `${product.name} Thumbnail ${index + 1}`;
            thumb.addEventListener('click', () => mainImage.src = img);
            thumbnailGallery.appendChild(thumb);
        });

        videoSource.src = product.details.video || '';
        document.getElementById('product-video')?.load();

        productName.textContent = product.name || '';
        productPrice.textContent = `${product.price.toFixed(2) || '0.00'} ₼`;
        productDescription.innerHTML = (product.details.description || '').replace(/\n/g, '<br>');
        addToCartModal.setAttribute('data-id', product.id);
        addToCartModal.setAttribute('data-name', product.name);
        addToCartModal.setAttribute('data-price', product.price);

        modal.style.display = 'block';
    }

    // Sepeti yükleme (cart.html için)
    function loadCart() {
        const itemsDiv = document.getElementById('cart-items');
        if (!itemsDiv) return;
        itemsDiv.innerHTML = '';
        let total = 0;
        cart.forEach(item => {
            const product = products.find(p => p.id === item.id);
            if (product) {
                const div = document.createElement('div');
                div.classList.add('cart-item');
                div.innerHTML = `
                    <span>${item.name} x ${item.quantity || 1}</span>
                    <span>${(product.price * (item.quantity || 1)).toFixed(2)} ₼</span>
                    <button class="remove-item" data-id="${item.id}">Remove</button>
                `;
                div.querySelector('.remove-item').addEventListener('click', () => removeFromCart(item.id));
                itemsDiv.appendChild(div);
                total += product.price * (item.quantity || 1);
            } else {
                console.warn(`Ürün ID ${item.id} bulunamadı, sepetten kaldırılıyor.`);
                removeFromCart(item.id);
            }
        });
        document.getElementById('cart-total').textContent = `${total.toFixed(2)} ₼`;
    }

    // Sayfa yüklendiğinde ürünleri veya sepeti yükle
    const productGrid = document.getElementById('product-grid');
    if (productGrid) {
        loadProducts(products);
    }
    if (document.getElementById('cart-items')) {
        loadCart();
    }

    // Ürün ekleme butonları için event listener
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', (e) => {
            const id = parseInt(e.target.dataset.id);
            const name = e.target.dataset.name;
            const price = parseFloat(e.target.dataset.price);
            if (id && name && price) {
                addToCart({ id, name, price });
            } else {
                console.error('Ürün verisi eksik:', e.target.dataset);
            }
        });
    });

    // Modalda sepete ekleme
    document.getElementById('add-to-cart-modal')?.addEventListener('click', (e) => {
        const id = parseInt(e.target.dataset.id);
        const name = e.target.dataset.name;
        const price = parseFloat(e.target.dataset.price);
        if (id && name && price) {
            addToCart({ id, name, price });
            closeModal();
        } else {
            console.error('Modalda ürün verisi eksik:', e.target.dataset);
        }
    });

    // Modal kapatıcı
    const closeButton = document.querySelector('.close-button');
    if (closeButton) {
        closeButton.addEventListener('click', closeModal);
    }

    // Modal dışında tıklama ile kapatma
    window.addEventListener('click', (e) => {
        const modal = document.getElementById('product-modal');
        if (modal && e.target === modal) {
            closeModal();
        }
    });

    document.querySelector('.newsletter button')?.addEventListener('click', () => alert('Qeydiyyat tamamlandı!'));
    const checkoutButton = document.getElementById('checkout-button');
    if (checkoutButton) {
        checkoutButton.addEventListener('click', () => {
            const phoneNumber = '+994505474678';
            const message = encodeURIComponent('Səbətimdəki məhsullar üçün məlumat istəyirəm. Səbət: ' + JSON.stringify(cart));
            const whatsappURL = `https://wa.me/${phoneNumber}?text=${message}`;
            window.location.href = whatsappURL;
        });
    }

    function addToCart(item) {
        console.log('Sepete ekleniyor:', item);
        if (!item.id || !item.name || !item.price) {
            console.error('Ürün verisi eksik:', item);
            return;
        }
        const existing = cart.find(i => i.id === item.id);
        if (existing) {
            existing.quantity = (existing.quantity || 0) + 1;
        } else {
            cart.push({ ...item, quantity: 1 });
        }
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        if (document.getElementById('cart-items')) loadCart();
        alert(`${item.name} səbətə əlavə olundu!`);
    }

    function updateCartCount() {
        const count = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
        document.querySelectorAll('#cart-count').forEach(el => el.textContent = count);
    }

    function removeFromCart(id) {
        const index = cart.findIndex(i => i.id === id);
        if (index > -1) {
            cart[index].quantity -= 1;
            if (cart[index].quantity <= 0) cart.splice(index, 1);
        }
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        if (document.getElementById('cart-items')) loadCart();
    }

    function closeModal() {
        const modal = document.getElementById('product-modal');
        if (modal) {
            modal.style.opacity = '0';
            setTimeout(() => {
                modal.style.display = 'none';
                modal.style.opacity = '1'; // Animasyon sonrası sıfırlama
            }, 300); // Animasyon süresiyle eşleşmeli
        }
    }

    // Tema geçişi
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
