import Papa from 'papaparse';
import axios from 'axios';

import eventsData from './events.json';
import { loadEstimatedTime, loadTask } from './store';
import { getCreatedTimestamp, getFavoriteWords } from './helpers';
import { DecodeUTF8 } from 'fflate';
import { snakeCase } from 'change-case';

const getMessagesRoot = (files) => {
    // Find any channel.json inside a numbered folder
    const sample = files.find(f => /\/c?[0-9]{16,32}\/channel\.json$/.test(f.name));
    if (!sample) throw new Error('Could not find Messages folder structure');
    // Remove the channel ID and file name to get the root
    const segments = sample.name.split('/');
    return segments.slice(0, segments.length - 2).join('/');
};

const getServersRoot = (files) => {
    // Find any guild.json inside a numbered folder
    const sample = files.find(f => /\/[0-9]{16,32}\/guild\.json$/.test(f.name));
    if (!sample) return null;
    // Remove the guild ID and file name to get the root
    const segments = sample.name.split('/');
    return segments.slice(0, segments.length - 2).join('/');
};

/*
 * Gets the root of the user folder.
 *
 * Important: we cannot simply use the first user.json file found, because the package can contain multiple files.
 *
 *   * Activités/Activities_1/users/user.json
 *   * Compte/user.json
 */
const getUserRoot = (files) => {
    // Find any user.json file
    const sample = files.find(f => /^([^/]+)\/user\.json$/.test(f.name));
    if (!sample) throw new Error('Could not find User folder structure');
    // Remove the file name to get the root
    const segments = sample.name.split('/');
    return segments.slice(0, segments.length - 1).join('/');
};

/**
 * Fetch a user on Discord.
 * This is necessary because sometimes we only have the user ID in the files.
 * @param userID The ID of the user to fetch
 */
