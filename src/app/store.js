
import { writable } from 'svelte/store';

const loadedStorage = localStorage.getItem('loaded') === 'true' || false;
const dataStorage = localStorage.getItem('data') ? JSON.parse(localStorage.getItem('data')) : null;

export const loaded = writable(loadedStorage);
export const loadedPercent = writable(0);
export const loadedStartAt = writable(0);
export const data = writable(dataStorage);

loaded.subscribe((value) => localStorage.setItem('loaded', value));
data.subscribe((value) => localStorage.setItem('data', JSON.stringify(value)));
