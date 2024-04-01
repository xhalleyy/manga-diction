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
    fontFamily: {
      mainFont: ['mainFont']
    },
    extend: {
      backgroundImage: theme => ({
        'bgLogin': "url('/loginpic.png')",
      }),
    },
    colors: {
      'signHeader':'rgba(57, 28, 11, 1)',
      'signHeader2': 'rgba(51, 51, 51, 1)',
      'signUp': 'rgba(102, 102, 102, 1)',
      'signUpBtn': 'rgba(136, 119, 109, 1)',
      'mainBg': 'rgba(236, 234, 217, 1)',
      'tagsBg': 'rgba(39, 48, 67, 1)'
    }
  },
  plugins: [
    require('flowbite/plugin'),
  ],
};
export default config;
