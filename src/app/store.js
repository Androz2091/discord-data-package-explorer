
import { writable } from 'svelte/store';

let loadedValue = false;
let dataValue = null;
const isDemo = window.location.href.includes('demo');
const removeAnalytics = window.location.href.includes('noanalytics');
if (isDemo) {
    const randomNumber = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);
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
        length: randomNumber(200, 600)
    };
    const analytics = removeAnalytics ? {} : {
        openCount: randomNumber(200, 300),
        averageOpenCountPerDay: randomNumber(3, 5),
        notificationCount: randomNumber(200, 400),
        joinVoiceChannelCount: randomNumber(40, 100), 
        joinCallCount: randomNumber(20, 30),
        addReactionCount: randomNumber(100, 200),
        messageEditedCount: randomNumber(50, 70),
        sentMessageCount: randomNumber(200, 600),
        averageMessageCountPerDay: randomNumber(20, 30),
        slashCommandUsedCount: randomNumber(10, 20)
    };
    dataValue = {
        user: demoUserObject,
        channels: new Array(randomNumber(200, 600)).fill({}).map(() => ({
            isDM: true,
            name: 'just-chatting',
            data: {
                guild: {
                    name: 'Cool Discord'
                }
            },
            messages: new Array(randomNumber(200, 600)).fill(demoMessageObject)
        })),
        guilds: new Array(randomNumber(10, 100)),
        applications: [],
        topDMs: new Array(10).fill({}).map(() => ({
            userData: demoUserObject,
            messages: new Array(randomNumber(200, 10000)).fill(demoMessageObject)
        })).sort((a, b) => b.messages.length - a.messages.length),
        hoursValues: new Array(24).fill(0).map(() => Math.floor(Math.random() * 300) + 1),
        favoriteWords: [
            {
                word: 'Androz2091',
                count: randomNumber(600, 1000)
            },
            {
                word: 'DDPE',
                count: randomNumber(200, 600)
            }
        ],
        payments: {
            total: 500,
            list: 'Super Mega Nitro ($500)'
        },
        ...analytics
    };
}

export const loaded = writable(loadedValue);
export const loadTask = writable(null);
export const loadEstimatedTime = writable(null);
export const data = writable(dataValue);
