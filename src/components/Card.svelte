<script>
    export let name;
</script>

<div class="card {name}">
    <slot></slot>
</div>

<style>
    .card {
        background-color: #202225;
        border-radius: 10px;
        padding: 20px;
    }
    @media (min-width: 600px) {
        .card.first {
            grid-column: 4 / 8;
        }
        .card.second {
            grid-column: 8 / 12;
        }
        .card.third {
            grid-column: 6 / 12;
        }
        .card.top-users {
            grid-column: 1 / 6;
            grid-row: 2 / 5;
        }
        .card.hours {
            grid-column: 6 / 12;
        }
        .card.profile {
            grid-column: 1 / 4;
        }
    }
</style>