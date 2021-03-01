
import { writable } from 'svelte/store';

let loadedValue = false;
let dataValue = null;
const isDemo = window.location.href.includes('demo');
if (isDemo) {
    loadedValue = true;
    const demoUserObject = {
        id: 422820341791064085,
        username: 'Wumpus',
        discriminator: '0000',
        avatar: null
    };
    const demoMessageObject = {
        id: 422820341791064085,
        timestamp: 1613810737577,
        length: 1000
    };
    dataValue = {
        user: demoUserObject,
        channels: [
            {
                messages: [demoMessageObject]
            }
        ],
        applications: [],
        topDMs: new Array(10).fill({
            userData: demoUserObject,
            messages: new Array(2000).fill(demoMessageObject)
        }),
        messageCount: 0,
        averageMessageCountPerDay: 0,
        hoursValues: new Array(24).fill(0).map(() => Math.floor(Math.random() * 300) + 1),
        favoriteWords: [
            {
                word: 'Androz2091',
                count: 10000
            },
            {
                word: 'DDPE',
                count: 200
            }
        ],
        payments: {
            total: 500,
            list: 'Super Mega Nitro ($500)'
        }
    };
}

export const loaded = writable(loadedValue);
export const loadTask = writable(null);
export const data = writable(dataValue);
