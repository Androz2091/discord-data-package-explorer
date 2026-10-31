<script>
    import { rng } from './data';

    export let seed;
    export let color = '#fff';
    export let max = 0.12;
    // Lit towards the top (`down`) or the bottom (`up`).
    export let fade = 'down';
    export let height = 1920;

    const WIDTH = 1080;
    const SIZE = 180;

    const draw = () => {
        const random = rng(seed);
        const h = (SIZE * Math.sqrt(3)) / 2;
        const polygons = [];
        for (let row = -1; row * h < height + h; row++) {
            for (let col = -1; col * SIZE < WIDTH + SIZE; col++) {
                const x = col * SIZE + (row % 2 ? SIZE / 2 : 0);
                const y = row * h;
                const t = fade === 'down' ? 1 - y / height : y / height;
                for (const up of [true, false]) {
                    if (random() > 0.55) continue;
                    const opacity = (random() * max * Math.max(0, t)).toFixed(3);
                    if (Number(opacity) < 0.006) continue;
                    polygons.push({
                        points: up ? `${x},${y + h} ${x + SIZE / 2},${y} ${x + SIZE},${y + h}` : `${x + SIZE / 2},${y} ${x + SIZE * 1.5},${y} ${x + SIZE},${y + h}`,
                        opacity
                    });
                }
            }
        }
        return polygons;
    };

    const polygons = draw();
</script>

<svg viewBox="0 0 {WIDTH} {height}" preserveAspectRatio="none" aria-hidden="true">
    {#each polygons as polygon}
        <polygon points={polygon.points} fill={color} fill-opacity={polygon.opacity} />
    {/each}
</svg>

<style>
    svg {
        position: absolute;
        inset: 0;
        display: block;
        width: 100%;
        height: 100%;
        pointer-events: none;
    }
</style>
