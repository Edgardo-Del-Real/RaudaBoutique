// script.js - RAUDA BOUTIQUE (FIXED & IMPROVED)

// --- CONFIGURACIÓN ---
const ID_SHEET = '1jKoiVaK619iS7hGGsqtxsrWgzePmF_VY33VbIgdc-ag'; 
const SHEET_TAB = 'rauda'; 

const CONFIG = {
    whatsappNumber: '5493447558764',
    businessName: 'Rauda Boutique',
    menuUrl: `https://opensheet.elk.sh/${ID_SHEET}/${SHEET_TAB}`,
};

// Mapeo de columnas (Asegúrate que en tu Excel se llamen así)
const KEYS = {
    id: 'id',
    categoria: 'categoria',
    producto: 'producto',
    precio: 'precio',
    descripcion: 'descripcion',
    imagen: 'imagen',
    destacado: 'destacado',
    disponible: 'disponible'
};

let CATALOG = []; 
let cart = [];
let selectedPayment = 'Efectivo';

// --- INICIALIZACIÓN ---
document.addEventListener('DOMContentLoaded', () => {
    initApp();
    loadCart();
});

async function initApp() {
    const container = document.getElementById('main-content');
    
    try {
        // Spinner de carga
        container.innerHTML = `
            <div class="flex flex-col items-center justify-center py-20 fade-in-up">
                <div class="w-8 h-8 border-4 border-rauda-terracotta border-t-transparent rounded-full animate-spin mb-4"></div>
                <p class="text-rauda-leather font-serif italic">Preparando la boutique...</p>
            </div>
        `;

        const response = await fetch(CONFIG.menuUrl);
        if (!response.ok) throw new Error('Error de conexión con Google Sheets');
        const data = await response.json();

        // Procesar datos (Aquí aplicamos la lógica de Pelican para imágenes y precio)
        CATALOG = data
            .map((item, index) => ({
                id: String(item[KEYS.id] || index), 
                categoria: (item[KEYS.categoria] || 'Varios').trim(),
                producto: (item[KEYS.producto] || '').trim(),
                precio: parsePrice(item[KEYS.precio]), // Corrección de precio aplicada
                descripcion: (item[KEYS.descripcion] || '').trim(),
                imagen: procesarURLImagen(item[KEYS.imagen]), // Lógica Pelican de imágenes
                destacado: isTrue(item[KEYS.destacado]),
                disponible: isTrue(item[KEYS.disponible] || 'TRUE')
            }))
            .filter(item => item.producto && item.disponible); 

        if (CATALOG.length === 0) {
            container.innerHTML = '<div class="text-center py-20 opacity-50 font-serif">No se encontraron productos disponibles.</div>';
            return;
        }

        renderCategories();
        
        // Cargar la PRIMERA categoría real del Excel (Ya no "Destacados" forzado)
        const categories = [...new Set(CATALOG.map(item => item.categoria))];
        if (categories.length > 0) {
            renderProducts(categories[0]); 
        }

    } catch (error) {
        console.error('Error cargando datos:', error);
        container.innerHTML = `
            <div class="text-center py-20 text-red-800 opacity-60">
                <p class="font-bold">Error al cargar.</p>
                <p class="text-xs mt-2">Verifica la conexión o el ID de la hoja.</p>
            </div>
        `;
    }
}

// --- RENDERIZADO ---

function renderCategories() {
    const nav = document.getElementById('nav-tabs');
    const categories = [...new Set(CATALOG.map(item => item.categoria))];
    
    let navHtml = '';

    categories.forEach((cat, index) => {
        // La primera categoría activa por defecto visualmente
        const isActive = index === 0 ? 'active text-rauda-terracotta border-b-rauda-terracotta' : 'text-rauda-dark/50';
        
        navHtml += `
            <li>
                <button onclick="renderProducts('${cat}', this)" class="nav-tab ${isActive} text-xs md:text-sm font-bold uppercase tracking-widest px-4 py-2 hover:text-rauda-terracotta transition-colors whitespace-nowrap">
                    ${cat}
                </button>
            </li>
        `;
    });
    
    nav.innerHTML = navHtml;
}

