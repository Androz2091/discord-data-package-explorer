<script>
  import { onMount } from "svelte";
  import { Router, Route } from "svelte-routing";
  import decodeJwt from "jwt-decode";

  import Header from "./components/Header.svelte";
  import Footer from "./components/Footer.svelte";

  import Stats from "./views/Stats.svelte";
  import Loader from "./views/Loader.svelte";
  import Help from "./views/Help.svelte";
  import About from "./views/About.svelte";

  import Modal from "svelte-simple-modal";

  import { SvelteToast } from "@zerodevx/svelte-toast";

  const options = {
    duration: 10000,
  };

  onMount(() => {
    const paramDiswhoJwt = new URLSearchParams(window.location.search).get("diswhoJwt"),
      storeDiswhoJwt = localStorage.getItem("diswhoJwt");
    if (paramDiswhoJwt) {
      window.history.replaceState(null, document.title, location.pathname);
      localStorage.setItem("diswhoJwt", paramDiswhoJwt);
    } else if (!storeDiswhoJwt || (storeDiswhoJwt && decodeJwt(storeDiswhoJwt).expirationTimestamp < Date.now())) {
      window.location.replace(`https://diswho.androz2091.fr?returnUrl=${window.location.href}`);
    }
  });
</script>

<svelte:head>
  <title>Discord Data Package Explorer</title>
</svelte:head>

<main class="app">
  <SvelteToast {options} />
  <Modal styleContent={{ "background-color": "#18191c", color: "white" }} closeOnOuterClick={false} closeOnEsc={false}>
    <Router>
      <Header />
      <div>
        <Route path="/about" component={About} />
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