const fetchUser = async (userID) => {
    const res = await axios(`${import.meta.env.VITE_DISWHO_URL}/user/${userID}`, {
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

export const fetchDMUsers = (dms) => Promise.all(dms.map(async (dm) => {
    if (dm.isGroupDM) dm.members = await Promise.all(dm.memberIDs.map(fetchUser));
    else dm.userData = await fetchUser(dm.dmUserID);
}));

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
};

const perDay = (value, userID) => {
    return parseInt(value / ((Date.now() - getCreatedTimestamp(userID)) / 24 / 60 / 60 / 1000));
};

// Recent packages write message times in UTC without an offset, which `Date` would read as local time.
const parseTimestamp = (timestamp) => Date.parse(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(timestamp) ? `${timestamp.replace(' ', 'T')}Z` : timestamp);

const zoneHourReader = (zone) => {
    let format;
    try {
        format = new Intl.DateTimeFormat('en-US', { timeZone: zone, hourCycle: 'h23', year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric' });
    } catch {
        return null;
    }
    // The offset only changes at daylight saving transitions, so it is computed once per zone and hour.
    const offsets = new Map();
    return (time) => {
        const hour = Math.floor(time / 3600000);
        let offset = offsets.get(hour);
        if (offset === undefined) {
            const parts = Object.fromEntries(format.formatToParts(hour * 3600000).map((part) => [part.type, Number(part.value)]));
            offset = Date.UTC(parts.year, parts.month - 1, parts.day, parts.hour, parts.minute) - hour * 3600000;
            offsets.set(hour, offset);
        }
        return new Date(time + offset).getUTCHours();
    };
};

const SENT_MESSAGE_EVENT = '"event_type":"send_message"';

const messagesPerDay = (messages) => {
    let first = Infinity;
    let last = -Infinity;
    for (const message of messages) {
        const time = parseTimestamp(message.timestamp);
        if (time < first) first = time;
        if (time > last) last = time;
    }
    // A day at least, so messages sent within a few hours aren't scaled up to a whole day.
    return messages.length / Math.max(1, (last - first) / 86400000);
};

const readAnalyticsFile = (file) => {
    return new Promise((resolve, reject) => {
        if (!file) return resolve({});
        const eventsOccurrences = {};
        for (let eventName of eventsData.eventsEnabled) eventsOccurrences[eventName] = 0;
        const decoder = new DecodeUTF8();
        let startAt = Date.now();
        let bytesRead = 0;
        file.ondata = (err, data, final) => {
            if (err) return reject(err);
            bytesRead += data.length;
            loadTask.set(`Loading user statistics... ${Math.ceil(bytesRead / file.originalSize * 100)}%`);
            const remainingBytes = file.originalSize-bytesRead;
            const timeToReadByte = (Date.now()-startAt) / bytesRead;
            const remainingTime = parseInt(remainingBytes * timeToReadByte / 1000);
            loadEstimatedTime.set(`Estimated time: ${remainingTime+1} second${remainingTime+1 === 1 ? '' : 's'}`);
            decoder.push(data, final);
        };
        // The end of the previous chunk is prepended so an event name split between two chunks is found.
        // Matches that end inside it were already counted with the previous chunk.
        const eventNames = Object.keys(eventsOccurrences).map((event) => [event, snakeCase(event)]);
        const carryLength = Math.max(...eventNames.map(([, eventName]) => eventName.length)) - 1;
        let carry = '';
        // A `send_message` event carries the time zone of the device that sent the message, at the second of
        // the message in the package. Chunks cut lines anywhere, so a line is read once the next chunk ends it.
        const sentZones = new Map();
        const zoneNames = [];
        let lineCarry = '';
        decoder.ondata = (str, final) => {
            const text = carry + str;
            for (const [event, eventName] of eventNames) {
                let ind = text.indexOf(eventName, Math.max(0, carry.length - eventName.length + 1));
                while (ind !== -1) {
                    eventsOccurrences[event]++;
                    ind = text.indexOf(eventName, ind + eventName.length);
                }
            }
            carry = text.slice(-carryLength);
            const lines = lineCarry + str;
            const whole = final ? lines.length : lines.lastIndexOf('\n') + 1;
            let at = lines.indexOf(SENT_MESSAGE_EVENT);
            while (at !== -1 && at < whole) {
                const end = lines.indexOf('\n', at);
                const line = lines.slice(lines.lastIndexOf('\n', at) + 1, end === -1 ? lines.length : end);
                const zone = line.match(/"time_zone":"([^"]+)"/);
                const timestamp = line.match(/"timestamp":"\\"([^"\\]+)\\""/);
                if (zone && timestamp) {
                    let zoneIndex = zoneNames.indexOf(zone[1]);
                    if (zoneIndex === -1) zoneIndex = zoneNames.push(zone[1]) - 1;
                    sentZones.set(Math.floor(Date.parse(timestamp[1]) / 1000), zoneIndex);
                }
                at = end === -1 ? -1 : lines.indexOf(SENT_MESSAGE_EVENT, end);
            }
            lineCarry = lines.slice(whole);
            if (final) {
                resolve({
                    openCount: eventsOccurrences.appOpened,
                    notificationCount: eventsOccurrences.notificationClicked,
                    joinVoiceChannelCount: eventsOccurrences.joinVoiceChannel,
                    joinCallCount: eventsOccurrences.joinCall,
                    addReactionCount: eventsOccurrences.addReaction,
                    messageEditedCount: eventsOccurrences.messageEdited,
                    sendMessageCount: eventsOccurrences.sendMessage,
                    slashCommandUsedCount: eventsOccurrences.slashCommandUsed,
                    sentZones,
                    zoneNames
                });
            }
        };
        file.start();
    });
};

const CHANNELS_READ_AT_ONCE = 8;

// The top lists keep more than the 10 they show for "Show more", but not every channel, since the data is
// stored in `localStorage`.
const TOP_KEPT = 100;

// Unlike `setTimeout`, a `MessageChannel` message isn't held back 4 ms once nested, or a second in a
// background tab.
const yieldToBrowser = () => new Promise((resolve) => {
    const { port1, port2 } = new MessageChannel();
    port1.onmessage = () => {
        port1.close();
        resolve();
    };
    port2.postMessage(null);
});

/**
 * Extract the data from the package file.
 * @param files The files in the package
 * @returns The extracted data
 */
export const extractData = async (files) => {

    const extractedData = {
        user: null,
        lookupsFailed: false,

        topDMs: [],
        topChannels: [],
        topGuilds: [],
        guildCount: 0,
        dmChannelCount: 0,
        channelCount: 0,
        messageCount: 0,
        characterCount: 0,
        totalSpent: 0,
        hoursValues: [],
        messageCountPerYear: {},
        favoriteWords: null,
        payments: {
            total: 0,
            list: ''
        }
    };

    const accountFolder = getUserRoot(files);
    const serversFolder = getServersRoot(files);
    const messagesRoot = getMessagesRoot(files);

    console.log('[debug] Found account folder:', accountFolder);
    console.log('[debug] Found servers folder:', serversFolder);
    console.log('[debug] Found messages root:', messagesRoot);

    const getFile = (name) => files.find((file) => file.name === name);
    // Read a file from its name
    const readFile = (name) => {
        return new Promise((resolve, reject) => {
            const file = getFile(name);
            if (!file) return resolve(null);
            const fileContent = [];
            const decoder = new DecodeUTF8();
            file.ondata = (err, data, final) => {
                if (err) return reject(err);
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

    extractedData.user = JSON.parse(await readFile(`${accountFolder}/user.json`));
    loadTask.set('Fetching user information...');
    const fetchedUser = await fetchUser(extractedData.user.id);
    // A failed lookup has no `id`, and the package has the user's own name and avatar to keep then.
    if (fetchedUser.id) {
        extractedData.user.username = fetchedUser.username;
        extractedData.user.discriminator = fetchedUser.discriminator;
        extractedData.user.avatar_hash = fetchedUser.avatar;
    }

    // Recent exports keep payments in the billing export, older ones in `user.json`.
    const rawBillingPayments = await readFile(`${accountFolder}/user_data_exports/discord_billing/payments.json`);
    const payments = rawBillingPayments ? JSON.parse(rawBillingPayments).records : extractedData.user.payments;

    // Discord Orbs are a virtual currency awarded via Quests / events — the
    // user never pays real money for them, and the `amount` is denominated in
    // orbs (not cents). Including these would tell e.g. a user with €0 of
    // real spend but 29 720 orbs of cosmetic purchases that they spent
    // "DISCORD_ORB 297.20", which is meaningless. Drop them alongside the
    // status filter.
    const confirmedPayments = (payments || []).filter((p) => p.status === 1 && p.currency !== 'discord_orb');
    if (confirmedPayments.length) {
        const currencies = [...new Set(confirmedPayments.map((p) => p.currency))];
        extractedData.payments.total = {};
        for (let p of confirmedPayments) {
            if (!extractedData.payments.total[p.currency]) extractedData.payments.total[p.currency] = p.amount / 100;
            else extractedData.payments.total[p.currency] += p.amount / 100;
        }
        extractedData.payments.list += confirmedPayments.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()).map((p) => `${p.description} (${p.currency.toUpperCase()} ${p.amount / 100})`).join('<br>');
        extractedData.payments.total = ((loc) => {
            const totals = [];
            for (let currency of currencies) {
                totals.push(currency.toLocaleUpperCase() + ' ' + extractedData.payments.total[currency].toLocaleString(loc));
            }
            return totals.join(', ');
        })('en-US');
    }
    console.log('[debug] User info loaded.');

    // Parse and load channels
    console.log('[debug] Loading channels...');
    loadTask.set('Loading user messages...');

    const messagesIndex = JSON.parse(await readFile(`${messagesRoot}/index.json`));

    // Channels are found from their `channel.json` files, since some zips have no directory entries.
    const messagesPathRegex = /\/(c)?([0-9]{16,32})\/channel\.json$/;
    const channelsIDsFile = files.filter((file) => messagesPathRegex.test(file.name) && file.name.startsWith(messagesRoot));

    // Packages before 06-12-2021 does not have the leading "c" before the channel ID
    const isOldPackage = channelsIDsFile[0].name.match(messagesPathRegex)[1] === undefined;
    const channelsIDs = channelsIDsFile.map((file) => file.name.match(messagesPathRegex)[2]);

    // Packages before 01-03-2024 does not have json files for messages but csv files
    const isOldPackagev2 = files.find((file) => /c?([0-9]{16,32})\/messages.json/.test(file.name)) === undefined;

    console.log(`[debug] Old package (2021): ${isOldPackage}`);
    console.log(`[debug] Old package (2024): ${isOldPackagev2}`);

    const readChannel = async (channelID) => {
        const channelDataPath = `${messagesRoot}/${isOldPackage ? '' : 'c'}${channelID}/channel.json`;
        const extension = isOldPackagev2 ? 'csv' : 'json';
        const channelMessagesPath = `${messagesRoot}/${isOldPackage ? '' : 'c'}${channelID}/messages.${extension}`;

        const [ rawData, rawMessages ] = await Promise.all([
            readFile(channelDataPath),
            readFile(channelMessagesPath)
        ]);

        if (!rawData || !rawMessages) {
            console.log(`[debug] Files of channel ${channelID} can't be read. Data is ${!!rawData} and messages are ${!!rawMessages}. (path=${channelDataPath})`);
            return null;
        }

        const data = JSON.parse(rawData);
        const messages = extension === 'csv' ? parseCSV(rawMessages) : parseJson(rawMessages);
        const name = messagesIndex[data.id];
        const isDM = data.recipients && data.recipients.length === 2;
        const dmUserID = isDM ? data.recipients.find((userID) => userID !== extractedData.user.id) : undefined;
        // Recent packages name the channel types, older ones number them.
        const isGroupDM = data.type === 'GROUP_DM' || data.type === 3;
        return {
            data,
            messages,
            name,
            isDM,
            dmUserID,
            isGroupDM
        };
    };

    // Each reader takes the next channel as soon as its own is read, so a large messages file, which fflate
    // inflates in a worker, doesn't hold the others back. The channels keep the order of the package, which
    // breaks the ties of the top channels, DMs and words.
    const channelsRead = [];
    let nextChannel = 0;
    const reader = async () => {
        while (nextChannel < channelsIDs.length) {
            const index = nextChannel++;
            channelsRead[index] = await readChannel(channelsIDs[index]);
            await yieldToBrowser();
        }
    };
    await Promise.all(Array.from({ length: CHANNELS_READ_AT_ONCE }, reader));
    const channels = channelsRead.filter(Boolean);

    if (channels.length === 0) throw new Error('invalid_package_missing_messages');

    loadTask.set('Calculating statistics...');

    extractedData.channelCount = channels.filter(c => !c.isDM).length;
    extractedData.dmChannelCount = channels.length - extractedData.channelCount;
    extractedData.topChannels = channels.filter(c => c.data && c.data.guild).sort((a, b) => b.messages.length - a.messages.length).slice(0, TOP_KEPT).map((channel) => ({
        name: channel.name,
        messageCount: channel.messages.length,
        guildName: channel.data.guild.name
    }));
    // A channel Discord no longer describes has no `guild`, so its messages count for no server.
    const guilds = new Map();
    for (const channel of channels) {
        if (!channel.data.guild) continue;
        const guild = guilds.get(channel.data.guild.id) || { name: channel.data.guild.name, messageCount: 0 };
        guild.messageCount += channel.messages.length;
        guilds.set(channel.data.guild.id, guild);
    }
    extractedData.topGuilds = [...guilds.values()].sort((a, b) => b.messageCount - a.messageCount).slice(0, TOP_KEPT);
    extractedData.characterCount = channels.map((channel) => channel.messages).flat().map((message) => message.length).reduce((p, c) => p + c);

    console.log(`[debug] ${channels.length} channels loaded.`);

    console.log('[debug] Loading guilds...');
    loadTask.set('Loading joined servers...');

    if (serversFolder) {
        const guildIndex = JSON.parse(await readFile(`${serversFolder}/index.json`));
        extractedData.guildCount = Object.keys(guildIndex).length;
    }

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
    
    // A group DM with one other member left has two recipients, like a DM, so its type comes first.
    extractedData.topDMs = channels
        .filter((channel) => channel.isDM || channel.isGroupDM)
        .sort((a, b) => b.messages.length - a.messages.length)
        .slice(0, TOP_KEPT)
        .map((channel) => channel.isGroupDM ? {
            id: channel.data.id,
            isGroupDM: true,
            name: channel.data.name || null,
            memberIDs: (channel.data.recipients || []).filter((userID) => userID !== extractedData.user.id),
            messageCount: channel.messages.length,
            messagesPerDay: messagesPerDay(channel.messages),
            members: null
        } : {
            id: channel.data.id,
            dmUserID: channel.dmUserID,
            messageCount: channel.messages.length,
            messagesPerDay: messagesPerDay(channel.messages),
            userData: null
        });
    // The others are looked up when "Show more" shows them.
    await fetchDMUsers(extractedData.topDMs.slice(0, 10));
    // When every lookup fails, something blocks diswho, an ad blocker for eg., and the page says so.
    extractedData.lookupsFailed = [fetchedUser, ...extractedData.topDMs.slice(0, 10).flatMap((dm) => (dm.isGroupDM ? dm.members : [dm.userData]))].every((userData) => !userData.id);

    console.log(`[debug] ${extractedData.topDMs.length} top DMs loaded.`);

    loadTask.set('Calculating statistics...');
    console.log('[debug] Fetching activity...');

    // Many exports ship without `analytics`. `reporting` carries the same app open, voice, reaction and message events, `tns` and `modeling` carry fewer of them.
    const analyticsFile = files.find((file) => /analytics\/events-[0-9]{4}-[0-9]{5}-of-[0-9]{5}\.json/.test(file.name));
    const reportingFile = files.find((file) => /reporting\/events-[0-9]{4}-[0-9]{5}-of-[0-9]{5}\.json/.test(file.name));
    const activityFile = analyticsFile || reportingFile;
    console.log('[debug] Found activity file:', activityFile && activityFile.name);

    const statistics = await readAnalyticsFile(activityFile);

    const zoneHours = (statistics.zoneNames || []).map(zoneHourReader);
    extractedData.hoursValues = new Array(24).fill(0);
    const years = extractedData.messageCountPerYear;
    for (const channel of channels) {
        for (const message of channel.messages) {
            const time = parseTimestamp(message.timestamp);
            if (Number.isNaN(time)) continue;
            const year = new Date(time).getUTCFullYear();
            years[year] = (years[year] || 0) + 1;
            const second = Math.floor(time / 1000);
            // An event's second can be one off its message's.
            const zone = statistics.sentZones && (statistics.sentZones.get(second) ?? statistics.sentZones.get(second - 1) ?? statistics.sentZones.get(second + 1));
            const readHour = zone === undefined ? null : zoneHours[zone];
            extractedData.hoursValues[readHour ? readHour(time) : new Date(time).getHours()]++;
        }
    }
    // A year without a message still shows, as a gap in the chart.
    const yearsWithMessages = Object.keys(years).map(Number);
    for (let year = Math.min(...yearsWithMessages); year < Math.max(...yearsWithMessages); year++) years[year] = years[year] || 0;

    // `reporting` never carries these events, so its 0 would stand for an unknown count.
    if (activityFile && activityFile === reportingFile) {
        for (const stat of ['notificationCount', 'joinCallCount', 'messageEditedCount', 'slashCommandUsedCount']) delete statistics[stat];
    }
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
