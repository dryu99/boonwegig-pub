import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      textColor: {
        primary: "var(--color-text-primary)",
        secondary: "var(--color-text-secondary)",
        tertiary: "var(--color-text-tertiary)",
        icon: "var(--color-text-icon)",
        code: "var(--color-text-code)",
        btn: "var(--color-text-btn)",
        link: "var(--color-text-link)",
      },
      backgroundColor: {
        primary: "var(--color-bg-primary)",
        secondary: "var(--color-bg-secondary)",
        tertiary: "var(--color-bg-tertiary)",
        hover: "var(--color-bg-hover)",
        code: "var(--color-bg-code)",
        tooltip: "var(--color-bg-tooltip)",
        op: "var(--color-bg-op)",
        btn: "var(--color-bg-btn)",
      },
      borderColor: {
        primary: "var(--color-border-primary)",
        secondary: "var(--color-border-secondary)",
      },
    },
  },
  plugins: [],
};
export default config;
