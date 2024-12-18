/** @type {import('tailwindcss').Config} */

const colorWithOpacity = (variable) => {
  return ({ opacityValue }) =>
    opacityValue
      ? `rgba(var(--${variable}), ${opacityValue})`
      : `rgb(var(--${variable}))`;
};

module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: colorWithOpacity("primary"),
        dark: colorWithOpacity("dark"),
        light: colorWithOpacity("light"),
        lightContrast: colorWithOpacity("light-contrast"),
        primaryContrast: colorWithOpacity("primary-contrast"),
        success: colorWithOpacity("success"),
        grayLight: colorWithOpacity('gray-light'),
        gray: colorWithOpacity ('gray'),
        danger: colorWithOpacity ('danger'),
      },
    },
  },
  plugins: [],
};
