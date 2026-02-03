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
    if (btnElement) {
        document.querySelectorAll('.nav-tab').forEach(btn => btn.classList.remove('active'));
        btnElement.classList.add('active');
        // Scroll automático del menú para centrar el botón activo en móvil
        btnElement.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }

    const container = document.getElementById('main-content');
    
    // Filtrado
    let items;
    if (category === 'Destacados') {
        items = CATALOG.filter(i => i.destacado);
    } else {
        items = CATALOG.filter(i => i.categoria === category);
    }

    // Ocultar suavemente
    container.style.opacity = '0';
    container.style.transform = 'translateY(10px)';
    container.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    
    setTimeout(() => {
        // Título de categoría estilizado
        const titleHtml = `
            <div class="flex items-center gap-3 mb-8 md:mb-12 fade-in-up">
                <span class="h-px bg-rauda-leather/10 flex-1"></span>
                <h2 class="text-2xl md:text-4xl font-display font-bold text-rauda-leather text-center uppercase tracking-wider">${category}</h2>
                <span class="h-px bg-rauda-leather/10 flex-1"></span>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 lg:gap-12 pb-10">
                ${items.map((item, index) => createCard(item, index)).join('')}
            </div>
        `;
        
        container.innerHTML = titleHtml;
        container.style.opacity = '1';
        container.style.transform = 'translateY(0)';
    }, 300);
}

function createCard(item, index) {
    // EN MOBILE: Quitamos el efecto hover complicado.
    // El botón "Ver Detalle" ahora es un icono sutil siempre visible o simplemente toda la card es clickeable.
    return `
    <article class="product-card group cursor-pointer" onclick='openProductModal(${JSON.stringify(item)})' style="animation: fadeInUp 0.6s ease-out ${index * 0.1}s backwards">
        <div class="relative overflow-hidden aspect-card bg-gray-200 mb-4 rounded-lg shadow-sm">
            <img src="${item.imagen}" class="product-image w-full h-full object-cover transition-transform duration-700 ease-in-out will-change-transform" alt="${item.producto}" loading="lazy">
            
            <div class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            
            <div class="absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm text-rauda-leather w-10 h-10 rounded-full flex items-center justify-center shadow-lg md:translate-y-12 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100 transition-all duration-300">
                <i class="ph-bold ph-plus text-lg"></i>
            </div>
        </div>
        
        <div class="px-1">
            <div class="flex justify-between items-start gap-2">
                <h3 class="font-serif text-lg text-rauda-dark leading-tight group-hover:text-rauda-terracotta transition-colors">${item.producto}</h3>
                <span class="font-sans font-bold text-rauda-leather whitespace-nowrap bg-rauda-sand/30 px-2 py-1 rounded text-xs">$${item.precio.toLocaleString('es-AR')}</span>
            </div>
        </div>
    </article>
    `;
}

// AJUSTE EN MODAL PARA MOBILE
function openProductModal(item) {
    document.getElementById('modal-img').src = item.imagen;
    document.getElementById('modal-cat').innerText = item.categoria;
    document.getElementById('modal-title').innerText = item.producto;
    document.getElementById('modal-desc').innerText = item.descripcion;
    document.getElementById('modal-price').innerText = "$" + item.precio.toLocaleString('es-AR');
    
    // Reset botón
    const btn = document.getElementById('modal-add-btn');
    btn.innerHTML = `<span>Agregar</span><i class="ph-bold ph-plus"></i>`;
    btn.classList.remove('bg-rauda-terracotta', 'text-white');
    btn.classList.add('bg-rauda-leather', 'text-white');
    
    // Reasignar evento onclick
    const newBtn = btn.cloneNode(true);
    btn.parentNode.replaceChild(newBtn, btn);
    newBtn.onclick = () => addToCart(item);

    const modal = document.getElementById('product-modal');
    const panel = document.getElementById('modal-panel');
    const backdrop = document.getElementById('modal-backdrop');

    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden'; // Evitar scroll de fondo
    
    // Animaciones diferentes para Mobile (Slide Up) vs Desktop (Fade/Scale)
    requestAnimationFrame(() => {
        backdrop.classList.remove('opacity-0');
        
        // Clases para mostrar
        panel.classList.remove('translate-y-full', 'md:opacity-0', 'md:translate-y-8');
        panel.classList.add('translate-y-0', 'md:opacity-100', 'md:translate-y-0');
    });
}

function closeProductModal() {
    const modal = document.getElementById('product-modal');
    const panel = document.getElementById('modal-panel');
    const backdrop = document.getElementById('modal-backdrop');

    backdrop.classList.add('opacity-0');
    
    // Clases para ocultar
    panel.classList.remove('translate-y-0', 'md:opacity-100', 'md:translate-y-0');
    panel.classList.add('translate-y-full', 'md:opacity-0', 'md:translate-y-8');
    
    setTimeout(() => {
        modal.classList.add('hidden');
        document.body.style.overflow = '';
    }, 300);
}

// AJUSTE CARRITO MOBILE
function openCartModal() {
    renderCartItems();
    const modal = document.getElementById('cart-modal');
    const panel = document.getElementById('cart-panel');
    const backdrop = document.getElementById('cart-backdrop');
    
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';

    requestAnimationFrame(() => {
        backdrop.classList.remove('opacity-0');
        // Mobile: Sube desde abajo. Desktop: Entra por derecha
        panel.classList.remove('translate-y-full', 'md:translate-x-full', 'md:translate-y-0');
        panel.classList.add('translate-y-0', 'md:translate-x-0');
    });
}

function closeCartModal() {
    const modal = document.getElementById('cart-modal');
    const panel = document.getElementById('cart-panel');
    const backdrop = document.getElementById('cart-backdrop');

    backdrop.classList.add('opacity-0');
    
    // Ocultar según dispositivo
    panel.classList.remove('translate-y-0', 'md:translate-x-0');
    panel.classList.add('translate-y-full', 'md:translate-x-full'); // Mobile abajo, PC derecha

    setTimeout(() => {
        modal.classList.add('hidden');
        document.body.style.overflow = '';
    }, 300);
}

// Persistencia local
function saveCart() { localStorage.setItem('rauda_cart', JSON.stringify(cart)); }
function loadCart() {
    const stored = localStorage.getItem('rauda_cart');
    if (stored) { cart = JSON.parse(stored); updateCartIcon(); }
}