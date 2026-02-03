// script.js - RAUDA BOUTIQUE

const CONFIG = {
    whatsappNumber: '5493447558764', // Tu número
    businessName: 'Rauda Boutique',
};

// DATOS MOCK (Simulando catálogo de boutique)
// Usamos tus categorías regionales
const CATALOG = [
    // MATES
    { 
        id: 1,
        categoria: 'Mates', 
        producto: 'Mate Imperial Premium', 
        precio: 45000, 
        descripcion: 'Calabaza seleccionada, forrado en cuero vaqueta con virola de alpaca cincelada a mano.', 
        imagen: 'https://images.unsplash.com/photo-1616682662369-0268b8c2cc62?q=80&w=800&auto=format&fit=crop', 
        destacado: true 
    },
    { 
        id: 2,
        categoria: 'Mates', 
        producto: 'Mate Camionero Algarrobo', 
        precio: 28000, 
        descripcion: 'Madera de algarrobo estacionada, boca ancha ideal para yerba uruguaya.', 
        imagen: 'https://images.unsplash.com/photo-1596489397635-c80f4db23932?q=80&w=800&auto=format&fit=crop', 
        destacado: false 
    },
    // CUCHILLERIA
    { 
        id: 3,
        categoria: 'Cuchillería', 
        producto: 'Cuchillo Verijero 15cm', 
        precio: 35000, 
        descripcion: 'Hoja de acero al carbono, cabo de madera dura y terminaciones en bronce.', 
        imagen: 'https://images.unsplash.com/photo-1591375821868-b3cb075d9e5d?q=80&w=800&auto=format&fit=crop', 
        destacado: true 
    },
    // MARROQUINERIA
    { 
        id: 4,
        categoria: 'Cuero', 
        producto: 'Billetera Vaqueta', 
        precio: 18500, 
        descripcion: '100% cuero genuino, costura a mano. Diseño minimalista y duradero.', 
        imagen: 'https://images.unsplash.com/photo-1627123424574-181ce5171c98?q=80&w=800&auto=format&fit=crop', 
        destacado: false 
    },
    { 
        id: 5,
        categoria: 'Cuero', 
        producto: 'Bolso Matero Rústico', 
        precio: 62000, 
        descripcion: 'Cuero graso, compartimientos rígidos para termo y mate. Correa regulable.', 
        imagen: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=800&auto=format&fit=crop', 
        destacado: true 
    },
    // TEXTILES
    { 
        id: 6,
        categoria: 'Textiles', 
        producto: 'Ruana de Lana Oveja', 
        precio: 55000, 
        descripcion: 'Tejida en telar, tintes naturales. Tono crudo y visón.', 
        imagen: 'https://images.unsplash.com/photo-1520013322197-09e25d487201?q=80&w=800&auto=format&fit=crop', 
        destacado: false 
    }
];

let cart = [];

document.addEventListener('DOMContentLoaded', () => {
    initApp();
    loadCart();
});

function initApp() {
    renderCategories();
    // Renderizar la primera categoría por defecto
    const categories = [...new Set(CATALOG.map(item => item.categoria))];
    if (categories.length > 0) renderProducts(categories[0]);
}

function renderCategories() {
    const nav = document.getElementById('nav-tabs');
    const categories = [...new Set(CATALOG.map(item => item.categoria))];
    
    // Agregamos "Destacados" al principio
    nav.innerHTML = `
        <li>
            <button onclick="renderProducts('Destacados', this)" class="nav-tab active text-xs md:text-sm font-bold uppercase tracking-widest px-4 py-2 text-rauda-dark/50 hover:text-rauda-terracotta">
                Destacados
            </button>
        </li>
    `;

    categories.forEach(cat => {
        const li = document.createElement('li');
        li.innerHTML = `
            <button onclick="renderProducts('${cat}', this)" class="nav-tab text-xs md:text-sm font-bold uppercase tracking-widest px-4 py-2 text-rauda-dark/50 hover:text-rauda-terracotta">
                ${cat}
            </button>
        `;
        nav.appendChild(li);
    });
}

