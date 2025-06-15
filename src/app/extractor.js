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
const fetchUser = async (userID) => {
    const res = await axios(`https://diswho.androz2091.fr/user/${userID}`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('diswhoJwt')}`
        }
    }).catch(() => {});
    if (!res || !res.data) return {
        username: 'Unknown',
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

/**
 * Parse a messages JSON into an object
 * @param input
 */
const parseJson = (input) => {
    return JSON.parse(input)
    .filter((m) => m.Contents)
    .map((m) => ({
        id: m.ID,
        timestamp: m.Timestamp,
        length: m.Contents.length,
        words: m.Contents.split(' ')
        // content: m.Contents,
        // attachments: m.Attachments
    }));
}

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

        topDMs: [],
        topChannels: [],
        guildCount: 0,
        dmChannelCount: 0,
        channelCount: 0,
        messageCount: 0,
        characterCount: 0,
        totalSpent: 0,
        hoursValues: [],
        favoriteWords: null,
        payments: {
            total: { usd: 0 },
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

    extractedData.user = JSON.parse(await readFile('Account/user.json'));
    loadTask.set('Fetching user information...');
    const fetchedUser = await fetchUser(extractedData.user.id);
    extractedData.user.username = fetchedUser.username;
    extractedData.user.discriminator = fetchedUser.discriminator;
    extractedData.user.avatar_hash = fetchedUser.avatar;

    const confirmedPayments = extractedData.user.payments.filter((p) => p.status === 1);
    if (confirmedPayments.length) {
        const currencies = [...new Set(confirmedPayments.map((p) => p.currency))];
        for (let p of confirmedPayments) {
            if (!extractedData.payments.total[p.currency]) extractedData.payments.total[p.currency] = p.amount / 100;
            else extractedData.payments.total[p.currency] += p.amount / 100;
        }
        extractedData.payments.list += confirmedPayments.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()).map((p) => `${p.description} (${p.currency.toUpperCase()} ${p.amount / 100})`).join('<br>');
        extractedData.payments.total = ((loc) => {
            const totals = [];
            for (let currency of currencies) {
                totals.push(currency.toLocaleUpperCase() + " " + extractedData.payments.total[currency].toLocaleString(loc));
            }
            return totals.join(", ");
        })('en-US');
    }
    console.log('[debug] User info loaded.');

    // Parse and load channels
    console.log('[debug] Loading channels...');
    loadTask.set('Loading user messages...');

    const messagesIndex = JSON.parse(await readFile('Messages/index.json'));

    const messagesPathRegex = /Messages\/c?([0-9]{16,32})\/$/;
    const channelsIDsFile = files.filter((file) => messagesPathRegex.test(file.name));

    // Packages before 06-12-2021 does not have the leading "c" before the channel ID
    const isOldPackage = channelsIDsFile[0].name.match(/Messages\/(c)?([0-9]{16,32})\/$/)[1] === undefined;
    const channelsIDs = channelsIDsFile.map((file) => file.name.match(messagesPathRegex)[1]);

    // Packages before 01-03-2024 does not have json files for messages but csv files
    const isOldPackagev2 = files.find((file) => /Messages\/c?([0-9]{16,32})\/messages.json/.test(file.name)) === undefined;

    console.log(`[debug] Old package (2021): ${isOldPackage}`);
    console.log(`[debug] Old package (2024): ${isOldPackagev2}`);

    const channels = [];
    let messagesRead = 0;

    await Promise.all(channelsIDs.map((channelID) => {
        return new Promise((resolve) => {

            const channelDataPath = `Messages/${isOldPackage ? '' : 'c'}${channelID}/channel.json`;
            const extension = isOldPackagev2 ? 'csv' : 'json';
            const channelMessagesPath = `Messages/${isOldPackage ? '' : 'c'}${channelID}/messages.${extension}`;

            Promise.all([
                readFile(channelDataPath),
                readFile(channelMessagesPath)
            ]).then(([ rawData, rawMessages ]) => {

                if (!rawData || !rawMessages) {
                    console.log(`[debug] Files of channel ${channelID} can't be read. Data is ${!!rawData} and messages are ${!!rawMessages}. (path=${channelDataPath})`);
                    return resolve();
                } else messagesRead++;

                const data = JSON.parse(rawData);
                const messages = extension === 'csv' ? parseCSV(rawMessages) : parseJson(rawMessages);
                const name = messagesIndex[data.id];
                const isDM = data.recipients && data.recipients.length === 2;
                const dmUserID = isDM ? data.recipients.find((userID) => userID !== extractedData.user.id) : undefined;
                channels.push({
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

    loadTask.set('Calculating statistics...');

    extractedData.channelCount = channels.filter(c => !c.isDM).length;
    extractedData.dmChannelCount = channels.length - extractedData.channelCount;
    extractedData.topChannels = channels.filter(c => c.data && c.data.guild).sort((a, b) => b.messages.length - a.messages.length).slice(0, 10).map((channel) => ({
        name: channel.name,
        messageCount: channel.messages.length,
        guildName: channel.data.guild.name
    }));
    extractedData.characterCount = channels.map((channel) => channel.messages).flat().map((message) => message.length).reduce((p, c) => p + c);

    for (let i = 0; i < 24; i++) {
        extractedData.hoursValues.push(channels.map((c) => c.messages).flat().filter((m) => new Date(m.timestamp).getHours() === i).length);
    }

    console.log(`[debug] ${channels.length} channels loaded.`);

    console.log('[debug] Loading guilds...');
    loadTask.set('Loading joined servers...');

    const guildIndex = JSON.parse(await readFile('Servers/index.json'));
    extractedData.guildCount = Object.keys(guildIndex).length;

    console.log(`[debug] ${extractedData.guildCount} guilds loaded`);

    const words = channels.map((channel) => channel.messages).flat().map((message) => message.words).flat().filter((w) => w.length > 5);
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
    
    extractedData.topDMs = channels
        .filter((channel) => channel.isDM)
        .sort((a, b) => b.messages.length - a.messages.length)
        .slice(0, 10)
        .map((channel) => ({
            id: channel.data.id,
            dmUserID: channel.dmUserID,
            messageCount: channel.messages.length,
            userData: null
        }));
    await Promise.all(extractedData.topDMs.map((channel) => {
        return new Promise((resolve) => {
            fetchUser(channel.dmUserID).then((userData) => {
                const channelIndex = extractedData.topDMs.findIndex((c) => c.id === channel.id);
                extractedData.topDMs[channelIndex].userData = userData;
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

    console.log(extractedData);

    return extractedData;
};
