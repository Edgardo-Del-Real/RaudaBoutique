tailwind.config = {
    theme: {
        extend: {
            colors: {
                rauda: {
                    base: '#F7F5F0',      // Crema suave (Papel antiguo) - Fondo principal
                    terracotta: '#B8422B', // Tu color principal (Ladrillo/Terracota)
                    leather: '#5F4633',    // Tu color secundario (Cuero/Café)
                    dark: '#2C241F',      // Casi negro, pero cálido (Texto)
                    sand: '#E6E2D6',      // Beige para fondos secundarios
                }
            },
            fontFamily: {
                // Tipografías elegantes y serias
                sans: ['"Lato"', 'sans-serif'],
                serif: ['"Playfair Display"', 'serif'],
                display: ['"Cinzel"', 'serif'], // Para títulos muy elegantes
            },
            backgroundImage: {
                'texture-paper': "url('https://www.transparenttextures.com/patterns/cream-paper.png')",
            },
            boxShadow: {
                'elegant': '0 10px 40px -10px rgba(95, 70, 51, 0.15)',
            }
        }
    }
}