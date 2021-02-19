
import { writable } from 'svelte/store';

export const loaded = writable(false);
export const loadedPercent = writable(0);
export const data = writable(null);
