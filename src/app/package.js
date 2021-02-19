export const extractData = async (zip) => {
    const extractStartAt = Date.now();

    const files = Object.keys(zip.files);

    // Parse and load current user informations
    const userInfo = JSON.parse(await zip.files[`account/user.json`].async('text'));
    console.log(userInfo)

    // Parse and load DM statistics
    const DMChannelPathRegex = /messages\/([0-9]{16,32})\/$/;
    const DMChannels = files.filter((path) => DMChannelPathRegex.test(path)).map((path) => path.match(DMChannelPathRegex)[1]);
    const users = [];
    let index = 0;
    for (let channelID of DMChannels) {
        console.log(++index);
        const channelDataPath = `messages/${channelID}/channel.json`;
        const channelMessagesPath = `messages/${channelID}/messages.csv`;
        const channelInfo = JSON.parse(await zip.files[channelDataPath].async('text'));
        const channelMessages = await zip.files[channelMessagesPath].async('text')
        if (channelInfo.recipients && channelInfo.recipients.length === 2) {
            const user = channelInfo.recipients.find((userID) => userID !== userInfo.id);
            users.push(user);
        }
    }
    console.log(users.filter((e) => e === '364481003479105537').length);

    console.log(`Extracted in ${(Date.now() - extractStartAt) / 1000} seconds.`);

    return null;
};
