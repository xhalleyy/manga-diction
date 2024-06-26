import type { Config } from "tailwindcss";
/** @type {import('tailwindcss').Config} */

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    'node_modules/flowbite-react/lib/esm/**/*.js',
  ],
  theme: {
    screens: {
      'xs': '320px',
      'sm': '425px', // Adjust to your desired breakpoint
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
    },
    fontFamily: {
      mainFont: ['mainFont'],
      poppinsMed: ['poppinsMed'],
      poppinsBold: ['poppinsBold'],
      poppinsSemi: ['poppinsSemi'],
      poppinsExtra: ['poppinsExtra']
    },
    extend: {
      backgroundImage: theme => ({
        'bgLogin': "url('/loginpic.png')",
      }),
      colors: {
        'darkbrown':'rgba(57, 28, 11, 1)', // dark brown
        'darkgray': 'rgba(51, 51, 51, 1)', // dark gray/ black
        'signUp': 'rgba(102, 102, 102, 1)', // light gray
        'lightbrown': 'rgba(136, 119, 109, 1)', // light brown
        'offwhite': 'rgba(236, 234, 217, 1)', // offwhite
        'darkblue': 'rgba(39, 48, 67, 1)', // dark blue
        'ivory' : 'rgba(207, 198, 183, 1)', // ivory
        'paleblue' : 'rgb(173, 196, 206)', //desaturated blue
        'darkerblue': 'rgba(12, 20, 37, 1)', //darker blue
        'brown' : 'rgba(180, 163, 138, 1)',
        'mutedblue': 'rgba(150, 182, 197, 1)',
        'mutedred' : 'rgb(255, 105, 97)',
        'mutedgreen' : 'rgb(88,116,93)'
      }
    }
  },
  plugins: [
    require('flowbite/plugin'),
  ],
};
export default config;
