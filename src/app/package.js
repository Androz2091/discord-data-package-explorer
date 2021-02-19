import * as zip from '@zip.js/zip.js';

export const extractData = async (entries) => {

    const getFile = (name) => entries.find((entry) => entry.filename === name);
    const readFile = (name) => getFile(name).getData(new zip.TextWriter());

    const extractStartAt = Date.now();

    // Parse and load current user informations
    const userInfo = JSON.parse(await readFile(`account/user.json`));
    console.log(userInfo)

    // Parse and load DM statistics
    const DMChannelPathRegex = /messages\/([0-9]{16,32})\/$/;
    const DMChannels = entries.filter((entry) => DMChannelPathRegex.test(entry.filename)).map((entry) => entry.filename.match(DMChannelPathRegex)[1]);
    const users = [];
    let index = 0;
    for (let channelID of DMChannels) {
        console.log(++index);
        const channelDataPath = `messages/${channelID}/channel.json`;
        const channelMessagesPath = `messages/${channelID}/messages.csv`;
        const channelInfo = JSON.parse(await readFile(channelDataPath));
        const channelMessages = await readFile(channelMessagesPath);
        if (channelInfo.recipients && channelInfo.recipients.length === 2) {
            const user = channelInfo.recipients.find((userID) => userID !== userInfo.id);
            users.push(user);
        }
    }
    console.log(users.filter((e) => e === '364481003479105537').length);

    console.log(`Extracted in ${(Date.now() - extractStartAt) / 1000} seconds.`);

    return null;
};
