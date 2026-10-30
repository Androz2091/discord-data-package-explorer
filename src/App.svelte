<script>
    import { jwtDecode } from 'jwt-decode';
    import { onMount } from 'svelte';
    import { Router, Route } from 'svelte-routing';

    import Header from './components/Header.svelte';
    import Footer from './components/Footer.svelte';

    import Stats from './views/Stats.svelte';
    import Loader from './views/Loader.svelte';
    import Help from './views/Help.svelte';
    import About from './views/About.svelte';

    import Modal from 'svelte-simple-modal';

    import { SvelteToast, toast } from '@zerodevx/svelte-toast';
    import { diswhoCompleted } from './app/store';

    const options = {
        duration: 10000
    };

    onMount(() => {
        const paramDiswhoJwt = new URLSearchParams(window.location.search).get('diswhoJwt');
        if(paramDiswhoJwt){
            window.history.replaceState(null, document.title, location.pathname);
            localStorage.setItem('diswhoJwt', paramDiswhoJwt);
            diswhoCompleted.set(true);
            toast.push('Thank you for completing the captcha.', {
                theme: {
                    '--toastBackground': '#18191c',
                    '--toastColor': 'white',
                    '--toastBarBackground': '#3b82f6'
                }
            });
        }
        const storeDiswhoJwt = localStorage.getItem('diswhoJwt');
        if (storeDiswhoJwt && jwtDecode(storeDiswhoJwt).expirationTimestamp > Date.now()) {
            diswhoCompleted.set(true);
        } else {
            diswhoCompleted.set(false);
        }
    });

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
				<!-- With Svelte 5, svelte-routing calls a `component` prop that isn't a class, so routes render their children. -->
				<Route path="/about"><About /></Route>
				<Route path="/stats"><Stats /></Route>
				<Route path="/stats/demo"><Stats /></Route>
				<Route path="/help"><Help /></Route>
				<Route path="/*"><Loader /></Route>
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
