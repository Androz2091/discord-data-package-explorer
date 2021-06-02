<script>
    export let svg;
    export let strokeWidth = 2;
    export let strokeLinecap = "round";
    export let strokeLinejoin = "round"
    export let count = null;
    export let content = null;
    export let explanation = null;

    const htmlContent = content ?
        content.includes('%') ? content.split('%')[0] + '<span class="text-discord">' + (count ? count.toLocaleString('en-US') : 'N/A') + '</span>' + content.split('%')[1] : content
        : null;
</script>

<div>
    <div class="fun-fact">
        <slot name="svg">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap={strokeLinecap} stroke-linejoin={strokeLinejoin} stroke-width={strokeWidth} d="{ svg }"></path></svg>
        </slot>
        <slot name="content">
            <h3 style="margin-left: 10px;">{ @html htmlContent }</h3>
        </slot>
    </div>
    <slot name="explanation">
        {#if explanation && count}
            <small>{ explanation }</small>
        {:else if !count && content}
            <small>This data is not available as you changed your Discord privacy settings</small>
        {/if}
    </slot>
</div>

<style>
    svg {
        --icon-dimensions: 2.5rem;

        min-height: var(--icon-dimensions);
        max-height: var(--icon-dimensions);
        min-width: var(--icon-dimensions);
        max-width: var(--icon-dimensions);
    }

    .fun-fact {
        display: flex;
        align-items: center;
    }

    @media (max-width: 800px) {
        svg {
            --icon-dimensions: 2rem;
        }
    }
</style>
