<script>
    import { onMount } from 'svelte';
    import { fetchDMUsers } from '../../app/extractor';
    import { CARDS, shareData, topPeople } from './data';
    import { STORY, SQUARE, canShareFiles, capture, download, loadFont, loadImage } from './capture';
    import Cover from './cards/Cover.svelte';
    import Messages from './cards/Messages.svelte';
    import People from './cards/People.svelte';
    import Servers from './cards/Servers.svelte';
    import PeakHour from './cards/PeakHour.svelte';
    import Words from './cards/Words.svelte';
    import Habits from './cards/Habits.svelte';
    import Summary from './cards/Summary.svelte';

    // The stats page's data, read when the sheet opens.
    export let source;
    export let onClose;

    const COMPONENTS = { cover: Cover, messages: Messages, people: People, servers: Servers, peakHour: PeakHour, words: Words, habits: Habits, summary: Summary, summarySquare: Summary };
    const GAP = 12;
    // Lets a swipe settle before the card it lands on is drawn.
    const DRAW_DELAY = 250;

    let dialog;
    let scroller;
    // On a phone, a page wider than the screen (long names, for eg.) widens the area fixed elements are laid
    // out in, so the sheet fills the part of the page the screen shows rather than centering in that area.
    const view = window.visualViewport;
    const visible = () => (view ? { left: view.offsetLeft, top: view.offsetTop, width: view.width, height: view.height } : { left: 0, top: 0, width: window.innerWidth, height: window.innerHeight });
    let screen = visible();
    let data = null;
    let cards = [];
    let selected = 0;
    let drawings = {};
    let shareable = false;
    let failed = false;
    let queue = Promise.resolve();
    let timer;

    const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const prepare = async () => {
        const font = loadFont();
        // Names for the people card that "Show more" hasn't looked up yet.
        const unnamed = topPeople(source).filter((dm) => !dm.userData);
        if (unnamed.length) await fetchDMUsers(unnamed);
        const card = shareData(source);
        const [avatar, ...avatars] = await Promise.all([card.user.avatar, ...card.people.map((person) => person.avatar)].map(loadImage));
        await font;
        data = { ...card, user: { ...card.user, avatar }, people: card.people.map((person, i) => ({ ...person, avatar: avatars[i] })) };
        cards = CARDS.filter((candidate) => candidate.shown(data));
    };

    onMount(() => {
        const follow = () => {
            screen = visible();
        };
        (view || window).addEventListener('resize', follow);
        view?.addEventListener('scroll', follow);
        dialog.showModal();
        // A click on the backdrop lands on the dialog itself, around the panel.
        dialog.addEventListener('click', (event) => event.target === dialog && dialog.close());
        shareable = canShareFiles();
        prepare().catch((error) => {
            console.error(error);
            failed = true;
        });
        return () => {
            (view || window).removeEventListener('resize', follow);
            view?.removeEventListener('scroll', follow);
            clearTimeout(timer);
        };
    });

    // The previews are the cards at full size, scaled down to leave the sheet's title and buttons about
    // 300 px of height and the next card peeking out.
    $: contentWidth = Math.min(screen.width - 64, 416);
    $: scale = Math.max(0.15, Math.min(0.28, (screen.height - 300) / STORY.height, (contentWidth - 56) / STORY.width));
    $: slideWidth = Math.round(STORY.width * scale);

    const onScroll = () => {
        selected = Math.max(0, Math.min(cards.length - 1, Math.round(scroller.scrollLeft / (slideWidth + GAP))));
    };
    const go = (index) => scroller.scrollTo({ left: index * (slideWidth + GAP), behavior: reducedMotion() ? 'auto' : 'smooth' });

    // The selected card is drawn into a PNG once the carousel settles on it, so "Share" can hand the image
    // over within the tap, which Safari's Web Share API requires.
    const draw = (card) => {
        drawings = { ...drawings, [card.kind]: { status: 'pending' } };
        // One at a time: a swipe during a drawing waits for it.
        queue = queue.then(async () => {
            try {
                const node = scroller.querySelector(`[data-card="${card.kind}"] .frame`);
                const blob = await capture(node, card.square ? SQUARE : STORY);
                drawings = { ...drawings, [card.kind]: { status: 'ready', blob } };
            } catch (error) {
                console.error(error);
                drawings = { ...drawings, [card.kind]: { status: 'error' } };
            }
        });
    };

    $: card = cards[selected];
    $: drawing = card && drawings[card.kind];
    $: status = drawing ? drawing.status : 'pending';
    $: if (card && !drawing) {
        clearTimeout(timer);
        timer = setTimeout(() => draw(card), DRAW_DELAY);
    }
    $: name = card && `ddpe-${card.file}.png`;

    const share = async () => {
        if (status !== 'ready') return;
        const file = new File([drawing.blob], name, { type: 'image/png' });
        try {
            if (navigator.canShare({ files: [file] })) {
                await navigator.share({ title: 'Here is my Discord recap!', text: 'Made on https://ddpe.androz2091.fr, try it yourself!', files: [file] });
                return;
            }
            download(drawing.blob, name);
        } catch (error) {
            // Closing the share sheet rejects too.
            if (error.name !== 'AbortError') download(drawing.blob, name);
        }
    };

    const retry = () => {
        const others = { ...drawings };
        delete others[card.kind];
        drawings = others;
    };