function renderProducts(category, btnElement) {
    // UI: Actualizar pestañas activas
    if (btnElement) {
        document.querySelectorAll('.nav-tab').forEach(btn => {
            btn.classList.remove('active', 'text-rauda-terracotta');
            btn.classList.add('text-rauda-dark/50');
        });
        btnElement.classList.add('active', 'text-rauda-terracotta');
        btnElement.classList.remove('text-rauda-dark/50');
        btnElement.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }

    const container = document.getElementById('main-content');
    
    // Filtrar items por la categoría seleccionada
    const items = CATALOG.filter(i => i.categoria === category);

    // Animación de salida
    container.style.opacity = '0';
    container.style.transform = 'translateY(10px)';
    
    setTimeout(() => {
        container.innerHTML = ''; 

        // Título de Categoría
        const titleDiv = document.createElement('div');
        titleDiv.className = 'flex items-center gap-3 mb-6 md:mb-10 fade-in-up';
        titleDiv.innerHTML = `
            <span class="h-px bg-rauda-leather/10 flex-1"></span>
            <h2 class="text-xl md:text-4xl font-display font-bold text-rauda-leather text-center uppercase tracking-wider">${category}</h2>
            <span class="h-px bg-rauda-leather/10 flex-1"></span>
        `;
        container.appendChild(titleDiv);

        if (items.length === 0) {
            container.innerHTML += `<div class="text-center py-10 opacity-40 font-serif italic w-full">No hay productos en esta categoría.</div>`;
        } else {
            // Grilla: 2 columnas en móvil, 3 en tablet, 4 en desktop
            const gridDiv = document.createElement('div');
            gridDiv.className = 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6 pb-10';
            
            items.forEach((item, index) => {
                gridDiv.innerHTML += createCardHtml(item, index);
            });
            
            container.appendChild(gridDiv);
        }
        
        // Animación de entrada
        container.style.opacity = '1';
        container.style.transform = 'translateY(0)';
    }, 300);
}

