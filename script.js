// script.js - RAUDA BOUTIQUE (LÓGICA PREMIUM + GRID COMPACTA)

const CONFIG = {
    whatsappNumber: '5493447558764', // Tu número real
    businessName: 'Rauda Boutique',
};

// DATOS MOCK
const CATALOG = [
    { 
        id: 1, categoria: 'Mates', producto: 'Mate Imperial Premium', precio: 45000, 
        descripcion: 'Calabaza seleccionada, forrado en cuero vaqueta con virola de alpaca cincelada a mano.', 
        imagen: 'https://images.unsplash.com/photo-1616682662369-0268b8c2cc62?q=80&w=800&auto=format&fit=crop', destacado: true 
    },
    { 
        id: 2, categoria: 'Mates', producto: 'Mate Camionero Algarrobo', precio: 28000, 
        descripcion: 'Madera de algarrobo estacionada, boca ancha ideal para yerba uruguaya.', 
        imagen: 'https://images.unsplash.com/photo-1596489397635-c80f4db23932?q=80&w=800&auto=format&fit=crop', destacado: false 
    },
    { 
        id: 3, categoria: 'Cuchillería', producto: 'Cuchillo Verijero 15cm', precio: 35000, 
        descripcion: 'Hoja de acero al carbono, cabo de madera dura y terminaciones en bronce.', 
        imagen: 'https://images.unsplash.com/photo-1591375821868-b3cb075d9e5d?q=80&w=800&auto=format&fit=crop', destacado: true 
    },
    { 
        id: 4, categoria: 'Cuero', producto: 'Billetera Vaqueta', precio: 18500, 
        descripcion: '100% cuero genuino, costura a mano. Diseño minimalista y duradero.', 
        imagen: 'https://images.unsplash.com/photo-1627123424574-181ce5171c98?q=80&w=800&auto=format&fit=crop', destacado: false 
    },
    { 
        id: 5, categoria: 'Cuero', producto: 'Bolso Matero Rústico', precio: 62000, 
        descripcion: 'Cuero graso, compartimientos rígidos para termo y mate. Correa regulable.', 
        imagen: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=800&auto=format&fit=crop', destacado: true 
    },
    { 
        id: 6, categoria: 'Textiles', producto: 'Ruana de Lana Oveja', precio: 55000, 
        descripcion: 'Tejida en telar, tintes naturales. Tono crudo y visón.', 
        imagen: 'https://images.unsplash.com/photo-1520013322197-09e25d487201?q=80&w=800&auto=format&fit=crop', destacado: false 
    }
];

// ESTADO GLOBAL
let cart = [];
let selectedPayment = 'Efectivo'; // Default

document.addEventListener('DOMContentLoaded', () => {
    initApp();
    loadCart();
});

function initApp() {
    renderCategories();
    const categories = [...new Set(CATALOG.map(item => item.categoria))];
    if (categories.length > 0) renderProducts(categories[0]);
}

function renderCategories() {
    const nav = document.getElementById('nav-tabs');
    const categories = [...new Set(CATALOG.map(item => item.categoria))];
    
    nav.innerHTML = `
        <li>
            <button onclick="renderProducts('Destacados', this)" class="nav-tab active text-xs md:text-sm font-bold uppercase tracking-widest px-4 py-2 text-rauda-dark/50 hover:text-rauda-terracotta transition-colors">
                Destacados
            </button>
        </li>
    `;

    categories.forEach(cat => {
        const li = document.createElement('li');
        li.innerHTML = `
            <button onclick="renderProducts('${cat}', this)" class="nav-tab text-xs md:text-sm font-bold uppercase tracking-widest px-4 py-2 text-rauda-dark/50 hover:text-rauda-terracotta transition-colors">
                ${cat}
            </button>
        `;
        nav.appendChild(li);
    });
}

