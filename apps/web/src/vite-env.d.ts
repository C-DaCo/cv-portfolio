/// <reference types="vite/client" />

// SCSS Modules
declare module "*.module.scss" {
  const classes: Record<string, string>;
  export default classes;
}

// Assets
declare module "*.jpg" { const src: string; export default src; }
declare module "*.jpeg" { const src: string; export default src; }
declare module "*.png" { const src: string; export default src; }
declare module "*.mp4" { const src: string; export default src; }
declare module "*.svg" { const src: string; export default src; }
declare module "*.webp" {const src: string; export default src;}