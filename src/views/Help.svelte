<script>
    import { link } from 'svelte-routing';
</script>

<div class="help">
    <div>
        Here is a short TikTok video ✨ to show you how to request your Discord Data Package! Note that this is also possible on mobile device using the iOS and Android Discord apps!
    </div>
    <div class="tiktok-player">
        <!-- svelte-ignore a11y-media-has-caption -->
        <video controls width="250">

            <source src="help-tiktok.mp4"
                    type="video/webm">
        
            Sorry, your browser doesn't support embedded videos.
        </video>
    </div>
</div>

<style>
    .help {
        padding-top: 7rem;
		max-width: 768px;
		margin: auto;
	}
    .tiktok-player {
        margin-top: 2rem;
        text-align: center;
    }
</style>
