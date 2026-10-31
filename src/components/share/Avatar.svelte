<script>
    import { initials } from './data';

    // An image as data, or `null` for the initials on `background`.
    export let src;
    export let name;
    export let background;
    export let size;
    export let server = false;
    export let ring = null;
</script>

{#if src}
    <img {src} alt={name} width={size} height={size} draggable="false" class:server style:width="{size}px" style:height="{size}px" style:box-shadow={ring} />
{:else}
    <div class="initials" class:server aria-hidden="true" style:width="{size}px" style:height="{size}px" style:font-size="{Math.round(size * 0.36)}px" style:background style:box-shadow={ring}>
        {initials(name)}
    </div>
{/if}

<style>
    img,
    .initials {
        display: block;
        flex-shrink: 0;
        border-radius: 50%;
    }

    img {
        object-fit: cover;
    }

    .initials {
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;
        color: #fff;
        font-weight: 800;
        letter-spacing: -0.02em;
        white-space: nowrap;
    }

    .server {
        border-radius: 30%;
    }
</style>
