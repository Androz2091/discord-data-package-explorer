<script>
    import Ranking from './Ranking.svelte';

    export let data;
</script>

<!-- Packages rarely carry a server's icon, so a server shows its initials, as Discord does without one. -->
<Ranking
    seed={data.seed ^ 19}
    background="linear-gradient(165deg, #059669 0%, #065f46 50%, #022c22 100%)"
    eyebrow="Your top servers"
    headline="Your hangouts"
    items={data.servers}
    picture="server"
    light="#d1fae5"
    pale="#a7f3d0"
    dark="#065f46"
    texture={0.12}
/>
