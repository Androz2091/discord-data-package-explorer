import * as zip from '@zip.js/zip.js';
import Papa from 'papaparse';
import { loadedPercent, loadedStartAt } from './store';

export const extractData = async (entries) => {

    const getFile = (name) => entries.find((entry) => entry.filename === name);
    const readFile = (name) => getFile(name).getData(new zip.TextWriter());

    const extractStartAt = Date.now();

    // Parse and load current user informations
    const user = JSON.parse(await readFile('account/user.json'));
    console.log('[debug] User info loaded.');

    // Parse and load applications
    const applicationPathRegex = /account\/applications\/([0-9]{16,32})\/$/;
    const applicationsIDs = entries.filter((entry) => applicationPathRegex.test(entry.filename)).map((entry) => entry.filename.match(applicationPathRegex)[1]);
    const applications = [];
    for (let applicationID of applicationsIDs) {
        const applicationDataPath = `account/applications/${applicationID}/application.json`;
        const applicationData = JSON.parse(await readFile(applicationDataPath));
        applications.push(applicationData);
    }
    console.log(`[debug] ${applicationsIDs.length} applications loaded.`);

    // Parse and load DM statistics
    const messagesIndex = JSON.parse(await readFile('messages/index.json'));

    let index = 0;
    loadedStartAt.set(Date.now());

    const messagesPathRegex = /messages\/([0-9]{16,32})\/$/;
    const messagesChannelsIDs = entries.filter((entry) => messagesPathRegex.test(entry.filename)).map((entry) => entry.filename.match(messagesPathRegex)[1]);

    const messages = [];
    for (let channelID of messagesChannelsIDs) {

        // update percents
        index++;
        loadedPercent.set(parseInt(index * 100 / messagesChannelsIDs.length));

        const channelDataPath = `messages/${channelID}/channel.json`;
        const channelMessagesPath = `messages/${channelID}/messages.csv`;
        const channelData = JSON.parse(await readFile(channelDataPath));
        const channelMessagesCSV = await readFile(channelMessagesPath);
        const channelMessages = Papa.parse(channelMessagesCSV, {
            header: true,
            newline: ',\r'
        })
            .data
            .filter((m) => m.Contents)
            .map((m) => ({ id: m.ID, sentAt: m.Timestamp, length: m.Contents.length }));

        const channelName = messagesIndex[channelData.id];

        // if it is a DM channel
        let userID;
        if (channelData.recipients && channelData.recipients.length === 2) {
            userID = channelData.recipients.find((userID) => userID !== user.id);
        }

        messages.push({
            channelID,
            isDM: !!userID,
            userID,
            channelMessages,
            channelName
        });
    }
    console.log(messages.sort((a, b) => b.channelMessages.length - a.channelMessages.length)[0]);
    console.log(messages.sort((a, b) => b.channelMessages.length - a.channelMessages.length)[1]);
    console.log(messages.sort((a, b) => b.channelMessages.length - a.channelMessages.length)[2]);
    console.log(messages.sort((a, b) => b.channelMessages.length - a.channelMessages.length)[3]);
    console.log(messages.sort((a, b) => b.channelMessages.length - a.channelMessages.length)[4]);
    console.log(messages.sort((a, b) => b.channelMessages.length - a.channelMessages.length)[5]);
    console.log(messages.sort((a, b) => b.channelMessages.length - a.channelMessages.length)[6]);
    console.log(`[debug] ${messagesChannelsIDs.length} channels loaded.`);

    console.log(`[debug] Data extracted in ${(Date.now() - extractStartAt) / 1000} seconds.`);

    return {
        user,
        applications,
        messages
    };
};
