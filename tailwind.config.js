/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}","./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    // define theme and color here.
    extend: {
      // colors: {
      //   custom: {
      //     DEFAULT: "var(--custom-color)",
      //     purple: "var(--custom-color-purple)",
      //     white: "var(--custom-color-white)",
      //     black: "#483838",
      //   },          
      // },
      // colors: {
      //   primary: "#161622",
      //   secondary: {
      //     DEFAULT: "#FF9C01",
      //     100: "#FF9001",
      //     200: "#FF8E01",
      //   },
      //   black: {
      //     DEFAULT: "#000",
      //     100: "#1E1E2D",
      //     200: "#232533",
      //   },
      //   gray: {
      //     100: "#CDCDE0",
      //   },
      //   custom: {
      //     DEFAULT: "var(--custom-color)",
      //     purple: "var(--custom-color-purple)",
      //     white: "var(--custom-color-white)",
      //     black: "#483838",
      //   },        
      // },      
    },
    fontFamily: {
      pthin: ["Poppins-Thin", "sans-serif"],
      pextralight: ["Poppins-ExtraLight", "sans-serif"],
      plight: ["Poppins-Light", "sans-serif"],
      pregular: ["Poppins-Regular", "sans-serif"],
      pmedium: ["Poppins-Medium", "sans-serif"],
      psemibold: ["Poppins-SemiBold", "sans-serif"],
      pbold: ["Poppins-Bold", "sans-serif"],
      pextrabold: ["Poppins-ExtraBold", "sans-serif"],
      pblack: ["Poppins-Black", "sans-serif"],
    },    
  },
  plugins: [
    //({ addBase }) => addBase({ ":root": { "--custom-color": "#483838" } }),
  ],
} 

