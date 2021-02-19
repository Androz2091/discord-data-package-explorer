import * as zip from '@zip.js/zip.js';
import { loadedPercent } from './store';

export const extractData = async (entries) => {

    const getFile = (name) => entries.find((entry) => entry.filename === name);
    const readFile = (name) => getFile(name).getData(new zip.TextWriter());

    const extractStartAt = Date.now();

    // Parse and load current user informations
    const userInfo = JSON.parse(await readFile('account/user.json'));
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
    const DMChannelPathRegex = /messages\/([0-9]{16,32})\/$/;
    const DMChannelsIDs = entries.filter((entry) => DMChannelPathRegex.test(entry.filename)).map((entry) => entry.filename.match(DMChannelPathRegex)[1]);
    let index = 0;
    const users = [];
    for (let channelID of DMChannelsIDs) {
        index++;
        loadedPercent.set(parseInt(index * 100 / DMChannelsIDs.length));
        const channelDataPath = `messages/${channelID}/channel.json`;
        // const channelMessagesPath = `messages/${channelID}/messages.csv`;
        const channelData = JSON.parse(await readFile(channelDataPath));
        // const channelMessages = await readFile(channelMessagesPath);
        if (channelData.recipients && channelData.recipients.length === 2) {
            const user = channelData.recipients.find((userID) => userID !== userInfo.id);
            users.push(user);
        }
    }
    console.log(`[debug] ${DMChannelsIDs.length} channels loaded.`);

    console.log(`[debug] Data extracted in ${(Date.now() - extractStartAt) / 1000} seconds.`);

    return {
        DMsCount: users.length
    };
};
