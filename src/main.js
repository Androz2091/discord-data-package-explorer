import App from './App.svelte';
import './main.css';
import * as zip from '@zip.js/zip.js';

zip.configure({
    workerScripts: {
        deflate: ["/z-worker-pako.min.js", "/pako.min.js"],
        inflate: ["/z-worker-pako.min.js", "/pako.min.js"]
    }
});

const app = new App({
    target: document.body
});

export default app;