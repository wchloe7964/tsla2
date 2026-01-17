import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // We use hsl() because your CSS variables are raw HSL values
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        tesla: {
          red: "#E01933",
          blue: "#3d69e1",
          gray: {
            900: "#171a20",
            100: "#f4f4f4",
          }
        }
      },
      fontFamily: {
        // This allows you to use 'font-tesla' in your components
        tesla: ['Tesla', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
export default config;