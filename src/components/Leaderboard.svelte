<script>
    export let title;
    export let description;
    export let more = null;
</script>

<div>
    <h1>{title}</h1>
    <p>{description}</p>
    <div>
        <slot></slot>
    </div>
    {#if more}
        <button class="more" on:click={more}>Show more</button>
    {/if}
</div>

<style>
    .more {
        margin-top: 10px;
        width: 100%;
        padding: 0.75rem;
        color: white;
        font-weight: 600;
        cursor: pointer;
        border: none;
        border-radius: 5px;
        background-color: #7289da;
    }
</style>
