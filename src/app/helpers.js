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

export const mostOccurences = (arr, words = false) => {
    if (!words) {
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
    } else {
        arr = arr.flat(3);
    
        var item,
            length = arr.length,
            array = [],
            object = {};
    
        for (var index = 0; index < length; index++) {
            item = arr[index];
            if (!item) continue;
    
            if (!object[item]) object[item] = 1;
            else ++object[item];
        }
    
        for (var p in object) array[array.length] = p;
    
        return array.sort((a, b) => {
            return object[b] - object[a];
        }).map((word) => { return { word: word, count: object[word] } });
    }
};
