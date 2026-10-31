import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';

export default defineConfig({
    plugins: [svelte()],
    // The build goes to `public/`, which Cloudflare Pages serves, so `static/` holds the files it copies as is.
    publicDir: 'static',
    build: {
        outDir: 'public',
        emptyOutDir: true,
        sourcemap: true
    }
});
