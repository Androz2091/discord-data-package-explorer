import { domToBlob } from 'modern-screenshot';
import rubik from '@fontsource-variable/rubik/wght.css?inline';

export const STORY = { width: 1080, height: 1920 };
export const SQUARE = { width: 1080, height: 1080 };

const dataURL = (blob) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(blob);
});

/** Adds the cards' font, under its own name so the page keeps its Rubik, and waits for its Latin letters. */
export const loadFont = () => {
    if (!document.getElementById('share-font')) {
        const style = document.createElement('style');
        style.id = 'share-font';
        style.textContent = rubik;
        document.head.append(style);
    }
    return document.fonts.load('900 16px "Rubik Variable"').catch(() => {});
};

const FACES = rubik.match(/@font-face\s*{[^}]*}/g);

// `U+0000-00FF`, `U+0131` or, once minified, `U+4??`.
const ranges = (face) => face.match(/unicode-range:([^;}]*)/i)[1].split(',').map((range) => {
    const [from, to] = range.trim().replace(/^u\+/i, '').split('-');
    return to ? [parseInt(from, 16), parseInt(to, 16)] : [parseInt(from.replace(/\?/g, '0'), 16), parseInt(from.replace(/\?/g, 'f'), 16)];
});

const covers = (face, text) => {
    const faceRanges = ranges(face);
    for (const char of text) {
        const code = char.codePointAt(0);
        if (faceRanges.some(([from, to]) => code >= from && code <= to)) return true;
    }
    return false;
};

const fonts = new Map();

// A card is drawn through an SVG image, which loads nothing itself: the font goes in as data, with only the
// subsets the card's text uses.
const fontCSS = (text) => Promise.all(FACES.filter((face) => covers(face, text)).map(async (face) => {
    const url = face.match(/url\((['"]?)([^'")]+)\1\)/)[2];
    if (!fonts.has(url)) {
        fonts.set(url, fetch(url).then((response) => response.blob()).then(dataURL).catch((error) => {
            fonts.delete(url);
            throw error;
        }));
    }
    return face.replace(url, await fonts.get(url));
})).then((faces) => faces.join('\n'));

const images = new Map();

/**
 * An avatar as data, so drawing the card reads no other site, or `null` when the browser can't read it,
 * for eg. without CORS, and the card shows initials instead.
 */
export const loadImage = (url) => {
    if (!url) return Promise.resolve(null);
    if (!images.has(url)) {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), 8000);
        images.set(url, fetch(url, { signal: controller.signal })
            .then((response) => (response.ok ? response.blob() : null))
            .then((blob) => (blob && blob.type.startsWith('image/') ? dataURL(blob) : null))
            .catch(() => null)
            .then((image) => {
                clearTimeout(timer);
                // Opening the sheet again tries again.
                if (!image) images.delete(url);
                return image;
            }));
    }
    return images.get(url);
};

const nextFrame = () => new Promise((resolve) => requestAnimationFrame(() => resolve()));

/**
 * Draws a card into a PNG with `modern-screenshot`, which has the browser paint the card's DOM into an SVG
 * `<foreignObject>`, then a canvas, so the image comes out as the preview looks.
 */
export const capture = async (node, { width, height }) => {
    await document.fonts.ready;
    await Promise.all([...node.querySelectorAll('img')].map((image) => image.decode().catch(() => {})));
    await nextFrame();
    return domToBlob(node, {
        width,
        height,
        scale: 1,
        type: 'image/png',
        // WebKit can draw the SVG image before it has decoded the pictures in it, and leave them out: drawing
        // again after this many ms puts them back.
        drawImageInterval: 100,
        timeout: 10000,
        font: { cssText: await fontCSS(node.textContent) }
    });
};

export const canShareFiles = () => {
    if (typeof navigator.share !== 'function' || typeof navigator.canShare !== 'function') return false;
    try {
        return navigator.canShare({ files: [new File([], 'card.png', { type: 'image/png' })] });
    } catch {
        return false;
    }
};

export const download = (blob, name) => {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = name;
    link.style.display = 'none';
    document.body.append(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 60000);
};
