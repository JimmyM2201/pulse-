# Pulse Frontend

A modern, high-performance React application scaffolded with **Vite 8**, **React 19**, and **Tailwind CSS v4**.

## Tech Stack

- **Framework**: [React 19](https://react.dev)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com) with `@tailwindcss/vite`
- **Bundler**: [Vite 8](https://vite.dev)
- **Icons**: [Lucide React](https://lucide.dev)
- **Fonts**: [Plus Jakarta Sans](https://fonts.google.com/specimen/Plus+Jakarta+Sans) & [JetBrains Mono](https://fonts.google.com/specimen/JetBrains+Mono)

## Project Structure

```text
├── index.html          # HTML entry with Google Fonts & meta tags
├── package.json        # Dependencies & scripts
├── vite.config.js      # Vite configuration with @tailwindcss/vite & React plugin
└── src/
    ├── main.jsx        # Application mount point
    ├── App.jsx         # Interactive Pulse application showcase
    ├── index.css       # Tailwind v4 import & custom theme tokens
    └── assets/         # Static assets & SVGs
```

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Start the Development Server

```bash
npm run dev
```

Visit [http://localhost:5173](http://localhost:5173) in your browser.

### 3. Build for Production

```bash
npm run build
```

### 4. Preview Production Build

```bash
npm run preview
```

## Tailwind CSS v4 Configuration

Tailwind v4 is configured CSS-first via `@tailwindcss/vite` in [vite.config.js](file:///Users/jimmymahajan/Desktop/Pulse-frontend/vite.config.js) and imported in [src/index.css](file:///Users/jimmymahajan/Desktop/Pulse-frontend/src/index.css):

```css
@import "tailwindcss";

@theme {
  --font-sans: "Plus Jakarta Sans", system-ui, sans-serif;
  --font-mono: "JetBrains Mono", monospace;
}
```
