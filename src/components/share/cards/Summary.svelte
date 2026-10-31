<script>
    import Frame from '../Frame.svelte';
    import Facets from '../Facets.svelte';
    import Avatar from '../Avatar.svelte';
    import Tile from '../Tile.svelte';
    import { fit } from '../fit';
    import { summaryStats } from '../data';

    export let data;
    // The 1080 x 1080 card, with three stats in a row.
    export let square = false;

    const COLORS = ['#7dd3fc', '#fde047', '#fda4af', '#6ee7b7'];
    const stats = summaryStats(data).slice(0, square ? 3 : 4);
    const columns = [
        { title: 'Top DMs', color: '#7dd3fc', picture: 'person', rows: data.people.slice(0, 3) },
        { title: 'Top servers', color: '#6ee7b7', picture: 'server', rows: data.servers.slice(0, 3) }
    ].filter((column) => column.rows.length);
</script>

<Frame
    {square}
    background={square
        ? 'radial-gradient(90% 60% at 100% 0%, rgba(14, 165, 233, 0.5) 0%, rgba(2, 6, 23, 0) 70%), #020617'
        : 'radial-gradient(100% 40% at 50% 0%, rgba(14, 165, 233, 0.45) 0%, rgba(2, 6, 23, 0) 80%), #020617'}
>
    <svelte:fragment slot="texture">
        <Facets seed={data.seed ^ (square ? 37 : 31)} color="#38bdf8" max={0.12} height={square ? 1080 : 1920} />
    </svelte:fragment>
    <div class="header" class:square>
        <Avatar src={data.user.avatar} name={data.user.name} background={data.user.background} size={square ? 150 : 190} ring="0 0 0 {square ? 7 : 8}px rgba(255, 255, 255, 0.92)" />
        <div class="who">
            <div class="eyebrow">Lifetime recap</div>
            <div class="name" use:fit={{ text: data.user.name, max: square ? 96 : 112, min: square ? 56 : 64 }}>{data.user.name}</div>
        </div>
    </div>
    {#if square}
        <div class="stats">
            {#each stats as stat, i}
                <div class="stat">
                    <div class="value" style:color={COLORS[i]} use:fit={{ text: stat.value, max: 60 }}>{stat.value}</div>
                    <div class="short">{stat.short}</div>
                </div>
            {/each}
        </div>
    {:else}
        <div class="tiles">
            {#each stats as stat, i}
                <Tile value={stat.value} label={stat.label} valueColor={COLORS[i]} valueSize={84} labelSize={36} height={236} background="rgba(255, 255, 255, 0.07)" />
            {/each}
        </div>
    {/if}
    <div class="lists" class:square>
        {#each columns as column}
            <div class="list">
                <div class="title">{column.title}</div>
                {#each column.rows as row, i}
                    <div class="row">
                        <span class="rank" style:color={column.color}>{i + 1}</span>
                        <Avatar src={column.picture === 'person' ? row.avatar : null} name={row.name} background={row.background} size={square ? 64 : 88} server={column.picture === 'server'} />
                        {#if square}
                            <span class="row-name">{row.name}</span>
                        {:else if /\s/.test(row.name.trim())}
                            <span class="row-name two-lines">{row.name}</span>
                        {:else}
                            <!-- A one-word name would break mid-word: it shrinks instead, then ends in an ellipsis. -->
                            <span class="row-name" use:fit={{ text: row.name, max: 40, min: 28 }}>{row.name}</span>
                        {/if}
                    </div>
                {/each}
            </div>
        {/each}
    </div>
</Frame>

<style>
    .header {
        display: flex;
        align-items: center;
        gap: 40px;
    }

    .header.square {
        gap: 34px;
    }

    .who {
        flex: 1;
        min-width: 0;
    }

    .eyebrow {
        color: #7dd3fc;
        font-size: 40px;
        font-weight: 700;
        letter-spacing: 0.12em;
        text-transform: uppercase;
    }

    .square .eyebrow {
        font-size: 32px;
    }

    .name {
        margin-top: 10px;
        overflow: hidden;
        font-weight: 900;
        line-height: 1;
        letter-spacing: -0.04em;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .square .name {
        margin-top: 6px;
    }

    .tiles {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 28px;
        margin-top: 72px;
    }

    .stats {
        display: flex;
        gap: 36px;
        margin-top: 64px;
    }

    .stat {
        flex: 1;
        min-width: 0;
    }

    .value {
        overflow: hidden;
        font-weight: 900;
        line-height: 1;
        letter-spacing: -0.04em;
        white-space: nowrap;
    }

    .short {
        margin-top: 10px;
        color: #cbd5e1;
        font-size: 30px;
        font-weight: 600;
    }

    .lists {
        display: flex;
        gap: 36px;
        margin-top: 84px;
    }

    .lists.square {
        gap: 40px;
        margin-top: 64px;
    }

    .list {
        flex: 1;
        min-width: 0;
    }

    .title {
        color: #94a3b8;
        font-size: 36px;
        font-weight: 700;
        letter-spacing: 0.12em;
        text-transform: uppercase;
    }

    .square .title {
        font-size: 30px;
    }

    .row {
        display: flex;
        align-items: center;
        gap: 22px;
        margin-top: 26px;
    }

    .square .row {
        gap: 20px;
        margin-top: 22px;
    }

    .rank {
        flex-shrink: 0;
        width: 34px;
        font-size: 44px;
        font-weight: 900;
    }

    .square .rank {
        width: 30px;
        font-size: 34px;
    }

    .row-name {
        flex: 1;
        min-width: 0;
        overflow: hidden;
        font-size: 40px;
        font-weight: 700;
        line-height: 1.08;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .square .row-name {
        font-size: 38px;
        line-height: normal;
    }

    .two-lines {
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        line-clamp: 2;
        overflow-wrap: anywhere;
        white-space: normal;
    }
</style>