function renderProducts(category, btnElement) {
    if (btnElement) {
        document.querySelectorAll('.nav-tab').forEach(btn => btn.classList.remove('active', 'text-rauda-terracotta'));
        btnElement.classList.add('active', 'text-rauda-terracotta');
        btnElement.classList.remove('text-rauda-dark/50');
        btnElement.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }

    const container = document.getElementById('main-content');
    let items = (category === 'Destacados') ? CATALOG.filter(i => i.destacado) : CATALOG.filter(i => i.categoria === category);

    container.style.opacity = '0';
    container.style.transform = 'translateY(10px)';
    
    setTimeout(() => {
        const titleHtml = `
            <div class="flex items-center gap-3 mb-6 md:mb-10 fade-in-up">
                <span class="h-px bg-rauda-leather/10 flex-1"></span>
                <h2 class="text-xl md:text-4xl font-display font-bold text-rauda-leather text-center uppercase tracking-wider">${category}</h2>
                <span class="h-px bg-rauda-leather/10 flex-1"></span>
            </div>
            <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6 pb-10">
                ${items.map((item, index) => createCard(item, index)).join('')}
            </div>
        `;
        
        container.innerHTML = titleHtml;
        container.style.opacity = '1';
        container.style.transform = 'translateY(0)';
    }, 300);
}

function createCard(item, index) {
    // Hemos ajustado los tamaños de texto (text-sm, text-[10px]) para que entren bien en las cards chicas
    return `
    <article class="product-card group cursor-pointer" onclick='openProductModal(${JSON.stringify(item)})' style="animation: fadeInUp 0.6s ease-out ${index * 0.1}s backwards">
        <div class="relative overflow-hidden aspect-card bg-gray-200 mb-3 rounded-lg shadow-sm">
            <img src="${item.imagen}" class="product-image w-full h-full object-cover transition-transform duration-700 ease-in-out" alt="${item.producto}" loading="lazy">
            <div class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div class="absolute bottom-2 right-2 bg-white/90 backdrop-blur-sm text-rauda-leather w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center shadow-lg md:translate-y-12 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100 transition-all duration-300">
                <i class="ph-bold ph-plus text-base md:text-lg"></i>
            </div>
        </div>
        <div class="px-1">
            <div class="flex flex-col gap-1">
                <h3 class="font-serif text-sm md:text-lg text-rauda-dark leading-tight group-hover:text-rauda-terracotta transition-colors line-clamp-2 min-h-[2.5em]">${item.producto}</h3>
                <span class="font-sans font-bold text-rauda-leather whitespace-nowrap bg-rauda-sand/30 px-2 py-1 rounded text-[10px] md:text-xs self-start">$${item.precio.toLocaleString('es-AR')}</span>
            </div>
        </div>
    </article>
    `;
}

// ==========================================
// LOGICA DE CARRITO Y PEDIDOS (PORT DE EL REY)
// ==========================================

function addToCart(item) {
    const existing = cart.find(i => i.id === item.id);
    if (existing) {
        existing.cantidad++;
    } else {
        cart.push({ ...item, cantidad: 1 });
    }
    saveCart();
    updateCartIcon();
    
    // Feedback Visual (Toast)
    showToast(`Agregado: ${item.producto}`);
    closeProductModal();
}

function removeFromCart(id) {
    const index = cart.findIndex(i => i.id === id);
    if (index > -1) {
        if (cart[index].cantidad > 1) {
            cart[index].cantidad--;
        } else {
            cart.splice(index, 1);
        }
        saveCart();
        updateCartIcon();
        renderCartItems();
    }
}

function updateCartIcon() {
    const count = cart.reduce((acc, item) => acc + item.cantidad, 0);
    document.getElementById('cart-count').innerText = count;
    const fab = document.getElementById('cart-fab');
    
    if (count > 0) {
        fab.classList.remove('hidden');
        fab.classList.add('animate-[popIn_0.3s_ease-out]');
        setTimeout(() => fab.classList.remove('animate-[popIn_0.3s_ease-out]'), 300);
    } else {
        fab.classList.add('hidden');
    }
}

