/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Updated background surface to a slightly deeper neutral gray
        surface: '#f3f4f6',
        card: '#ffffff',
        border: '#e5e7eb',
        text: '#111827',
        muted: '#6b7280',
      },
    },
  },
  plugins: [],
}