function createCardHtml(item, index) {
    const imgUrl = item.imagen || 'https://via.placeholder.com/400x500?text=Sin+Imagen';
    const priceFormatted = item.precio.toLocaleString('es-AR');
    // Escape seguro para JSON en HTML
    const itemJson = JSON.stringify(item).replace(/"/g, "&quot;");

    // DISEÑO EPICO: 4:5 ratio, imagen full cover, textos elegantes
    return `
    <article class="product-card group cursor-pointer relative flex flex-col h-full" onclick='openProductModal(${itemJson})' style="animation: fadeInUp 0.6s ease-out ${index * 0.05}s backwards">
        
        <div class="relative overflow-hidden aspect-[4/5] bg-gray-200 mb-3 rounded-sm shadow-sm w-full">
            <img src="${imgUrl}" class="product-image w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-105" alt="${item.producto}" loading="lazy">
            
            <div class="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-300"></div>
            
            <div class="absolute bottom-2 right-2 bg-white/95 backdrop-blur-sm text-rauda-leather w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center shadow-lg md:translate-y-12 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100 transition-all duration-300 z-10">
                <i class="ph-bold ph-plus text-base md:text-lg"></i>
            </div>
        </div>
        
        <div class="px-1 flex flex-col justify-between flex-1">
            <div class="flex flex-col gap-1">
                <h3 class="font-serif text-sm md:text-base text-rauda-dark leading-tight group-hover:text-rauda-terracotta transition-colors line-clamp-2">${item.producto}</h3>
                <span class="font-sans font-bold text-rauda-leather whitespace-nowrap text-xs md:text-sm tracking-wide mt-1">$${priceFormatted}</span>
            </div>
        </div>
    </article>
    `;
}

// --- HELPERS (PELICAN LOGIC INTEGRADA) ---

function isTrue(val) {
    if (!val) return false;
    const str = String(val).trim().toUpperCase();
    return ['TRUE', 'VERDADERO', 'SI', 'SÍ', '1'].includes(str);
}

// FIX PRECIOS: Remueve puntos de miles antes de parsear
function parsePrice(val) {
    if (!val) return 0;
    // Convierte "10.000" -> "10000"
    let clean = String(val).replace(/\./g, '').replace(/,/g, '.').replace(/[^0-9.]/g, '');
    return Number(clean);
}

// FIX IMÁGENES: Detecta links de Drive y los convierte
function procesarURLImagen(url) {
    if (!url) return null;
    if (url.includes('drive.google.com')) {
        const idMatch = url.match(/\/d\/(.*?)(?:\/|$)/);
        if (idMatch && idMatch[1]) { 
            return `https://lh3.googleusercontent.com/d/${idMatch[1]}`; 
        }
    }
    return url;
}

// ==========================================
// LOGICA DE CARRITO Y PEDIDOS (MANTENIDA DE RAUDA)
// ==========================================

function addToCart(item) {
    const existing = cart.find(i => String(i.id) === String(item.id));
    if (existing) {
        existing.cantidad++;
    } else {
        cart.push({ ...item, cantidad: 1, id: String(item.id) });
    }
    saveCart();
    updateCartIcon();
    showToast(`Agregado: ${item.producto}`);
    closeProductModal();
}

function removeFromCart(id) {
    const index = cart.findIndex(i => String(i.id) === String(id));
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
                <img src="${item.imagen || 'https://via.placeholder.com/100'}" class="w-full h-full object-cover">
            </div>
            <div class="flex-1">
                <h4 class="font-serif text-rauda-dark leading-tight mb-1">${item.producto}</h4>
                <div class="flex justify-between items-center">
                    <p class="text-xs font-sans text-rauda-leather/60 font-bold">$${item.precio.toLocaleString('es-AR')} x ${item.cantidad}</p>
                    <p class="text-sm font-serif text-rauda-dark font-bold">$${subtotal.toLocaleString('es-AR')}</p>
                </div>
            </div>
            <button onclick="removeFromCart('${item.id}')" class="text-red-400 hover:text-red-600 p-2 rounded-full hover:bg-red-50 transition-colors self-center">
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
// UTILIDADES (TOAST, MODALES)
// ==========================================

function showToast(msg) {
    const div = document.createElement('div');
    div.className = 'fixed top-6 left-1/2 -translate-x-1/2 bg-rauda-leather text-white px-6 py-3 rounded-full shadow-2xl z-[200] text-xs font-bold uppercase tracking-widest flex items-center gap-3 animate-[fadeInUp_0.3s_ease-out]';
    div.innerHTML = `<i class="ph-fill ph-check-circle text-rauda-terracotta text-lg"></i> ${msg}`;
    document.body.appendChild(div);
    setTimeout(() => {
        div.style.opacity = '0';
        div.style.transform = 'translate(-50%, -20px)';
        setTimeout(() => div.remove(), 300);
    }, 2500);
}

function openProductModal(item) {
    const imgUrl = item.imagen || 'https://via.placeholder.com/500';
    document.getElementById('modal-img').src = imgUrl;
    document.getElementById('modal-cat').innerText = item.categoria;
    document.getElementById('modal-title').innerText = item.producto;
    document.getElementById('modal-desc').innerText = item.descripcion || 'Sin descripción disponible.';
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

function saveCart() { localStorage.setItem('rauda_cart', JSON.stringify(cart)); }
function loadCart() {
    const stored = localStorage.getItem('rauda_cart');
    if (stored) { cart = JSON.parse(stored); updateCartIcon(); }
}