function renderCartItems() {
    const container = document.getElementById('cart-items-container');
    const totalEl = document.getElementById('cart-total');
    let total = 0;

    if (cart.length === 0) {
        container.innerHTML = `
            <div class="text-center py-20 flex flex-col items-center opacity-40">
                <i class="ph-duotone ph-shopping-bag text-5xl mb-3 text-rauda-leather"></i>
                <p class="font-serif italic text-rauda-dark">Tu selección está vacía.</p>
                <button onclick="closeCartModal()" class="mt-4 text-xs font-bold uppercase tracking-widest text-rauda-terracotta hover:underline">Ir al catálogo</button>
            </div>`;
        totalEl.innerText = "$0";
        return;
    }

    container.innerHTML = cart.map(item => {
        const subtotal = item.precio * item.cantidad;
        total += subtotal;
        return `
        <div class="flex gap-4 py-4 border-b border-rauda-leather/5">
            <div class="w-16 h-16 bg-gray-100 shrink-0 rounded-md overflow-hidden border border-rauda-leather/10">
                <img src="${item.imagen}" class="w-full h-full object-cover">
            </div>
            <div class="flex-1">
                <h4 class="font-serif text-rauda-dark leading-tight mb-1">${item.producto}</h4>
                <div class="flex justify-between items-center">
                    <p class="text-xs font-sans text-rauda-leather/60 font-bold">$${item.precio.toLocaleString('es-AR')} x ${item.cantidad}</p>
                    <p class="text-sm font-serif text-rauda-dark font-bold">$${subtotal.toLocaleString('es-AR')}</p>
                </div>
            </div>
            <button onclick="removeFromCart(${item.id})" class="text-red-400 hover:text-red-600 p-2 rounded-full hover:bg-red-50 transition-colors self-center">
                <i class="ph-bold ph-trash"></i>
            </button>
        </div>
        `;
    }).join('');

    totalEl.innerText = "$" + total.toLocaleString('es-AR');
}

function selectPayment(method) {
    selectedPayment = method === 'efectivo' ? 'Efectivo' : 'Transferencia';
    const btnCash = document.getElementById('btn-pago-efectivo');
    const btnTransfer = document.getElementById('btn-pago-transferencia');

    // Estilos Activos (Terracotta) vs Inactivos (White)
    const activeClasses = ['bg-rauda-terracotta', 'text-white', 'border-rauda-terracotta'];
    const inactiveClasses = ['bg-white', 'text-rauda-leather', 'border-rauda-leather/20'];

    if (method === 'efectivo') {
        btnCash.classList.add(...activeClasses);
        btnCash.classList.remove(...inactiveClasses);
        btnTransfer.classList.add(...inactiveClasses);
        btnTransfer.classList.remove(...activeClasses);
    } else {
        btnTransfer.classList.add(...activeClasses);
        btnTransfer.classList.remove(...inactiveClasses);
        btnCash.classList.add(...inactiveClasses);
        btnCash.classList.remove(...activeClasses);
    }
}

function sendOrderToWhatsapp() {
    if (cart.length === 0) return;
    
    let message = `Hola *${CONFIG.businessName}*, deseo realizar el siguiente pedido:%0A%0A`;
    let total = 0;
    
    cart.forEach(item => {
        const subtotal = item.precio * item.cantidad;
        total += subtotal;
        message += `▪️ ${item.cantidad}x *${item.producto}* ($${subtotal.toLocaleString('es-AR')})%0A`;
    });
    
    message += `%0A────────────────%0A`;
    message += `*TOTAL ESTIMADO: $${total.toLocaleString('es-AR')}*%0A`;
    message += `%0A💳 *Forma de Pago:* ${selectedPayment}`;
    message += `%0A👤 *Nombre:* (Completar)`;
    message += `%0A📍 *Envío/Retiro:* (Completar)`;

    window.open(`https://wa.me/${CONFIG.whatsappNumber}?text=${message}`, '_blank');
}

