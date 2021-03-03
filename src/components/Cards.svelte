<div class="cards">
    <slot></slot>
</div>

<style>
    .cards {
        display: grid;
        grid-gap: 10px;
    }
    @media (min-width: 600px) {
        .cards {
            grid-template-columns: repeat(12, 1fr);
        }
    }
</style>
