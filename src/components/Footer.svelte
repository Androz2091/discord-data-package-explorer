<script>
    import { link } from 'svelte-routing';
</script>

<template>
	<footer>
        <p>Made with ❤️ by <a href="https://twitter.com/Androz2091" target="_blank">Androz2091</a>. DDPE is an <a href="https://github.com/Androz2091/discord-data-package-explorer" target="_blank">open source</a> software. <a href="/about" use:link>About</a>.</p>
	</footer>
</template>

<style>
    footer {
        grid-row-start: 2;
        grid-row-end: 3;
        background-color: var(--third-background-color);
        padding-top: 1rem;
        padding-bottom: 1rem;
        margin-top: 2rem;
    }

    footer p {
        margin: 0;
        margin-left: 1rem;
    }
</style>
