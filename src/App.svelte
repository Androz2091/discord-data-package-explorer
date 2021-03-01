<script>
	import { loaded } from './app/store';

	import Home from './views/Home.svelte';
	import Loader from './views/Loader.svelte';

	import Modal from 'svelte-simple-modal';

	import { SvelteToast } from '@zerodevx/svelte-toast'

	const options = {
		duration: 10000
	}
</script>

<svelte:head>
	<title>Discord Data Package Explorer</title>
</svelte:head>

<main class="app">
	<SvelteToast {options} />
	<Modal
		styleContent={{ 'background-color': '#18191c', color: 'white' }}
		closeButton={false}
	>
		{#if $loaded}
			<Home />
		{:else}
			<Loader />
		{/if}
	</Modal>
</main>

<style>
	.app {
		width: 100vw;
		height: 100vh;
	}
</style>
