<script>
    import Frame from '../Frame.svelte';
    import Facets from '../Facets.svelte';
    import Eyebrow from '../Eyebrow.svelte';
    import Avatar from '../Avatar.svelte';
    import Row from '../Row.svelte';
    import { fit } from '../fit';
    import { formatNumber, plural } from '../data';

    export let seed;
    export let background;
    export let eyebrow;
    export let headline;
    // `{ name, count, avatar, background }`, the first one shown large.
    export let items;
    // Avatars (`person`), initials in a rounded square (`server`), or no picture.
    export let picture = null;
    export let unit = ['message', 'messages'];
    // The light shades of the card's color: eyebrow and counts, ranks, and the first one's badge.
    export let light;
    export let pale;
    export let dark;
    export let texture = 0.13;

    const [first, ...rest] = items;
    const ring = '0 0 0 12px rgba(255, 255, 255, 0.92), 0 30px 80px rgba(2, 6, 23, 0.45)';
</script>

<Frame {background}>
    <svelte:fragment slot="texture">
        <Facets {seed} max={texture} />
    </svelte:fragment>
    <Eyebrow text={eyebrow} color={light} />
    <div class="headline">{headline}</div>
    <div class="first">
        {#if picture}
            <div class="picture" class:server={picture === 'server'}>
                <Avatar src={first.avatar} name={first.name} background={first.background} size={280} server={picture === 'server'} {ring} />
                <div class="badge" style:color={dark}>1</div>
            </div>
            <div class="who">
                <div class="name">{first.name}</div>
                <div class="count" style:color={light}>{formatNumber(first.count)} {plural(first.count, ...unit)}</div>
            </div>
        {:else}
            <div class="who">
                <div class="name quoted" use:fit={{ text: first.name, max: 150, min: 80 }}>“{first.name}”</div>
                <div class="count" style:color={light}>{formatNumber(first.count)} {plural(first.count, ...unit)}</div>
            </div>
        {/if}
    </div>
    <div class="rows">
        {#each rest as item, i}
            <Row rank={i + 2} name={item.name} count={formatNumber(item.count)} rankColor={pale} countColor={light}>
                {#if picture}
                    <Avatar src={item.avatar} name={item.name} background={item.background} size={116} server={picture === 'server'} />
                {/if}
            </Row>
        {/each}
    </div>
</Frame>

<style>
    .headline {
        margin-top: 36px;
        font-size: 112px;
        font-weight: 900;
        line-height: 0.95;
        letter-spacing: -0.03em;
    }

    .first {
        display: flex;
        align-items: center;
        gap: 52px;
        margin-top: 84px;
    }

    .picture {
        position: relative;
        flex-shrink: 0;
    }

    .badge {
        position: absolute;
        right: -18px;
        bottom: -14px;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 104px;
        height: 104px;
        border-radius: 50%;
        background: #fff;
        font-size: 62px;
        font-weight: 900;
    }

    .server .badge {
        right: -22px;
        bottom: -22px;
    }

    .who {
        flex: 1;
        min-width: 0;
    }

    .name {
        overflow: hidden;
        font-size: 104px;
        font-weight: 900;
        line-height: 1;
        letter-spacing: -0.035em;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .server + .who .name {
        font-size: 96px;
    }

    .count {
        margin-top: 16px;
        font-size: 50px;
        font-weight: 700;
    }

    .quoted + .count {
        margin-top: 28px;
    }

    .rows {
        display: flex;
        flex-direction: column;
        gap: 26px;
        margin-top: 96px;
    }
</style>
