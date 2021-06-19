<template>
    <div class="app-header">
        <div class="app-header-container">
            <div class="app-header-icon tag"><a href="/">#</a></div>
            <h1 on:click="{() => window.location.href = '/'}">Discord Data Package Explorer</h1>
        </div>
    </div>
</template>

<style lang="scss">
    .app-header {
        width: 100%;
        position: fixed;
        background-color: var(--secondary-background-color);
    }
    .app-header-container {
        text-align: center;
        display: flex;
        align-items: center;
        justify-content: center;

        h1 {
            font-size: 1.5rem;
            font-weight: 800;
            cursor: pointer;
        }
    }
    .app-header-icon {
        text-align: center;

        a {
            color: white !important;
            text-decoration: none;
        }
    }
</style>
