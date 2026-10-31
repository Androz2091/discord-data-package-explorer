<script>
    export let text;
    export let color = null;
</script>

<div class="eyebrow" style:color>
    <span></span>
    {text}
</div>

<style>
    .eyebrow {
        display: flex;
        align-items: center;
        gap: 20px;
        font-size: 40px;
        font-weight: 700;
        letter-spacing: 0.14em;
        text-transform: uppercase;
    }

    span {
        flex-shrink: 0;
        width: 56px;
        height: 8px;
        border-radius: 4px;
        background: currentColor;
    }
</style>
