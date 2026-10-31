import { mount } from 'svelte';
import App from './App.svelte';
import './main.css';

const app = mount(App, {
    target: document.body
});

export default app;
