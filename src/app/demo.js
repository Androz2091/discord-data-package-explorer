const randomNumber = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);

const demoUserObject = {
    id: 422820341791064085,
    username: 'Wumpus',
    discriminator: '0000',
    avatar: null
};
    
export default () => {

    const removeAnalytics = window.location.href.includes('noanalytics');

    return {
        isDemo: true,

        user: demoUserObject,

        topDMs: new Array(10).fill({}).map(() => ({
            messageCount: randomNumber(200, 600),
            userData: demoUserObject
        })).sort((a, b) => b.messageCount - a.messageCount),
        topChannels: new Array(10).fill({}).map(() => ({
            messageCount: randomNumber(200, 600),
            name: 'awesome',
            guildName: 'AndrozDev'
        })).sort((a, b) => b.messageCount - a.messageCount),
        guildCount: randomNumber(10, 200),
        dmChannelCount: randomNumber(30, 50),
        channelCount: randomNumber(50, 100),
        messageCount: randomNumber(300, 600),
        characterCount: randomNumber(4000, 10000),
        totalSpent: randomNumber(100, 200),
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
            total: 0,
            list: ''
        },

        ...(!removeAnalytics && {
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
        })
    };
};
