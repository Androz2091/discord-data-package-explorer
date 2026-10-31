import axios from 'axios';

// Unique usernames have the discriminator "0", or none at all.
export const hasDiscriminator = (discriminator) => Number(discriminator) > 0;

export const generateAvatarURL = (avatarHash, id, discriminator) => {
    let avatarURL = 'https://cdn.discordapp.com/';
    if (avatarHash) avatarURL += `avatars/${id}/${avatarHash}.${avatarHash.startsWith('a_') ? 'gif' : 'webp'}`;
    else if (hasDiscriminator(discriminator)) avatarURL += `embed/avatars/${discriminator % 5}.png`;
    // Discord picks the default avatar of a unique username from its ID.
    else avatarURL += `embed/avatars/${id ? (BigInt(id) >> 22n) % 6n : 0}.png`;
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
    
    return array.sort((a, b) => object[b] - object[a]).map((word) => ({ word: word, count: object[word] })).slice(0, 2);
};

export const getGitHubContributors = () => {
    return new Promise((resolve, reject) => {
        const cachedExpiresAt = localStorage.getItem('contributors_cache_expires_at');
        const cachedData = localStorage.getItem('contributors_cache');
        if (cachedExpiresAt && (cachedExpiresAt > Date.now()) && cachedData) return resolve(JSON.parse(cachedData));
        axios.get('https://api.github.com/repos/Androz2091/discord-data-package-explorer/contributors')
            .then((response) => {
                const data = response.data.map((user) => ({ username: user.login, avatar: user.avatar_url, url: user.html_url }) );
                localStorage.setItem('contributors_cache', JSON.stringify(data));
                localStorage.setItem('contributors_cache_expires_at', Date.now() + 3600000);
                resolve(data);
            }).catch(() => {
                reject(cachedData || []);
            });
    });
};

/**
 * Generate a file structure dump from the zip files
 * @param files The files from the unzipped package
 * @returns A formatted string representing the file structure
 */
export const generateFileStructureDump = (files) => {
    if (!files || files.length === 0) return 'No files found in package';
    
    // Extract only first-level directories
    const directories = new Set();
    files.forEach(file => {
        const parts = file.name.split('/');
        // Only add the first directory level
        if (parts.length > 1 && parts[0]) {
            directories.add(parts[0]);
        }
    });
    
    // Convert to array and sort
    const sortedDirs = Array.from(directories).sort();
    
    // Format the structure
    let dump = `Total files: ${files.length}\n`;
    dump += `Root directories: ${sortedDirs.length}\n\n`;
    dump += 'Directory structure:\n';
    dump += '```\n';
    
    sortedDirs.forEach(dir => {
        dump += `${dir}/\n`;
    });
    
    dump += '```';
    return dump;
};

/**
 * Generate a GitHub issue URL with pre-filled error information
 * @param errorMessage The error message
 * @param fileStructure The file structure dump
 * @returns The GitHub issue URL
 */
export const generateGitHubIssueURL = (errorMessage, fileStructure) => {
    const repo = 'Androz2091/discord-data-package-explorer';
    const title = encodeURIComponent(`[Auto-Report] Package Processing Error`);
    
    const body = encodeURIComponent(
`**Error Message:**
${errorMessage}

**File Structure:**
${fileStructure}

**Browser:**
${navigator.userAgent}

**Date:**
${new Date().toISOString()}

**Additional Information:**
Please add any additional details about your Discord package that might help us investigate this issue.
`
    );
    
    return `https://github.com/${repo}/issues/new?title=${title}&body=${body}&labels=bug,auto-report`;
};
