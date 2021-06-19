<script>
	import { Router, Route } from "svelte-routing";

	import Header from './components/Header.svelte';
	import Footer from './components/Footer.svelte';
	
	import Stats from './views/Stats.svelte';
	import Loader from './views/Loader.svelte';
	import Help from "./views/Help.svelte";

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
		closeOnOuterClick={false}
		closeOnEsc={false}
	>
		<Router>
			<Header />
			<div>
				<Route path="/stats" component={Stats} />
				<Route path="/stats/demo" component={Stats} />
				<Route path="/help" component={Help} />
				<Route path="/*" component={Loader} />
			</div>
			<Footer />
		</Router>
	</Modal>
</main>

<style>
	.app {
		min-height: 100vh;
		display: grid;
		grid-template-rows: 1fr auto;
	}
</style>
