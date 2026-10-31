<script>
    import Frame from '../Frame.svelte';
    import Facets from '../Facets.svelte';
    import Eyebrow from '../Eyebrow.svelte';
    import { fit } from '../fit';
    import { formatNumber, plural } from '../data';

    export let data;

    const { total, perDay, years } = data.messages;
    const max = Math.max(0, ...years.map((year) => year.count));
    const peak = max > 0 ? years.findIndex((year) => year.count === max) : -1;
</script>

<Frame background="radial-gradient(90% 55% at 20% 32%, rgba(14, 165, 233, 0.55) 0%, rgba(2, 6, 23, 0) 70%), #020617">
    <svelte:fragment slot="texture">
        <Facets seed={data.seed ^ 7} color="#38bdf8" max={0.1} fade="up" />
    </svelte:fragment>
    <Eyebrow text="Messages sent" color="#7dd3fc" />
    <div class="total" use:fit={{ text: formatNumber(total), max: 300, min: 80 }}>{formatNumber(total)}</div>
    <div class="unit">{plural(total, 'message', 'messages')}</div>
    {#if perDay >= 1}
        <div class="per-day">That's <b>{formatNumber(perDay)} a day</b>, every day since {data.since}.</div>
    {/if}
    <!-- One bar per year: a single one would only fill the chart. -->
    {#if years.length > 1 && peak !== -1}
        <div class="chart">
            {#each years as year, i}
                <div class="bar" class:peak={i === peak} style:height="{Math.max(3, (year.count / max) * 100)}%"></div>
            {/each}
        </div>
        <div class="axis">
            <span>{years[0].year}</span>
            <span class="busiest">Busiest: {years[peak].year}</span>
            <span>{years[years.length - 1].year}</span>
        </div>
    {/if}
</Frame>

<style>
    .total {
        margin-top: 120px;
        overflow: hidden;
        font-weight: 900;
        line-height: 0.82;
        letter-spacing: -0.05em;
        white-space: nowrap;
    }

    .unit {
        margin-top: 10px;
        color: #7dd3fc;
        font-size: 120px;
        font-weight: 900;
        letter-spacing: -0.035em;
    }

    .per-day {
        max-width: 880px;
        margin-top: 56px;
        color: #cbd5e1;
        font-size: 50px;
        font-weight: 500;
        line-height: 1.25;
        letter-spacing: -0.005em;
    }

    .per-day b {
        color: #fff;
        font-weight: 800;
    }

    .chart {
        display: flex;
        align-items: flex-end;
        gap: 18px;
        height: 330px;
        margin-top: 110px;
    }

    .bar {
        flex: 1;
        min-width: 0;
        border-radius: 12px 12px 4px 4px;
        background: rgba(56, 189, 248, 0.32);
    }

    .bar.peak {
        background: #7dd3fc;
    }

    .axis {
        display: flex;
        justify-content: space-between;
        gap: 24px;
        margin-top: 22px;
        color: #94a3b8;
        font-size: 34px;
        font-weight: 600;
        white-space: nowrap;
    }

    .busiest {
        color: #7dd3fc;
    }
</style>
