export const generateAvatarURL = (avatarHash, id, discriminator) => {
    let avatarURL = 'https://cdn.discordapp.com/';
    if (avatarHash) avatarURL += `avatars/${id}/${avatarHash}.webp`;
    else avatarURL += `embed/avatars/${discriminator % 5}.png`;
    return avatarURL;
};