function renderProducts(category, btnElement) {
    // UI Actualización de tabs
    if (btnElement) {
        document.querySelectorAll('.nav-tab').forEach(btn => btn.classList.remove('active', 'text-rauda-terracotta'));
        document.querySelectorAll('.nav-tab').forEach(btn => btn.classList.add('text-rauda-dark/50'));
        btnElement.classList.add('active', 'text-rauda-terracotta');
        btnElement.classList.remove('text-rauda-dark/50');
    }

    const container = document.getElementById('main-content');
    let items;

    if (category === 'Destacados') {
        items = CATALOG.filter(i => i.destacado);
    } else {
        items = CATALOG.filter(i => i.categoria === category);
    }

    // Animación de salida breve
    container.style.opacity = '0';
    
    setTimeout(() => {
        const titleHtml = `
            <div class="flex items-center gap-4 mb-12">
                <span class="h-px bg-rauda-leather/20 flex-1"></span>
                <h2 class="text-3xl font-display text-rauda-leather text-center uppercase tracking-widest">${category}</h2>
                <span class="h-px bg-rauda-leather/20 flex-1"></span>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
                ${items.map(item => createCard(item)).join('')}
            </div>
        `;
        container.innerHTML = titleHtml;
        container.style.opacity = '1';
        
        // Animación de entrada para las cards
        document.querySelectorAll('.product-card').forEach((el, index) => {
            el.style.animation = `fadeIn 0.8s ease-out ${index * 0.1}s forwards`;
            el.style.opacity = '0';
        });
    }, 300);
}

function createCard(item) {
    return `
    <article class="product-card group cursor-pointer" onclick='openProductModal(${JSON.stringify(item)})'>
        <div class="relative overflow-hidden aspect-[4/5] bg-gray-200 mb-6">
            <img src="${item.imagen}" class="product-image w-full h-full object-cover transition-transform duration-700 ease-in-out" alt="${item.producto}">
            <div class="absolute inset-0 bg-rauda-dark/10 group-hover:bg-transparent transition-colors"></div>
            
            <button class="absolute bottom-0 right-0 bg-white text-rauda-leather px-6 py-3 font-bold uppercase text-xs tracking-widest translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                Ver Detalle
            </button>
        </div>
        
        <div class="text-center">
            <h3 class="font-serif text-lg text-rauda-dark mb-1 group-hover:text-rauda-terracotta transition-colors">${item.producto}</h3>
            <span class="font-sans font-light text-rauda-leather text-sm">$${item.precio.toLocaleString('es-AR')}</span>
        </div>
    </article>
    `;
}

// LOGICA DE CARRITO (Adaptada de El Rey, pero más elegante)
function addToCart(item) {
    const existing = cart.find(i => i.id === item.id);
    if (existing) {
        existing.cantidad++;
    } else {
        cart.push({ ...item, cantidad: 1 });
    }
    saveCart();
    updateCartIcon();
    
    // Feedback sutil
    const btn = document.getElementById('modal-add-btn');
    const originalText = btn.innerText;
    btn.innerText = "AGREGADO ✓";
    btn.classList.add('bg-rauda-terracotta');
    setTimeout(() => {
        btn.innerText = originalText;
        btn.classList.remove('bg-rauda-terracotta');
        closeProductModal();
    }, 1000);
}

function removeFromCart(id) {
    const index = cart.findIndex(i => i.id === id);
    if (index > -1) {
        cart.splice(index, 1);
        saveCart();
        updateCartIcon();
        renderCartItems();
    }
}

function updateCartIcon() {
    const count = cart.reduce((acc, item) => acc + item.cantidad, 0);
    document.getElementById('cart-count').innerText = count;
    const fab = document.getElementById('cart-fab');
    if (count > 0) fab.classList.remove('hidden');
    else fab.classList.add('hidden');
}

