// Tailwind scans both static markup and the product-card template in main.js.
module.exports = {
    content: ['./index.html', './main.js'],
    theme: {
        extend: {
            colors: {
                canvas: '#10161D',
                surface: '#171E26',
                inset: '#232D38',
                line: '#36414C',
                ink: '#EDF2F6',
                muted: '#A9B4C0',
                quiet: '#8F9FAF',
                brand: {
                    DEFAULT: '#BEF078',
                    hover: '#D0F99E'
                },
                onbrand: '#171E26'
            },
            fontFamily: {
                sans: ['Segoe UI', 'system-ui', 'sans-serif']
            }
        }
    }
};
