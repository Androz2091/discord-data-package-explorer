<script>
    export let rank;
    export let name;
    export let count;
    export let rankColor;
    export let countColor;
</script>

<div class="row">
    <div class="rank" style:color={rankColor}>{rank}</div>
    <slot></slot>
    <div class="name">{name}</div>
    <div class="count" style:color={countColor}>{count}</div>
</div>

<style>
    .row {
        display: flex;
        align-items: center;
        gap: 30px;
        height: 116px;
    }

    .rank {
        flex-shrink: 0;
        width: 64px;
        font-size: 60px;
        font-weight: 900;
        letter-spacing: -0.04em;
        text-align: center;
    }

    .name {
        flex: 1;
        min-width: 0;
        overflow: hidden;
        font-size: 56px;
        font-weight: 700;
        letter-spacing: -0.015em;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .count {
        font-size: 46px;
        font-weight: 700;
        letter-spacing: -0.01em;
    }
</style>
