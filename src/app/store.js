
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
        timestamp: 1613810737577
    };
    dataValue = {
        user: demoUserObject,
        channels: [
            {
                messages: [demoMessageObject]
            }
        ],
        applications: [],
        topDMs: [
            {
                userData: demoUserObject,
                messages: new Array(2000).fill(demoMessageObject)
            }
        ],
        messageCount: 0,
        averageMessageCountPerDay: 0,
        hoursValues: new Array(24).fill(0).map(() => Math.floor(Math.random() * 300) + 1)
    };
}

export const loaded = writable(loadedValue);
export const data = writable(dataValue);
