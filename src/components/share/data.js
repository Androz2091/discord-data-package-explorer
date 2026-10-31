import { generateAvatarURL, getCreatedTimestamp, hasDiscriminator } from '../../app/helpers';

const DAY_MS = 86400000;
const YEAR_MS = 365.25 * DAY_MS;
const TOP = 5;

const numberFormat = new Intl.NumberFormat('en-US');
const hourFormat = new Intl.DateTimeFormat('en-US', { hour: 'numeric' });
const percentFormat = new Intl.NumberFormat('en-US', { style: 'percent' });

export const formatNumber = (value) => numberFormat.format(Math.round(value));
export const formatHour = (hour) => hourFormat.format(new Date(2020, 0, 1, hour));
export const formatPercent = (share) => percentFormat.format(share);
export const plural = (count, one, other) => (count === 1 ? one : other);

/** Seeded PRNG (mulberry32), so a texture comes out the same every time. */
export const rng = (seed) => {
    let a = seed >>> 0;
    return () => {
        a = (a + 0x6d2b79f5) >>> 0;
        let t = Math.imul(a ^ (a >>> 15), a | 1);
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
};

const hash = (text) => {
    let value = 0;
    for (const char of text) value = (value * 31 + char.charCodeAt(0)) >>> 0;
    return value;
};

const GRADIENTS = [
    ['#f472b6', '#7c3aed'],
    ['#38bdf8', '#1d4ed8'],
    ['#34d399', '#0f766e'],
    ['#fbbf24', '#ea580c'],
    ['#a78bfa', '#4338ca'],
    ['#fb7185', '#be123c'],
    ['#22d3ee', '#0e7490'],
    ['#a3e635', '#15803d']
];

/**
 * The backgrounds of the initials shown without a picture: a name keeps its own, unless one above it in the
 * list has it already.
 */
const backgrounds = (names) => {
    const used = new Set();
    return names.map((name) => {
        let index = hash(name) % GRADIENTS.length;
        while (used.has(index) && used.size < GRADIENTS.length) index = (index + 1) % GRADIENTS.length;
        used.add(index);
        const [from, to] = GRADIENTS[index];
        return `linear-gradient(135deg, ${from}, ${to})`;
    });
};

const withBackgrounds = (items) => {
    const list = backgrounds(items.map((item) => item.name));
    return items.map((item, i) => ({ ...item, background: list[i] }));
};

export const initials = (name) => {
    const segmenter = typeof Intl.Segmenter === 'function' ? new Intl.Segmenter(undefined, { granularity: 'grapheme' }) : null;
    return name
        .split(/\s+/)
        .filter(Boolean)
        .map((word) => (segmenter ? segmenter.segment(word)[Symbol.iterator]().next().value.segment : [...word][0]))
        .slice(0, 2)
        .join('')
        .toUpperCase();
};

// Discord's CDN serves any avatar as a PNG at a power-of-two size, which every browser draws into a card.
const avatarPNG = (url, size) => `${url.replace(/\.(webp|gif)$/, '.png')}?size=${size}`;

/** The counts of the habits card, in the order the card prefers them. */
export const HABITS = [
    { key: 'openCount', one: 'app open', other: 'app opens' },
    { key: 'addReactionCount', one: 'reaction added', other: 'reactions added' },
    { key: 'notificationCount', one: 'notification clicked', other: 'notifications clicked' },
    { key: 'joinVoiceChannelCount', one: 'voice channel joined', other: 'voice channels joined' },
    { key: 'messageEditedCount', one: 'message edited', other: 'messages edited' },
    { key: 'slashCommandUsedCount', one: 'slash command', other: 'slash commands' },
    { key: 'joinCallCount', one: 'call in DMs', other: 'calls in DMs' }
];
const HABITS_SHOWN = 6;

/**
 * The habits worth a tile, and which of the first six the package doesn't carry. A count is missing when
 * the package has no activity file, or only `reporting`, which never carries some events; a 0 is known, but
 * not worth sharing.
 */
export const habitTiles = (card) => ({
    shown: card.habits.filter((habit) => habit.count > 0).slice(0, HABITS_SHOWN),
    missing: card.habits.slice(0, HABITS_SHOWN).filter((habit) => habit.count === undefined || habit.count === null)
});

/** The one-to-one DMs of the people card, before their names are looked up. */
export const topPeople = (data) => (data.topDMs || []).filter((dm) => !dm.isGroupDM).slice(0, TOP);

/**
 * What the share cards show, from the data the stats page shows. Avatars are URLs here: the sheet swaps
 * them for images it could read, or initials.
 */
export const shareData = (data) => {
    const { user } = data;
    const created = getCreatedTimestamp(user.id);
    const years = Object.entries(data.messageCountPerYear || {}).map(([year, count]) => ({ year, count }));
    const inPackage = years.reduce((sum, year) => sum + year.count, 0);
    // The stats page's count, from the activity file, or the messages in the package without one.
    const total = data.sentMessageCount || inPackage;
    const perDay = total === data.sentMessageCount ? data.averageMessageCountPerDay : Math.floor(total / ((Date.now() - created) / DAY_MS));
    const people = topPeople(data).map((dm) => {
        const person = dm.userData || {};
        return {
            name: person.global_name || person.username || 'Unknown',
            count: dm.messageCount,
            avatar: person.id ? avatarPNG(generateAvatarURL(person.avatar, person.id, person.discriminator), 256) : null,
            known: Boolean(person.id)
        };
    });
    const hours = data.hoursValues || [];
    const peak = Math.max(0, ...hours);
    const name = user.global_name || user.username;
    return {
        seed: hash(user.id),
        user: {
            name,
            handle: hasDiscriminator(user.discriminator) ? `${user.username}#${String(user.discriminator).padStart(4, '0')}` : `@${user.username}`,
            avatar: avatarPNG(generateAvatarURL(user.avatar_hash, user.id, user.discriminator), 512),
            background: backgrounds([name])[0]
        },
        years: Math.floor((Date.now() - created) / YEAR_MS),
        since: new Date(created).getUTCFullYear(),
        messages: { total, perDay, years },
        // Names whose lookups all failed would only say "Unknown".
        people: people.some((person) => person.known) ? withBackgrounds(people) : [],
        servers: withBackgrounds((data.topGuilds || []).slice(0, TOP).map((guild) => ({ name: guild.name, count: guild.messageCount }))),
        hours,
        peakHour: peak > 0 ? hours.indexOf(peak) : null,
        words: (data.favoriteWords || []).slice(0, TOP),
        habits: HABITS.map((habit) => ({ ...habit, count: data[habit.key] })),
        dmCount: data.dmChannelCount,
        serverCount: data.guildCount
    };
};

/** The summary's stats, in order: the story card shows four, the square one three. */
export const summaryStats = (card) => [
    card.messages.total > 0 && { key: 'messages', value: formatNumber(card.messages.total), label: 'messages sent', short: 'messages' },
    card.peakHour !== null && { key: 'peakHour', value: formatHour(card.peakHour), label: 'peak hour', short: 'peak hour' },
    card.dmCount > 0 && { key: 'people', value: formatNumber(card.dmCount), label: 'people in your DMs', short: 'people in your DMs' },
    card.serverCount > 0 && { key: 'servers', value: formatNumber(card.serverCount), label: 'servers joined', short: 'servers joined' },
    card.habits[0].count > 0 && { key: 'appOpens', value: formatNumber(card.habits[0].count), label: 'app opens', short: 'app opens' }
].filter(Boolean);

/**
 * Every card in the order the sheet shows them, with the rule that leaves one out when the package has too
 * little for it. `file` names the downloaded image.
 */
export const CARDS = [
    { kind: 'cover', label: 'Cover', file: 'cover', shown: () => true },
    { kind: 'messages', label: 'Messages', file: 'messages', shown: (card) => card.messages.total > 0 },
    { kind: 'people', label: 'Top DMs', file: 'top-dms', shown: (card) => card.people.length >= 3 },
    { kind: 'servers', label: 'Top servers', file: 'top-servers', shown: (card) => card.servers.length >= 3 },
    { kind: 'peakHour', label: 'Peak hour', file: 'peak-hour', shown: (card) => card.peakHour !== null },
    { kind: 'words', label: 'Top words', file: 'top-words', shown: (card) => card.words.length >= 3 },
    { kind: 'habits', label: 'Little habits', file: 'habits', shown: (card) => habitTiles(card).shown.length >= 2 },
    { kind: 'summary', label: 'Summary', file: 'summary', shown: () => true },
    { kind: 'summarySquare', label: 'Square summary', file: 'summary-square', square: true, shown: () => true }
];
