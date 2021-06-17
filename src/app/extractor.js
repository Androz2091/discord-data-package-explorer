import Papa from 'papaparse';
import axios from 'axios';

import eventsData from './events.json';
import { loadEstimatedTime, loadTask } from './store';
import { getCreatedTimestamp, getFavoriteWords } from './helpers';
import { DecodeUTF8 } from 'fflate';
import { snakeCase } from 'snake-case';

/**
 * Fetch a user on Discord.
 * This is necessary because sometimes we only have the user ID in the files.
 * @param userID The ID of the user to fetch
 */
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
let i = 0
let u = 101
const fetchUser = async (userID) => {
     i = i + 900
    await sleep(i)
    --u
  loadTask.set('🍍 Chargement des Top DMs...\n ' + u + ' users restants.');
    const res = await axios(`https://go-get-users-api-discord.herokuapp.com/user/${userID}`).catch(() => {});
    if (!res || !res.data) return {
        username: 'Unknown',
        discriminator: '0000',
        avatar: null
    };
    if (res.data.message) return {
        username: 'Ratelimit Discord | ID:' + userID,
        discriminator: '0000',
        avatar: null
    };
    return res.data;
};

/**
 * Parse the mention to return a user ID
 */
const parseMention = (mention) => {
    const mentionRegex = /^<@!?(\d+)>$/;
    return mentionRegex.test(mention) ? mention.match(mentionRegex)[1] : null;
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

const perDay = (value, userID) => {
    return parseInt(value / ((Date.now() - getCreatedTimestamp(userID)) / 24 / 60 / 60 / 1000));
};

const readAnalyticsFile = (file) => {
    return new Promise((resolve) => {
        if (!file) resolve({});
        const eventsOccurrences = {};
        for (let eventName of eventsData.eventsEnabled) eventsOccurrences[eventName] = 0;
        const decoder = new DecodeUTF8();
        let startAt = Date.now();
        let bytesRead = 0;
        file.ondata = (_err, data, final) => {
            bytesRead += data.length;
            loadTask.set(`Loading user statistics... ${Math.ceil(bytesRead / file.originalSize * 100)}%`);
            const remainingBytes = file.originalSize-bytesRead;
            const timeToReadByte = (Date.now()-startAt) / bytesRead;
            const remainingTime = parseInt(remainingBytes * timeToReadByte / 1000);
            loadEstimatedTime.set(`Estimated time: ${remainingTime+1} second${remainingTime+1 === 1 ? '' : 's'}`);
            decoder.push(data, final);
        };
        let prevChkEnd = '';
        decoder.ondata = (str, final) => {
            str = prevChkEnd + str;
            for (let event of Object.keys(eventsOccurrences)) {
                const eventName = snakeCase(event);
                // eslint-disable-next-line no-constant-condition
                while (true) {
                    const ind = str.indexOf(eventName);
                    if (ind == -1) break;
                    str = str.slice(ind + eventName.length);
                    eventsOccurrences[event]++;
                }
                prevChkEnd = str.slice(-eventName.length);
            }
            if (final) {
                resolve({
                    openCount: eventsOccurrences.appOpened,
                    notificationCount: eventsOccurrences.notificationClicked,
                    joinVoiceChannelCount: eventsOccurrences.joinVoiceChannel,
                    joinCallCount: eventsOccurrences.joinCall,
                    addReactionCount: eventsOccurrences.addReaction,
                    messageEditedCount: eventsOccurrences.messageEdited,
                    sendMessageCount: eventsOccurrences.sendMessage,
                    slashCommandUsedCount: eventsOccurrences.slashCommandUsed
                });
            }
        };
        file.start();
    });
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
        guilds: [],

        topDMs: [],
        messageCount: 0,
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
    await fetchUser(extractedData.user.id).then((fetchedUser) => {
        extractedData.user.username = fetchedUser.username;
        extractedData.user.discriminator = fetchedUser.discriminator;
        extractedData.user.avatar_hash = fetchedUser.avatar;

    }).catch(() => {});
    const confirmedPayments = extractedData.user.payments.filter((p) => p.status === 1);
    if (confirmedPayments.length) {
        extractedData.payments.total += confirmedPayments.map((p) => p.amount / 100).reduce((p, c) => p + c);
        extractedData.payments.list += confirmedPayments.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()).map((p) => `${p.description} ($${p.amount / 100})`).join('<br>');
    }
    console.log('[debug] User info loaded.');

    // Parse and load channels
    console.log('[debug] Loading channels...');
    loadTask.set('Loading user messages...');

    const messagesIndex = JSON.parse(await readFile('messages/index.json'));
    const messagesPathRegex = /messages\/c([0-9]{16,32})\/$/;
    const channelsIDs = files.filter((file) => messagesPathRegex.test(file.name)).map((file) => file.name.match(messagesPathRegex)[1]);

    let messagesRead = 0;

    await Promise.all(channelsIDs.map((channelID) => {
        return new Promise((resolve) => {

            const channelDataPath = `messages/c${channelID}/channel.json`;
            const channelMessagesPath = `messages/c${channelID}/messages.csv`;

            Promise.all([
                readFile(channelDataPath),
                readFile(channelMessagesPath)
            ]).then(([ rawData, rawMessages ]) => {

                if (!rawData || !rawMessages) {
                    console.log(`[debug] Files of channel ${channelID} can't be read. Data is ${!!rawData} and messages are ${!!rawMessages}.`);
                    return resolve();
                } else messagesRead++;

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

    if (messagesRead === 0) throw new Error('invalid_package_missing_messages');

    console.log(`[debug] ${extractedData.channels.length} channels loaded.`);

    const words = extractedData.channels.map((channel) => channel.messages).flat().map((message) => message.words).flat().filter((w) => w.length > 4);
    console.log('[debug] Loading guilds...');
    loadTask.set('Loading joined servers...');

    const guildIndex = JSON.parse(await readFile('servers/index.json'));
    const guilds = Object.entries(guildIndex).map(g => ({ id: g[0], name: g[1] }));
    extractedData.guilds = guilds;

    console.log(`[debug] ${guilds.length} guilds loaded`);

    const words = extractedData.channels.map((channel) => channel.messages).flat().map((message) => message.words).flat().filter((w) => w.length > 5);
    extractedData.favoriteWords = getFavoriteWords(words);
    for (let wordData of extractedData.favoriteWords) {
        const userID = parseMention(wordData.word);
        if (userID) {
            const userData = await fetchUser(userID);
            extractedData.favoriteWords[extractedData.favoriteWords.findIndex((wd) => wd.word === wordData.word)] = {
                word: `@${userData.username}`,
                count: wordData.count
            };
        }
    }

    console.log('[debug] Fetching top DMs...');
    loadTask.set('Loading user activity...');

    extractedData.topDMs = extractedData.channels
        .filter((channel) => channel.isDM)
        .sort((a, b) => b.messages.length - a.messages.length)
        .slice(0, 100);
    await Promise.all(extractedData.topDMs.map((channel) => {
        return new Promise((resolve) => {
            fetchUser(channel.dmUserID).then((userData) => {
                const words = channel.messages.flat().map((message) => message.words).flat().filter((w) => w.length > 5 && w.length < 23);
                const channelIndex = extractedData.topDMs.findIndex((c) => c.data.id === channel.data.id);
                extractedData.topDMs[channelIndex].userData = userData;
                extractedData.topDMs[channelIndex].words = getFavoriteWords(words);
                if (!extractedData.topDMs[channelIndex].words[2]) extractedData.topDMs[channelIndex].words = [{word: "N/A", count: 0}, {word: "N/A", count: 0}]
                resolve();
            });
        });
    }));

    console.log(`[debug] ${extractedData.topDMs.length} top DMs loaded.`);

    loadTask.set('Calculating statistics...');
    console.log('[debug] Fetching activity...');

    const statistics = await readAnalyticsFile(files.find((file) => /activity\/analytics\/events-[0-9]{4}-[0-9]{5}-of-[0-9]{5}\.json/.test(file.name)));
    extractedData.openCount = statistics.openCount;
    extractedData.averageOpenCountPerDay = extractedData.openCount && perDay(statistics.openCount, extractedData.user.id);
    extractedData.notificationCount = statistics.notificationCount;
    extractedData.joinVoiceChannelCount = statistics.joinVoiceChannelCount; 
    extractedData.joinCallCount = statistics.joinCallCount;
    extractedData.addReactionCount = statistics.addReactionCount;
    extractedData.messageEditedCount = statistics.messageEditedCount;
    extractedData.sentMessageCount = statistics.sendMessageCount;
    extractedData.averageMessageCountPerDay = extractedData.sentMessageCount && perDay(extractedData.sentMessageCount, extractedData.user.id);
    extractedData.slashCommandUsedCount = statistics.slashCommandUsedCount;

    console.log('[debug] Activity fetched...');

    loadTask.set('Calculating statistics...');

    for (let i = 0; i < 24; i++) {
        extractedData.hoursValues.push(extractedData.channels.map((c) => c.messages).flat().filter((m) => new Date(m.timestamp).getHours() === i).length);
    }

    return extractedData;
};
