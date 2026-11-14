/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        space: {
          950: '#060a17', // Deep cosmic blue-black
          900: '#080e1e', // Base canvas space navy
          850: '#0d172e', // Card background
          800: '#132140', // Elevated panels
          700: '#1b2f5b', // Borders & rings
          600: '#264380',
        },
        earth: {
          ocean: '#0284c7',   // Deep Pacific blue
          cyan: '#00E5FF',    // Luminous atmospheric rim
          teal: '#14B8A6',    // Coastal waters
          emerald: '#10B981', // Biosphere green
          forest: '#059669',  // Canopy LiDAR
          amber: '#FFB703',   // Solar lightning
          orange: '#F97316',  // Thermal currents
          violet: '#8B5CF6',  // Night lights
        },
        nasa: {
          red: '#FC3D21',
          blue: '#0B3D91',
          cyan: '#00E5FF',
          amber: '#FFB703',
          emerald: '#10B981',
        }
      },
      fontFamily: {
        display: ['Orbitron', 'Space Grotesk', 'sans-serif'],
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'Fira Code', 'monospace'],
      },
      letterSpacing: {
        hud: '0.22em',
      },
      boxShadow: {
        'glow-cyan': '0 0 25px -4px rgba(0, 229, 255, 0.4)',
        'glow-teal': '0 0 25px -4px rgba(20, 184, 166, 0.4)',
        'glow-amber': '0 0 25px -4px rgba(255, 183, 3, 0.4)',
        'glow-emerald': '0 0 25px -4px rgba(16, 185, 129, 0.4)',
        'glow-blue': '0 0 30px -4px rgba(11, 61, 145, 0.6)',
      }
    },
  },
  plugins: [],
}
