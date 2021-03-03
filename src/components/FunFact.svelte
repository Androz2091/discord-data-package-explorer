<script>
    export let svg;
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
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="{ svg }"></path></svg>
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
        height: 40px;
    }
    .fun-fact {
        display: flex;
        align-items: center;
    }
</style>
