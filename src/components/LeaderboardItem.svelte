<script>
    export let name;
    export let discriminator = null;
    export let guild = null;
    export let position;
    export let avatarURL = null;
    export let count;
    export let word;
    import SvelteTooltip from 'svelte-tooltip'
    export let channel = false;
</script>

<div class="top-item">
    <div class="top-whois">
        <div class="top-bubble { position === 0 ? 'first' : position === 1 ? 'second' : position === 2 ? 'third' : '' }">{ position + 1 }</div>
        {#if channel}
            <svg class="top-avatar" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="square" stroke-linejoin="square" stroke-width={1} d="M5.88657 21C5.57547 21 5.3399 20.7189 5.39427 20.4126L6.00001 17H2.59511C2.28449 17 2.04905 16.7198 2.10259 16.4138L2.27759 15.4138C2.31946 15.1746 2.52722 15 2.77011 15H6.35001L7.41001 9H4.00511C3.69449 9 3.45905 8.71977 3.51259 8.41381L3.68759 7.41381C3.72946 7.17456 3.93722 7 4.18011 7H7.76001L8.39677 3.41262C8.43914 3.17391 8.64664 3 8.88907 3H9.87344C10.1845 3 10.4201 3.28107 10.3657 3.58738L9.76001 7H15.76L16.3968 3.41262C16.4391 3.17391 16.6466 3 16.8891 3H17.8734C18.1845 3 18.4201 3.28107 18.3657 3.58738L17.76 7H21.1649C21.4755 7 21.711 7.28023 21.6574 7.58619L21.4824 8.58619C21.4406 8.82544 21.2328 9 20.9899 9H17.41L16.35 15H19.7549C20.0655 15 20.301 15.2802 20.2474 15.5862L20.0724 16.5862C20.0306 16.8254 19.8228 17 19.5799 17H16L15.3632 20.5874C15.3209 20.8261 15.1134 21 14.8709 21H13.8866C13.5755 21 13.3399 20.7189 13.3943 20.4126L14 17H8.00001L7.36325 20.5874C7.32088 20.8261 7.11337 21 6.87094 21H5.88657ZM9.41045 9L8.35045 15H14.3504L15.4104 9H9.41045Z"></path></svg>
        {:else}
            <img class="top-avatar" src="{avatarURL}" alt="Avatar" />
        {/if}
        <h3 class="top-name">{name} <small class="text-muted channel">{channel ? guild : `#${discriminator}`}</small></h3>
    </div>
    <div class="top-messages">
        <h3>{count} <small>messages</small></h3>
        <h3><span class="text-discord"><SvelteTooltip tip="Utilisé {word[0].count} fois" bottom color="#000000">{word[0].word}</SvelteTooltip></span> et <span class="text-discord"><SvelteTooltip tip="Utilisé {word[1].count} fois" bottom color="#000000">{word[1].word}</SvelteTooltip></span> favoris</h3>
    </div>
</div>

<style>
    .text-muted {
        color: #6c757d;
    }
    .text-muted.channel {
        white-space: nowrap;
    }
    .top-item {
        display: flex;
        flex-direction: row;
        border-bottom: 1px solid white;
        align-items: center;
        justify-content: space-between;
    }
    .top-whois {
        padding: 8px;
        align-items: center;
        display: flex;
        min-width: 0;
        width: 100%;
    }
    .top-item:last-child {
        border-bottom: 0;
    }
    .top-avatar {
        border-radius: 50%;
        height: 50px;
        margin-right: 10px;
        flex-shrink: 0;
    }
    .top-name {
        margin-left: inherit;
        display: flex;
        flex-direction: column;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
    .top-messages {
        flex-shrink: 0;
    }
    .top-bubble {
        align-items: center;
        justify-content: center;
        display: flex;
        flex: 0 0 35px;
        height: 35px;
        background-color: #50555a;
        border-radius: 50%;
        margin-right: 10px;
    }
    .top-bubble.first {
        background-color: #da9e3b;
    }
    .top-bubble.second {
        background-color: #989898;
    }
    .top-bubble.third {
        background-color: #ae7441;
    }
</style>
