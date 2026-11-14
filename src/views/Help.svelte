<div class="help">
    <button class="go-back-button" on:click={() => window.location.href = '/'}>Go back to the home page</button>
    <div>
        <ol>
            <li>Click on "User Settings", the cog in the bottom left corner. On your phone, tap your avatar, then the cog.</li>
            <li>Click on "Data & Privacy".</li>
            <li>Under "Request your data", click on "Request Data" ("Request all of my data" on your phone).</li>
            <li>Tick "Account", "Your Activity", "Messages" and "Servers", then click on "Request My Data". Without "Account", DDPE can't read your package.</li>
            <li>Wait for the email from Discord with the download link: it can take up to 30 days. 🥳</li>
        </ol>
    </div>

    <div>
        Here is a short TikTok video ✨ to show you how to request your Discord Data Package! Discord's screens have changed a little since it was made: the steps above are today's.
    </div>
    <div class="tiktok-player">
        <video controls width="250">

            <source src="https://github.com/Androz2091/discord-data-package-explorer/raw/master/assets/help-tiktok.mp4"
                    type="video/webm">
        
            Sorry, your browser doesn't support embedded videos.
        </video>
    </div>
</div>

<style>
    .go-back-button {
        background-color: #ffffff;
        color: black;
        border: none;
        padding: 0.5rem 1rem;
        border-radius: 0.25rem;
    }
    .help {
        margin-right: 0.5rem;
        margin-left: 0.5rem;
        padding-top: 7rem;
		max-width: 768px;
	}
    .tiktok-player {
        margin-top: 2rem;
        text-align: center;
    }
    @media (min-width: 1080px) {
        .help {
            margin: auto;
        }
    }
</style>
