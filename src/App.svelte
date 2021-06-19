<script>
	import { loaded } from './app/store';

	import Header from './components/Header.svelte';
	import Footer from './components/Footer.svelte';
	
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
		<Header />
		<div>
			{#if $loaded}
				<Home />
			{:else}
				<Loader />
			{/if}
		</div>
		<Footer />
	</Modal>
</main>

<style>
	.app {
		min-height: 100vh;
		display: grid;
		grid-template-rows: 1fr auto;
	}
</style>
