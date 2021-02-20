export const generateAvatarURL = (avatarHash, id, discriminator) => {
    let avatarURL = 'https://cdn.discordapp.com/';
    if (avatarHash) avatarURL += `avatars/${id}/${avatarHash}.webp`;
    else avatarURL += `embed/avatars/${discriminator % 5}.png`;
    return avatarURL;
};

export const getCreatedTimestamp = (id) => {
    const EPOCH = 1420070400000;
    return id / 4194304 + EPOCH;
};

export const mostOccurences = (arr) => {
    const counts = {};
    let maxCount = 0;
    let maxKey;
    for (let i = 0; i < arr.length; i++) {
        const key = arr[i];
        const count = (counts[key] = (counts[key] || 0) + 1);
        if (count > maxCount) {
            maxCount = count;
            maxKey = key;
        }
    }
    return maxKey;
};
