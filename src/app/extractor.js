import * as zip from '@zip.js/zip.js';
import Papa from 'papaparse';
import axios from 'axios';

import { getCreatedTimestamp } from './helpers';

/**
 * Fetch a user on Discord
 * @param userID The ID of the user to fetch
 */
const fetchUser = async (userID) => {
    const { data } = await axios(`https://diswho.androz2091.fr/user/${userID}`);
    return data;
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
            // content: m.Contents,
            // attachments: m.Attachments
        }));
};

/**
 * Extract the data from the package file.
 * @param entries The ZIP file entries
 * @returns The extracted data
 */
export const extractData = async (entries) => {

    const extractedData = {
        user: null,
        applications: [],
        channels: [],

        topDMs: [],
        messageCount: 0,
        averageMessageCountPerDay: 0
    };

    // Get the entry from the name
    const getFile = (name) => entries.find((entry) => entry.filename === name);
    // Read a file from its name
    const readFile = (name) => getFile(name).getData(new zip.TextWriter());

    // Parse and load current user informations
    console.log('[debug] Loading user info...');
    extractedData.user = JSON.parse(await readFile('account/user.json'));
    console.log('[debug] User info loaded.');

    // Parse and load applications
    console.log('[debug] Loading user applications...');
    const applicationPathRegex = /account\/applications\/([0-9]{16,32})\/$/;
    const applicationsIDs = entries.filter((entry) => applicationPathRegex.test(entry.filename)).map((entry) => entry.filename.match(applicationPathRegex)[1]);
    for (let applicationID of applicationsIDs) {
        const applicationDataPath = `account/applications/${applicationID}/application.json`;
        const applicationData = JSON.parse(await readFile(applicationDataPath));
        extractedData.applications.push(applicationData);
    }
    console.log(`[debug] ${applicationsIDs.length} user applications loaded.`);

    // Parse and load channels
    console.log('[debug] Loading channels...');

    const messagesIndex = JSON.parse(await readFile('messages/index.json'));
    const messagesPathRegex = /messages\/([0-9]{16,32})\/$/;
    const channelsIDs = entries.filter((entry) => messagesPathRegex.test(entry.filename)).map((entry) => entry.filename.match(messagesPathRegex)[1]);

    await Promise.all(channelsIDs.map((channelID) => {
        return new Promise((resolve) => {

            const channelDataPath = `messages/${channelID}/channel.json`;
            const channelMessagesPath = `messages/${channelID}/messages.csv`;

            Promise.all([
                readFile(channelDataPath),
                readFile(channelMessagesPath)
            ]).then(([ rawData, rawMessages ]) => {
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

    console.log('[debug] Fetching top DMs...');
    
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

    extractedData.messageCount = extractedData.channels.map((c) => c.messages.length).reduce((p, c) => p + c);
    extractedData.averageMessageCountPerDay = parseInt(extractedData.messageCount / ((Date.now() - getCreatedTimestamp(extractedData.user.id)) / 24 / 60 / 60 / 1000));

    return extractedData;
};