// ==========================================
// UTILIDADES (TOAST, MODALES, PERSISTENCIA)
// ==========================================

function showToast(msg) {
    const div = document.createElement('div');
    // Estilo Toast elegante (Cuero oscuro)
    div.className = 'fixed top-6 left-1/2 -translate-x-1/2 bg-rauda-leather text-white px-6 py-3 rounded-full shadow-2xl z-[200] text-xs font-bold uppercase tracking-widest flex items-center gap-3 animate-[fadeInUp_0.3s_ease-out]';
    div.innerHTML = `<i class="ph-fill ph-check-circle text-rauda-terracotta text-lg"></i> ${msg}`;
    document.body.appendChild(div);
    setTimeout(() => {
        div.style.opacity = '0';
        div.style.transform = 'translate(-50%, -20px)';
        setTimeout(() => div.remove(), 300);
    }, 2500);
}

// Modales (Con la animación premium que hicimos antes)
function openProductModal(item) {
    document.getElementById('modal-img').src = item.imagen;
    document.getElementById('modal-cat').innerText = item.categoria;
    document.getElementById('modal-title').innerText = item.producto;
    document.getElementById('modal-desc').innerText = item.descripcion;
    document.getElementById('modal-price').innerText = "$" + item.precio.toLocaleString('es-AR');
    
    const btn = document.getElementById('modal-add-btn');
    const newBtn = btn.cloneNode(true);
    btn.parentNode.replaceChild(newBtn, btn);
    newBtn.onclick = () => addToCart(item);

    const modal = document.getElementById('product-modal');
    const panel = document.getElementById('modal-panel');
    const backdrop = document.getElementById('modal-backdrop');

    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    panel.classList.add('transition-all', 'duration-500', 'ease-out-expo');

    requestAnimationFrame(() => {
        backdrop.classList.remove('opacity-0');
        panel.classList.remove('translate-y-full', 'md:opacity-0', 'md:translate-y-8', 'md:scale-95');
        panel.classList.add('translate-y-0', 'md:opacity-100', 'md:translate-y-0', 'md:scale-100');
    });
}

function closeProductModal() {
    const modal = document.getElementById('product-modal');
    const panel = document.getElementById('modal-panel');
    const backdrop = document.getElementById('modal-backdrop');

    backdrop.classList.add('opacity-0');
    panel.classList.remove('translate-y-0', 'md:opacity-100', 'md:translate-y-0', 'md:scale-100');
    panel.classList.add('translate-y-full', 'md:opacity-0', 'md:translate-y-8', 'md:scale-95');
    
    setTimeout(() => { modal.classList.add('hidden'); document.body.style.overflow = ''; }, 450);
}

function openCartModal() {
    renderCartItems();
    const modal = document.getElementById('cart-modal');
    const panel = document.getElementById('cart-panel');
    const backdrop = document.getElementById('cart-backdrop');
    
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    panel.classList.add('transition-all', 'duration-500', 'ease-out-expo');

    requestAnimationFrame(() => {
        backdrop.classList.remove('opacity-0');
        panel.classList.remove('translate-y-full', 'md:translate-x-full');
        panel.classList.add('translate-y-0', 'md:translate-x-0');
    });
}

function closeCartModal() {
    const modal = document.getElementById('cart-modal');
    const panel = document.getElementById('cart-panel');
    const backdrop = document.getElementById('cart-backdrop');

    backdrop.classList.add('opacity-0');
    panel.classList.remove('translate-y-0', 'md:translate-x-0');
    panel.classList.add('translate-y-full', 'md:translate-x-full');

    setTimeout(() => {
        modal.classList.add('hidden');
        document.body.style.overflow = '';
    }, 450);
}

// Persistencia local
function saveCart() { localStorage.setItem('rauda_cart', JSON.stringify(cart)); }
function loadCart() {
    const stored = localStorage.getItem('rauda_cart');
    if (stored) { cart = JSON.parse(stored); updateCartIcon(); }
}