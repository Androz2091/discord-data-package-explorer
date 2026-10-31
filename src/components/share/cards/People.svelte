<script>
    import Ranking from './Ranking.svelte';

    export let data;
</script>

<Ranking
    seed={data.seed ^ 11}
    background="linear-gradient(165deg, #f43f5e 0%, #be123c 48%, #4c0519 100%)"
    eyebrow="Your top DMs"
    headline="Your people"
    items={data.people}
    picture="person"
    light="#ffe4e6"
    pale="#fecdd3"
    dark="#be123c"
/>
