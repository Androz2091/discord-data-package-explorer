<script>
    import Ranking from './Ranking.svelte';

    export let data;

    const items = data.words.map(({ word, count }) => ({ name: word, count }));
</script>

<Ranking
    seed={data.seed ^ 13}
    background="linear-gradient(165deg, #8b5cf6 0%, #6d28d9 48%, #2e1065 100%)"
    eyebrow="Your top words"
    headline="Your words"
    {items}
    unit={['time', 'times']}
    light="#ede9fe"
    pale="#ddd6fe"
    dark="#6d28d9"
/>