</script>

<dialog
    bind:this={dialog}
    aria-labelledby="share-title"
    on:close={onClose}
    style:left="{screen.left}px"
    style:top="{screen.top}px"
    style:width="{screen.width}px"
    style:height="{screen.height}px"
>
    <div class="panel">
        <div class="head">
            <div>
                <h2 id="share-title">Share your recap</h2>
                <p>Drawn on your device. Nothing leaves it until you share.</p>
            </div>
            <button type="button" class="dismiss" aria-label="Close" on:click={() => dialog.close()}>
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 18 18 6M6 6l12 12" /></svg>
            </button>
        </div>
        {#if data}
            <div class="carousel">
                <!-- Focusable, so arrow keys move through the cards. -->
                <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
                <div
                    class="slides"
                    bind:this={scroller}
                    on:scroll={onScroll}
                    role="region"
                    aria-label="Your recap cards"
                    tabindex="0"
                    style:gap="{GAP}px"
                    style:padding-inline="calc(50% - {slideWidth / 2}px)"
                    style:height="{Math.round(STORY.height * scale)}px"
                >
                    {#each cards as item, i}
                        <div
                            class="slide"
                            data-card={item.kind}
                            role="group"
                            aria-roledescription="slide"
                            aria-label={item.label}
                            aria-current={i === selected}
                            style:width="{slideWidth}px"
                            style:height="{Math.round((item.square ? SQUARE : STORY).height * scale)}px"
                        >
                            <div class="scaler" style:transform="scale({scale})">
                                {#if item.square}
                                    <svelte:component this={COMPONENTS[item.kind]} {data} square />
                                {:else}
                                    <svelte:component this={COMPONENTS[item.kind]} {data} />
                                {/if}
                            </div>
                        </div>
                    {/each}
                </div>
                <button type="button" class="nav previous" aria-label="Previous card" disabled={selected === 0} on:click={() => go(selected - 1)}>
                    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15.75 19.5 8.25 12l7.5-7.5" /></svg>
                </button>
                <button type="button" class="nav next" aria-label="Next card" disabled={selected === cards.length - 1} on:click={() => go(selected + 1)}>
                    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m8.25 4.5 7.5 7.5-7.5 7.5" /></svg>
                </button>
            </div>
            <div class="dots">
                {#each cards as item, i}
                    <button type="button" aria-label={item.label} aria-current={i === selected} on:click={() => go(i)}>
                        <span class:current={i === selected}></span>
                    </button>
                {/each}
            </div>
            <div class="actions">
                {#if status === 'error'}
                    <button type="button" class="danger" on:click={retry}>Couldn't draw this card. Try again</button>
                {:else}
                    {#if shareable}
                        <button type="button" disabled={status !== 'ready'} aria-busy={status === 'pending'} on:click={share}>
                            {status === 'pending' ? 'Generating...' : 'Share'}
                        </button>
                    {/if}
                    <button type="button" class:secondary={shareable} disabled={status !== 'ready'} aria-busy={status === 'pending'} on:click={() => download(drawing.blob, name)}>
                        {status === 'pending' && !shareable ? 'Generating...' : 'Download'}
                    </button>
                {/if}
            </div>
        {:else if failed}
            <p class="failed">Your cards couldn't be made. Close this and try again.</p>
        {:else}
            <div class="skeleton" style:height="{Math.round(STORY.height * scale)}px"></div>
        {/if}
    </div>
</dialog>

<style>
    dialog {
        position: fixed;
        inset: 0 auto auto 0;
        box-sizing: border-box;
        max-width: none;
        max-height: none;
        margin: 0;
        padding: 16px;
        overflow: auto;
        overscroll-behavior: contain;
        border: none;
        background: none;
        color: #fff;
    }

    dialog[open] {
        display: flex;
    }

    dialog::backdrop {
        background: rgba(3, 7, 18, 0.8);
        animation: fade 0.25s ease-out;
    }

    @keyframes fade {
        from {
            opacity: 0;
        }
    }

    @keyframes rise {
        from {
            opacity: 0;
            transform: translateY(16px);
        }
    }

    /* At the bottom of a phone's screen. Auto margins, unlike centering, let a short screen scroll to its top. */
    .panel {
        box-sizing: border-box;
        width: 100%;
        max-width: 448px;
        margin: auto auto 0;
        padding: 16px;
        border: 1px solid rgba(255, 255, 255, 0.08);
        border-radius: 16px;
        background: #18191c;
        box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);
        animation: rise 0.25s ease-out;
    }

    .head {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: 8px;
        margin-bottom: 16px;
    }

    h2 {
        margin: 0;
        font-size: 1.125rem;
        font-weight: 700;
    }

    p {
        margin: 4px 0 0;
        color: #b9bbbe;
        font-size: 0.875rem;
        line-height: 1.4;
    }

    button {
        font: inherit;
        cursor: pointer;
    }

    svg {
        display: block;
        width: 24px;
        height: 24px;
    }

    /* `main.css` fills every path. */
    path {
        fill: none;
        stroke: currentColor;
        stroke-width: 1.5;
        stroke-linecap: round;
        stroke-linejoin: round;
    }

    .dismiss {
        flex-shrink: 0;
        margin: -4px;
        padding: 4px;
        border: none;
        border-radius: 50%;
        background: none;
        color: #b9bbbe;
    }

    .dismiss:hover {
        color: #fff;
    }

    .carousel {
        position: relative;
    }

    .slides {
        display: flex;
        align-items: center;
        overflow-x: auto;
        overscroll-behavior-x: contain;
        scroll-snap-type: x mandatory;
        scrollbar-width: none;
    }

    .slides::-webkit-scrollbar {
        display: none;
    }

    .slides:focus-visible {
        outline: 2px solid #5865f2;
        outline-offset: 2px;
        border-radius: 12px;
    }

    .slide {
        position: relative;
        flex-shrink: 0;
        overflow: hidden;
        border-radius: 12px;
        background: #2f3136;
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.3);
        scroll-snap-align: center;
        scroll-snap-stop: always;
    }

    .scaler {
        position: absolute;
        top: 0;
        left: 0;
        transform-origin: top left;
    }

    .nav {
        position: absolute;
        top: 50%;
        display: none;
        padding: 8px;
        border: none;
        border-radius: 50%;
        background: rgba(3, 7, 18, 0.7);
        color: #fff;
        transform: translateY(-50%);
        transition: opacity 0.15s;
    }

    .nav svg {
        width: 20px;
        height: 20px;
    }

    .nav:disabled {
        opacity: 0;
        cursor: default;
    }

    .previous {
        left: 0;
    }

    .next {
        right: 0;
    }

    .dots {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        margin-top: 8px;
    }

    .dots button {
        padding: 4px;
        border: none;
        background: none;
    }

    .dots span {
        display: block;
        width: 8px;
        height: 8px;
        border-radius: 9999px;
        background: #4f545c;
        transition: width 0.2s, background-color 0.2s;
    }

    .dots span.current {
        width: 20px;
        background: #7dd3fc;
    }

    .actions {
        display: flex;
        gap: 8px;
        margin-top: 12px;
    }

    .actions button {
        flex: 1;
        padding: 0.75rem 1rem;
        border: none;
        border-radius: 5px;
        background: var(--main-color);
        color: #fff;
        font-weight: 600;
    }

    .actions button.secondary {
        background: #4f545c;
    }

    .actions button.danger {
        background: #ed4245;
    }

    .actions button:disabled {
        opacity: 0.75;
        cursor: default;
    }

    .failed {
        margin: 0;
        padding: 24px 0;
        color: #fff;
        font-size: 1rem;
        text-align: center;
    }

    .skeleton {
        border-radius: 12px;
        background: #2f3136;
        animation: pulse 1.5s ease-in-out infinite;
    }

    @keyframes pulse {
        50% {
            opacity: 0.5;
        }
    }

    @media (min-width: 640px) {
        .panel {
            margin: auto;
        }

        h2 {
            font-size: 1.5rem;
        }

        .nav {
            display: block;
        }
    }

    @media (prefers-reduced-motion: reduce) {
        dialog::backdrop,
        .panel,
        .failed {
        margin: 0;
        padding: 24px 0;
        color: #fff;
        font-size: 1rem;
        text-align: center;
    }

    .skeleton {
            animation: none;
        }

        .nav,
        .dots span {
            transition: none;
        }
    }
</style>