function renderCartItems() {
    const container = document.getElementById('cart-items-container');
    const totalEl = document.getElementById('cart-total');
    let total = 0;

    if (cart.length === 0) {
        container.innerHTML = `<div class="text-center py-20 opacity-50 font-serif italic">Tu selección está vacía.</div>`;
        totalEl.innerText = "$0";
        return;
    }

    container.innerHTML = cart.map(item => {
        total += item.precio * item.cantidad;
        return `
        <div class="flex gap-4 py-4 border-b border-rauda-leather/5">
            <div class="w-16 h-16 bg-gray-100 shrink-0">
                <img src="${item.imagen}" class="w-full h-full object-cover">
            </div>
            <div class="flex-1">
                <h4 class="font-serif text-rauda-dark">${item.producto}</h4>
                <p class="text-xs text-rauda-leather/60 mb-2">$${item.precio.toLocaleString('es-AR')} x ${item.cantidad}</p>
            </div>
            <button onclick="removeFromCart(${item.id})" class="text-rauda-terracotta hover:text-red-700 text-xs font-bold uppercase tracking-wider self-center">
                Eliminar
            </button>
        </div>
        `;
    }).join('');

    totalEl.innerText = "$" + total.toLocaleString('es-AR');
}

function sendOrderToWhatsapp() {
    if (cart.length === 0) return;
    
    // Mensaje formal estilo Boutique
    let message = `Hola *${CONFIG.businessName}*, estoy interesado en adquirir los siguientes productos de su catálogo online:%0A%0A`;
    let total = 0;
    
    cart.forEach(item => {
        total += item.precio * item.cantidad;
        message += `• ${item.cantidad}x *${item.producto}* ($${(item.precio * item.cantidad).toLocaleString('es-AR')})%0A`;
    });
    
    message += `%0A────────────────%0A`;
    message += `*Total Estimado: $${total.toLocaleString('es-AR')}*%0A`;
    message += `%0A¿Podrían confirmarme la disponibilidad y métodos de envío? Muchas gracias.`;

    window.open(`https://wa.me/${CONFIG.whatsappNumber}?text=${message}`, '_blank');
}

// MODALES
function openProductModal(item) {
    document.getElementById('modal-img').src = item.imagen;
    document.getElementById('modal-cat').innerText = item.categoria;
    document.getElementById('modal-title').innerText = item.producto;
    document.getElementById('modal-desc').innerText = item.descripcion;
    document.getElementById('modal-price').innerText = "$" + item.precio.toLocaleString('es-AR');
    
    // Reemplazar botón para limpiar eventos anteriores
    const btn = document.getElementById('modal-add-btn');
    const newBtn = btn.cloneNode(true);
    btn.parentNode.replaceChild(newBtn, btn);
    newBtn.onclick = () => addToCart(item);

    const modal = document.getElementById('product-modal');
    modal.classList.remove('hidden');
    requestAnimationFrame(() => {
        document.getElementById('modal-backdrop').classList.remove('opacity-0');
        document.getElementById('modal-panel').classList.remove('opacity-0', 'translate-y-8');
    });
}

function closeProductModal() {
    document.getElementById('modal-backdrop').classList.add('opacity-0');
    document.getElementById('modal-panel').classList.add('opacity-0', 'translate-y-8');
    setTimeout(() => document.getElementById('product-modal').classList.add('hidden'), 300);
}

function openCartModal() {
    renderCartItems();
    const modal = document.getElementById('cart-modal');
    modal.classList.remove('hidden');
    requestAnimationFrame(() => {
        document.getElementById('cart-backdrop').classList.remove('opacity-0');
        document.getElementById('cart-panel').classList.remove('translate-x-full');
    });
}

function closeCartModal() {
    document.getElementById('cart-backdrop').classList.add('opacity-0');
    document.getElementById('cart-panel').classList.add('translate-x-full');
    setTimeout(() => document.getElementById('cart-modal').classList.add('hidden'), 500);
}

// Persistencia local
function saveCart() { localStorage.setItem('rauda_cart', JSON.stringify(cart)); }
function loadCart() {
    const stored = localStorage.getItem('rauda_cart');
    if (stored) { cart = JSON.parse(stored); updateCartIcon(); }
}