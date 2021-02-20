
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
        totalSpent: 500,
        favoriteWord: 'Androz'
    };
}

export const loaded = writable(loadedValue);
export const data = writable(dataValue);
