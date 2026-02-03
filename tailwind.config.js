tailwind.config = {
    theme: {
        extend: {
            colors: {
                rauda: {
                    base: '#F7F5F0',
                    terracotta: '#B8422B', // Color extraído de tu logo
                    leather: '#5F4633',
                    dark: '#2C241F',
                    sand: '#E6E2D6',
                }
            },
            fontFamily: {
                sans: ['"Lato"', 'sans-serif'],
                serif: ['"Playfair Display"', 'serif'],
                display: ['"Cinzel"', 'serif'],
                Lora: ['"Lora"', 'serif'],
            },
            backgroundImage: {
                'texture-paper': "url('https://www.transparenttextures.com/patterns/cream-paper.png')",
            },
            boxShadow: {
                'elegant': '0 10px 40px -10px rgba(95, 70, 51, 0.15)',
                'upwards': '0 -4px 20px rgba(0,0,0,0.1)', // Sombra para el modal inferior
            },
            // Animaciones nuevas para el modal móvil
            animation: {
                'slide-up': 'slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards',
                'fade-in': 'fadeIn 0.5s ease-out forwards',
            },
            keyframes: {
                slideUp: {
                    '0%': { transform: 'translateY(100%)' },
                    '100%': { transform: 'translateY(0)' },
                },
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                }
            }
        }
    }
}