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

export const getFavoriteWords = (words) => {
    words = words.flat(3);
    
    let item,
        length = words.length,
        array = [],
        object = {};
    
    for (let index = 0; index < length; index++) {
        item = words[index];
        if (!item) continue;
    
        if (!object[item]) object[item] = 1;
        else ++object[item];
    }
    
    for (let p in object) array[array.length] = p;
    
    return array.sort((a, b) => object[b] - object[a]).map((word) => ({ word: word, count: object[word] })).slice(0, 10);
};
