import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      screens: {
        'xs': '480px',  // Extra small devices (large phones)
        // sm: '640px' - default
        // md: '768px' - default
        // lg: '1024px' - default
        // xl: '1280px' - default
        // 2xl: '1536px' - default
      },
      borderWidth: {
        '3': '3px',
        '4': '4px',
        '5': '5px',
        '6': '6px',
      },
    },
  },
  plugins: [],
};

export default config;
