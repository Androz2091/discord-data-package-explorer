import Papa from 'papaparse';
import axios from 'axios';

import { loadTask } from './store';
import { getCreatedTimestamp, getFavoriteWords } from './helpers';
import { DecodeUTF8 } from 'fflate';

/**
 * Fetch a user on Discord.
 * This is necessary because sometimes we only have the user ID in the files.
 * @param userID The ID of the user to fetch
 */
const fetchUser = async (userID) => {
    const res = await axios(`https://diswho.androz2091.fr/user/${userID}`).catch(() => {});
    if (!res.data) return {
        username: 'Unknown',
        discriminator: '0000',
        avatar: null
    };
    return res.data;
};

/**
 * Parse a messages CSV into an object
 * @param input
 */
const parseCSV = (input) => {
    return Papa.parse(input, {
        header: true,
        newline: ',\r'
    })
        .data
        .filter((m) => m.Contents)
        .map((m) => ({
            id: m.ID,
            timestamp: m.Timestamp,
            length: m.Contents.length,
            words: m.Contents.split(' ')
            // content: m.Contents,
            // attachments: m.Attachments
        }));
};

/**
 * Extract the data from the package file.
 * @param files The files in the package
 * @returns The extracted data
 */
export const extractData = async (files) => {

    const extractedData = {
        user: null,
        channels: [],

        topDMs: [],
        messageCount: 0,
        averageMessageCountPerDay: 0,
        totalSpent: 0,
        hoursValues: [],
        favoriteWords: null,
        payments: {
            total: 0,
            list: ''
        }
    };

    const getFile = (name) => files.find((file) => file.name === name);
    // Read a file from its name
    const readFile = (name) => {
        return new Promise((resolve) => {
            const file = getFile(name);
            if (!file) return resolve(null);
            const fileContent = [];
            const decoder = new DecodeUTF8();
            file.ondata = (err, data, final) => {
                decoder.push(data, final);
            };
            decoder.ondata = (str, final) => {
                fileContent.push(str);
                if (final) resolve(fileContent.join(''));
            };
            file.start();
        });
    };

    // Parse and load current user informations
    console.log('[debug] Loading user info...');
    loadTask.set('Loading user information...');
    extractedData.user = JSON.parse(await readFile('account/user.json'));
    const hasPayments = extractedData.user.payments.length > 0;
    if (hasPayments) {
        extractedData.payments.total += extractedData.user.payments.filter((p) => p.status == 1).map((p) => p.amount / 100).reduce((p, c) => p + c);
        extractedData.payments.list += extractedData.user.payments.filter((p) => p.status == 1).sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()).map((p) => `${p.description} ($${p.amount / 100})`).join('<br>');
    }
    console.log('[debug] User info loaded.');

    // Parse and load channels
    console.log('[debug] Loading channels...');
    loadTask.set('Loading user messages...');

    const messagesIndex = JSON.parse(await readFile('messages/index.json'));
    const messagesPathRegex = /messages\/([0-9]{16,32})\/$/;
    const channelsIDs = files.filter((file) => messagesPathRegex.test(file.name)).map((file) => file.name.match(messagesPathRegex)[1]);

    await Promise.all(channelsIDs.map((channelID) => {
        return new Promise((resolve) => {

            const channelDataPath = `messages/${channelID}/channel.json`;
            const channelMessagesPath = `messages/${channelID}/messages.csv`;

            Promise.all([
                readFile(channelDataPath),
                readFile(channelMessagesPath)
            ]).then(([ rawData, rawMessages ]) => {

                if (!rawData || !rawMessages) {
                    console.log(`[debug] Files of channel ${channelID} can't be read. Data is ${!!rawData} and messages are ${!!rawMessages}.`);
                    return resolve();
                }

                const data = JSON.parse(rawData);
                const messages = parseCSV(rawMessages);
                const name = messagesIndex[data.id];
                const isDM = data.recipients && data.recipients.length === 2;
                const dmUserID = isDM ? data.recipients.find((userID) => userID !== extractedData.user.id) : undefined;
                extractedData.channels.push({
                    data,
                    messages,
                    name,
                    isDM,
                    dmUserID
                });

                resolve();
            });

        });
    }));

    console.log(`[debug] ${extractedData.channels.length} channels loaded.`);

    const words = extractedData.channels.map((channel) => channel.messages).flat().map((message) => message.words).flat().filter((w) => w.length > 5);
    extractedData.favoriteWords = getFavoriteWords(words);

    console.log('[debug] Fetching top DMs...');
    loadTask.set('Loading user activity...');
    
    extractedData.topDMs = extractedData.channels
        .filter((channel) => channel.isDM)
        .sort((a, b) => b.messages.length - a.messages.length);
    if (extractedData.topDMs.length > 10) extractedData.topDMs.length = 10;
    await Promise.all(extractedData.topDMs.map((channel) => {
        return new Promise((resolve) => {
            fetchUser(channel.dmUserID).then((userData) => {
                const channelIndex = extractedData.topDMs.findIndex((c) => c.data.id === channel.data.id);
                extractedData.topDMs[channelIndex].userData = userData;
                resolve();
            });
        });
    }));

    console.log(`[debug] ${extractedData.topDMs.length} top DMs loaded.`);

    loadTask.set('Calculating statistics...');

    extractedData.messageCount = extractedData.channels.map((c) => c.messages.length).reduce((p, c) => p + c);
    extractedData.averageMessageCountPerDay = parseInt(extractedData.messageCount / ((Date.now() - getCreatedTimestamp(extractedData.user.id)) / 24 / 60 / 60 / 1000));

    for (let i = 0; i < 24; i++) {
        extractedData.hoursValues.push(extractedData.channels.map((c) => c.messages).flat().filter((m) => new Date(m.timestamp).getHours() === i).length);
    }

    return extractedData;
};
