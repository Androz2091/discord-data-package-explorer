<script>
    export let background;
    export let square = false;
</script>

<div class="frame" class:square style:background>
    <slot name="texture"></slot>
    <div class="content">
        <slot></slot>
    </div>
    <div class="footer">
        <div class="brand">
            <span class="mark">#</span>
            ddpe.androz2091.fr
        </div>
        <div class="range">Lifetime</div>
    </div>
</div>

<style>
    .frame {
        position: relative;
        display: flex;
        flex-direction: column;
        flex-shrink: 0;
        box-sizing: border-box;
        width: 1080px;
        height: 1920px;
        overflow: hidden;
        padding: 236px 88px 0;
        color: #fff;
        font-family: 'Rubik Variable', sans-serif;
        font-weight: 400;
        line-height: normal;
        text-align: left;
        font-variant-numeric: tabular-nums;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        user-select: none;
    }

    .frame :global(*) {
        box-sizing: border-box;
    }

    .square {
        height: 1080px;
        padding-top: 88px;
    }

    .content {
        position: relative;
        display: flex;
        flex: 1;
        flex-direction: column;
        min-height: 0;
    }

    .footer {
        position: absolute;
        right: 88px;
        bottom: 150px;
        left: 88px;
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    .square .footer {
        bottom: 64px;
    }

    .brand {
        display: flex;
        align-items: center;
        gap: 24px;
        font-size: 42px;
        font-weight: 800;
        letter-spacing: -0.01em;
    }

    /* The site header's `#` tag. */
    .mark {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 84px;
        height: 84px;
        border-radius: 13px;
        background: #5865f2;
        box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.14);
        transform: rotate(-4deg);
        font-size: 55px;
        font-weight: 600;
        line-height: 1;
        letter-spacing: 0;
    }

    .square .mark {
        width: 72px;
        height: 72px;
        border-radius: 11px;
        font-size: 47px;
    }

    .range {
        padding: 14px 30px;
        border-radius: 9999px;
        background: rgba(255, 255, 255, 0.14);
        font-size: 34px;
        font-weight: 700;
        letter-spacing: 0.01em;
    }
</style>
