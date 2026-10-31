<script>
    import Frame from '../Frame.svelte';
    import Facets from '../Facets.svelte';
    import Eyebrow from '../Eyebrow.svelte';
    import Tile from '../Tile.svelte';
    import { HABITS, formatNumber, habitTiles, plural } from '../data';

    export let data;

    const COLORS = ['#7dd3fc', '#fda4af', '#fde047', '#6ee7b7'];
    const { shown, missing } = habitTiles(data);
    const color = (habit) => COLORS[HABITS.findIndex((candidate) => candidate.key === habit.key) % COLORS.length];
</script>

<Frame background="radial-gradient(90% 50% at 90% 10%, rgba(56, 189, 248, 0.28) 0%, rgba(2, 6, 23, 0) 70%), #0f172a">
    <svelte:fragment slot="texture">
        <Facets seed={data.seed ^ 29} color="#7dd3fc" max={0.08} />
    </svelte:fragment>
    <Eyebrow text="Little habits" color="#7dd3fc" />
    <div class="headline">The small stuff</div>
    <div class="tiles">
        {#each shown as habit}
            <Tile value={formatNumber(habit.count)} label={plural(habit.count, habit.one, habit.other)} valueColor={color(habit)} height={282} background="rgba(255, 255, 255, 0.08)" />
        {/each}
    </div>
    {#if missing.length}
        <div class="missing">
            <svg viewBox="0 0 24 24" aria-hidden="true">
                <circle cx="12" cy="12" r="9.5" />
                <line x1="12" y1="7.5" x2="12" y2="13" />
                <line x1="12" y1="16.4" x2="12" y2="16.5" />
            </svg>
            <div>
                <div class="title">Not in your package</div>
                <div class="list">{missing.map((habit) => habit.other).join(' · ')}. Discord left these out, so DDPE can't count them.</div>
            </div>
        </div>
    {/if}
</Frame>

<style>
    .headline {
        margin-top: 36px;
        font-size: 112px;
        font-weight: 900;
        line-height: 0.95;
        letter-spacing: -0.03em;
    }

    .tiles {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 28px;
        margin-top: 72px;
    }

    .missing {
        display: flex;
        align-items: flex-start;
        gap: 26px;
        margin-top: 40px;
        padding: 34px 40px;
        border: 4px dashed rgba(148, 163, 184, 0.5);
        border-radius: 40px;
        color: #cbd5e1;
    }

    svg {
        flex-shrink: 0;
        width: 52px;
        height: 52px;
        margin-top: 4px;
        fill: none;
        stroke: #94a3b8;
        stroke-width: 2;
        stroke-linecap: round;
    }

    .title {
        color: #fff;
        font-size: 40px;
        font-weight: 800;
    }

    .list {
        margin-top: 10px;
        font-size: 36px;
        font-weight: 500;
        line-height: 1.3;
    }
</style>
