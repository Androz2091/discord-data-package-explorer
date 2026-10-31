<script>
    import Frame from '../Frame.svelte';
    import Eyebrow from '../Eyebrow.svelte';
    import { fit } from '../fit';
    import { formatHour, formatPercent, rng } from '../data';

    export let data;

    // Each headline covers a part of the day: [first hour, hour after the last].
    const PERIODS = [
        { headline: 'You\'re a night owl', from: 21, to: 4 },
        { headline: 'You\'re an early bird', from: 4, to: 10 },
        { headline: 'You text by daylight', from: 10, to: 17 },
        { headline: 'You\'re an evening chatter', from: 17, to: 21 }
    ];
    const inPeriod = (hour, { from, to }) => (from < to ? hour >= from && hour < to : hour >= from || hour < to);

    const CENTER = 452;
    const INNER = 252;
    const OUTER = 446;
    const polar = (hour, radius) => {
        const angle = ((hour / 24) * 360 - 90) * (Math.PI / 180);
        return [CENTER + Math.cos(angle) * radius, CENTER + Math.sin(angle) * radius];
    };

    const { hours, peakHour: peak } = data;
    const max = Math.max(1, ...hours);
    const total = hours.reduce((sum, count) => sum + count, 0);
    const period = PERIODS.find((candidate) => inPeriod(peak, candidate));
    const periodCount = hours.reduce((sum, count, hour) => (inPeriod(hour, period) ? sum + count : sum), 0);
    const bars = hours.map((count, hour) => [...polar(hour, INNER + 22), ...polar(hour, INNER + 26 + (count / max) * (OUTER - INNER - 40))]);

    const random = rng(data.seed ^ 5);
    const stars = Array.from({ length: 70 }, () => ({
        x: (random() * 1080).toFixed(0),
        y: (random() * 1300).toFixed(0),
        r: (1 + random() * 2.6).toFixed(1),
        opacity: (0.15 + random() * 0.5).toFixed(2)
    }));
</script>

<Frame background="radial-gradient(80% 45% at 50% 30%, rgba(12, 74, 110, 0.9) 0%, rgba(2, 6, 23, 0) 75%), #020617">
    <svg slot="texture" class="stars" viewBox="0 0 1080 1920" width="1080" height="1920" aria-hidden="true">
        {#each stars as star}
            <circle cx={star.x} cy={star.y} r={star.r} fill="#fff" fill-opacity={star.opacity} />
        {/each}
    </svg>
    <Eyebrow text="Peak hour" color="#fde047" />
    <div class="clock">
        <svg viewBox="0 0 904 904" width="904" height="904" aria-hidden="true">
            <circle cx={CENTER} cy={CENTER} r={INNER} fill="rgba(2, 6, 23, 0.55)" stroke="rgba(148, 163, 184, 0.25)" stroke-width="3" />
            {#each bars as [x1, y1, x2, y2], hour}
                <line {x1} {y1} {x2} {y2} stroke={hour === peak ? '#fde047' : 'rgba(148, 163, 184, 0.42)'} stroke-width="22" stroke-linecap="round" />
            {/each}
            {#each [0, 6, 12, 18] as hour}
                <text x={polar(hour, INNER - 46)[0]} y={polar(hour, INNER - 46)[1] + 10} text-anchor="middle" font-size="28" font-weight="700" fill="#64748b">{formatHour(hour)}</text>
            {/each}
        </svg>
        <div class="peak">
            <!-- Narrower than the gap between the 6 and 18 o'clock labels. -->
            <div class="hour" use:fit={{ text: formatHour(peak), max: 112 }}>{formatHour(peak)}</div>
            <div class="caption">your busiest hour</div>
        </div>
    </div>
    <div class="headline">{period.headline}</div>
    <div class="share">
        <b>{formatPercent(total ? periodCount / total : 0)}</b> of your messages go out between {formatHour(period.from)} and {formatHour(period.to)}.
    </div>
</Frame>

<style>
    .stars {
        position: absolute;
        inset: 0;
        pointer-events: none;
    }

    .clock {
        position: relative;
        flex-shrink: 0;
        width: 904px;
        height: 904px;
        margin-top: 44px;
    }

    .clock svg {
        display: block;
    }

    .peak {
        position: absolute;
        inset: 0;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }

    .hour {
        max-width: 288px;
        overflow: hidden;
        color: #fde047;
        font-weight: 900;
        line-height: 1;
        letter-spacing: -0.04em;
        white-space: nowrap;
    }

    .caption {
        margin-top: 12px;
        color: #94a3b8;
        font-size: 34px;
        font-weight: 600;
    }

    .headline {
        margin-top: 44px;
        font-size: 104px;
        font-weight: 900;
        line-height: 0.95;
        letter-spacing: -0.03em;
    }

    .share {
        margin-top: 36px;
        color: #cbd5e1;
        font-size: 46px;
        font-weight: 500;
        line-height: 1.25;
        letter-spacing: -0.005em;
    }

    .share b {
        color: #fff;
        font-weight: 800;
    }
</style>
