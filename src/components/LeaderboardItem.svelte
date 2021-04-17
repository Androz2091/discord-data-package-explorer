<script>
    export let username;
    export let discriminator;
    export let position;
    export let avatarURL;
    export let count;
    export let word;
    import SvelteTooltip from 'svelte-tooltip'
</script>

<div class="top-item">
    <div class="top-whois">
        <div class="top-bubble { position === 0 ? 'first' : position === 1 ? 'second' : position === 2 ? 'third' : '' }">{ position + 1 }</div>
        <img class="top-avatar" src="{avatarURL}" alt="Avatar" />
        <h3 class="top-name">{username} <small class="text-muted">#{discriminator}</small></h3>
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
    }
    .top-item:last-child {
        border-bottom: 0;
    }
    .top-avatar {
        border-radius: 50%;
        height: 50px;
        margin-right: 10px;
    }
    .top-name {
        margin-left: inherit;
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
