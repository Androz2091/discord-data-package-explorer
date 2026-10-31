<script>
    import { fit } from './fit';

    export let value;
    export let label;
    export let valueColor;
    // The value shrinks from this size to fit the tile.
    export let valueSize = 92;
    export let labelSize = 38;
    export let height;
    export let background;
</script>

<div class="tile" style:height="{height}px" style:background>
    <div class="value" style:color={valueColor} use:fit={{ text: value, max: valueSize }}>{value}</div>
    <div class="label" style:font-size="{labelSize}px">{label}</div>
</div>

<style>
    .tile {
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
        min-width: 0;
        padding: 40px 44px;
        border-radius: 44px;
    }

    .value {
        overflow: hidden;
        font-weight: 900;
        line-height: 0.95;
        letter-spacing: -0.04em;
        white-space: nowrap;
    }

    .label {
        margin-top: 14px;
        font-weight: 600;
        line-height: 1.15;
        opacity: 0.85;
    }
</style>
