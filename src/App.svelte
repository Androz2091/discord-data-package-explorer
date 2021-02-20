<script>
	import { loaded } from './app/store';

	import Home from './views/Home.svelte';
	import Loader from './views/Loader.svelte';
</script>

<svelte:head>
	<title>Discord Data Package Explorer</title>
	<meta property=”og:description” content="Explore and extract the data of your discord data package file!" />
</svelte:head>

<main class="app">
	{#if $loaded}
		<Home />
	{:else}
		<Loader />
	{/if}
</main>

<style>
</style>
