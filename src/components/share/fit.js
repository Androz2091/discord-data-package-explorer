/**
 * Shrinks a one-line text from `max` px, 4 px at a time, until it fits its box or reaches `min`. Measures
 * layout sizes, which the preview's `transform: scale()` doesn't change.
 */
export const fit = (node, params) => {
    let cancelled = false;
    const run = () => {
        const { max, min = Math.round(max / 2) } = params;
        let size = max;
        node.style.fontSize = `${size}px`;
        while (node.scrollWidth > node.clientWidth && size > min) {
            size = Math.max(min, size - 4);
            node.style.fontSize = `${size}px`;
        }
    };
    run();
    // A width measured with the fallback font is wrong once Rubik loads.
    document.fonts.ready.then(() => !cancelled && run());
    return {
        update(next) {
            params = next;
            run();
        },
        destroy() {
            cancelled = true;
        }
    };
};
