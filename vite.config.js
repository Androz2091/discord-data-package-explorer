import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';

// Umami, an open source analytics software, counts the site's visits. The tag is left out when
// VITE_ANALYTICS_URL is empty, so a self-hosted copy calls no analytics.
const analytics = () => {
    let env;
    return {
        name: 'analytics',
        configResolved: (config) => {
            env = config.env;
        },
        transformIndexHtml: () => env.VITE_ANALYTICS_URL ? [{
            tag: 'script',
            attrs: { async: true, defer: true, 'data-website-id': env.VITE_ANALYTICS_WEBSITE_ID, src: `${env.VITE_ANALYTICS_URL}/script.js` },
            injectTo: 'head'
        }] : []
    };
};

export default defineConfig({
    plugins: [svelte(), analytics()],
    // The build goes to `public/`, which Cloudflare Pages serves, so `static/` holds the files it copies as is.
    publicDir: 'static',
    build: {
        outDir: 'public',
        emptyOutDir: true,
        sourcemap: true
    }
});
