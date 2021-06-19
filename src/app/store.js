
import { writable } from 'svelte/store';

const storedData = localStorage.getItem('data') || null;

let dataValue = storedData && JSON.parse(storedData);

export const loadTask = writable(null);
export const loadEstimatedTime = writable(null);
export const data = writable(dataValue);

data.subscribe((value) => {
    if (!value) localStorage.removeItem('data');
    else if (!value.isDemo) localStorage.setItem('data', JSON.stringify(value));
});
