// The Tailwind CLI reads this object when generating the local store.css file.
// content includes both the page and the product cards created in main.js.
// extend keeps standard utilities and adds colors such as bg-surface and text-muted.
// These colors and the system font follow the TokenUsageTracker widget's palette.
// This file configures appearance only; workshop behavior remains in main.js.
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
